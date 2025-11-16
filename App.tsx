import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Menu } from './components/Menu';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { OrderStatus } from './components/OrderStatus';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { getMenu, getPromotions } from './services/api';
import { MenuItem, Order, Promotion } from './types';

type View = 'menu' | 'checkout' | 'track' | 'admin' | 'orderSuccess' | 'adminLogin';

const AppContent: React.FC = () => {
    const [view, setView] = useState<View>('menu');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastOrder, setLastOrder] = useState<Order | null>(null);
    const { user } = useAuth();
    const { t, language } = useLanguage();
    
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [items, promos] = await Promise.all([getMenu(), getPromotions()]);
            setMenuItems(items);
            setPromotions(promos);
        } catch (error) {
            console.error("Failed to fetch initial data with details:", error);
            let errorMessage = "An unexpected error occurred. Please check the browser console for details.";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            setError(`Failed to load menu data from the database. Reason: ${errorMessage}. Please ensure your Supabase project has the required tables and that row-level security (RLS) is configured to allow read access for the 'anon' role.`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    // Improved routing logic to be declarative and state-driven
    useEffect(() => {
        // When user becomes an admin, automatically navigate to the admin dashboard.
        if (user?.role === 'admin' && view !== 'admin') {
            setView('admin');
        } 
        // If the user is not an admin but is trying to access the admin view, redirect them to the login page.
        else if (view === 'admin' && user?.role !== 'admin') {
            setView('adminLogin');
        }
    }, [view, user]);

    const handleNavigate = useCallback((newView: 'menu' | 'track' | 'admin' | 'adminLogin') => {
        setView(newView);
        window.scrollTo(0, 0);
    }, []);

    const handleCartToggle = useCallback(() => {
        setIsCartOpen(prev => !prev);
    }, []);
    
    const handleCheckout = useCallback(() => {
        setIsCartOpen(false);
        setView('checkout');
        window.scrollTo(0, 0);
    }, []);
    
    const handleOrderPlaced = useCallback((order: Order) => {
        setLastOrder(order);
        setView('orderSuccess');
        window.scrollTo(0, 0);
    }, []);

    const activePromotions = promotions.filter(p => p.isActive);

    const renderView = () => {
        if (isLoading && view === 'menu') { // Only show global loading for initial menu load
            return <div className="text-center p-10">Loading menu...</div>;
        }

        if (error) {
            return (
                <div className="container mx-auto max-w-3xl px-4 py-12 text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Database Connection Error</h2>
                    <p className="text-gray-700 bg-red-50 p-6 rounded-md shadow-md">{error}</p>
                </div>
            );
        }

        switch (view) {
            case 'menu':
                return <Menu menuItems={menuItems} activePromotions={activePromotions} />;
            case 'checkout':
                return <Checkout onOrderPlaced={handleOrderPlaced} />;
            case 'track':
                return <OrderStatus />;
            case 'admin':
                // The useEffect hook now protects this route.
                return user?.role === 'admin' ? <AdminDashboard menuItems={menuItems} promotions={promotions} onDataChange={fetchData} /> : null;
            case 'adminLogin':
                return <AdminLogin />;
            case 'orderSuccess': {
                if (!lastOrder) return null; // Safety check

                const prepTimeBase = 5; // minutes
                const prepTimePerItem = 2; // minutes
                const totalItems = lastOrder.items.reduce((sum, item) => sum + item.quantity, 0);
                const estimatedPrepTime = prepTimeBase + (totalItems * prepTimePerItem);

                return (
                    <div className="container mx-auto max-w-2xl px-4 py-12">
                        <div className="bg-white p-6 sm:p-10 rounded-lg shadow-xl">
                            {/* Header */}
                            <div className="text-center border-b pb-6 mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">{t('checkout.receipt.title')}</h1>
                                <p className="text-gray-600">{t('checkout.success')}</p>
                            </div>

                            {/* Order Details */}
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
                                <div>
                                    <strong className="block">{t('checkout.receipt.orderId')}:</strong>
                                    <span>#{lastOrder.id}</span>
                                </div>
                                <div className="text-right">
                                    <strong className="block">{t('checkout.receipt.date')}:</strong>
                                    <span>{new Date(lastOrder.createdAt).toLocaleString(language)}</span>
                                </div>
                                <div>
                                    <strong className="block">{t('checkout.customerName')}:</strong>
                                    <span>{lastOrder.customerName}</span>
                                </div>
                                <div className="text-right">
                                    <strong className="block">{t('checkout.paymentMethod')}:</strong>
                                    <span>{t(`checkout.${lastOrder.paymentMethod}Payment`)}</span>
                                </div>
                            </div>

                            {/* Items Table */}
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold mb-2">{t('checkout.receipt.summary')}</h2>
                                <div className="divide-y divide-gray-200 border rounded-lg overflow-hidden">
                                    {lastOrder.items.map(item => (
                                        <div key={item.id} className="flex justify-between items-center p-3">
                                            <div>
                                                <p className="font-semibold">{item.name}</p>
                                                <p className="text-sm text-gray-500">{item.quantity} x {item.price.toFixed(2)} {t('currency')}</p>
                                            </div>
                                            <p className="font-semibold">{(item.quantity * item.price).toFixed(2)} {t('currency')}</p>
                                        </div>
                                    ))}
                                    <div className="flex justify-between items-center p-3 bg-gray-50 font-bold text-lg">
                                        <p>{t('cart.total')}</p>
                                        <p>{lastOrder.total.toFixed(2)} {t('currency')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Preparation Time */}
                            <div className="bg-blue-50 p-4 rounded-lg text-center mb-8">
                                <p className="font-semibold text-blue-800">{t('checkout.receipt.prepTime')}</p>
                                <p className="text-2xl font-bold text-blue-900">~ {estimatedPrepTime} {t('checkout.receipt.minutes')}</p>
                            </div>

                            <OrderStatus initialOrderId={lastOrder.id} />
                        </div>
                    </div>
                );
            }
            default:
                return <Menu menuItems={menuItems} activePromotions={activePromotions} />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header onNavigate={handleNavigate} onCartToggle={handleCartToggle} />
            <main className="flex-grow">
                {renderView()}
            </main>
            <Cart isOpen={isCartOpen} onClose={handleCartToggle} onCheckout={handleCheckout} />
            <footer className="bg-gray-800 text-white text-center p-4 mt-auto">
                <p>&copy; 2026 {t('appName')}. All rights reserved.</p>
            </footer>
        </div>
    );
}

const App: React.FC = () => {
    return (
        <LanguageProvider>
            <AuthProvider>
                <CartProvider>
                    <AppContent />
                </CartProvider>
            </AuthProvider>
        </LanguageProvider>
    );
};

export default App;