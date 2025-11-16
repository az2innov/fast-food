
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface HeaderProps {
    onNavigate: (view: 'menu' | 'track' | 'admin' | 'adminLogin') => void;
    onCartToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, onCartToggle }) => {
    const { language, setLanguage, t } = useLanguage();
    const { user, login, logout } = useAuth();
    const { state: cartState } = useCart();

    const cartItemCount = cartState.items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <header className="bg-white shadow-md sticky top-0 z-40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0 cursor-pointer" onClick={() => onNavigate('menu')}>
                        <span className="text-2xl font-bold text-red-600">{t('appName')}</span>
                    </div>

                    <nav className="hidden md:flex items-center space-x-8">
                        <button onClick={() => onNavigate('menu')} className="text-gray-600 hover:text-red-600 font-medium transition-colors">{t('nav.menu')}</button>
                        <button onClick={() => onNavigate('track')} className="text-gray-600 hover:text-red-600 font-medium transition-colors">{t('nav.trackOrder')}</button>
                        {user?.role === 'admin' && (
                             <button onClick={() => onNavigate('admin')} className="text-gray-600 hover:text-red-600 font-medium transition-colors">{t('nav.admin')}</button>
                        )}
                    </nav>

                    <div className="flex items-center space-x-4">
                         {user ? (
                            <div className="flex items-center space-x-2">
                                <span className="text-gray-700 hidden sm:inline">{t('auth.welcome')}, {user.name}</span>
                                <button onClick={logout} className="text-sm text-gray-500 hover:text-red-600">{t('auth.logout')}</button>
                            </div>
                        ) : (
                            <div className="hidden sm:flex items-center space-x-2">
                                <button onClick={() => onNavigate('adminLogin')} className="text-sm text-gray-600 hover:text-red-600">{t('auth.loginAsAdmin')}</button>
                            </div>
                        )}
                        <div className="flex items-center">
                            <button onClick={() => setLanguage('en')} className={`px-2 font-bold ${language === 'en' ? 'text-red-600' : 'text-gray-400'}`}>EN</button>
                            <span className="text-gray-300">|</span>
                            <button onClick={() => setLanguage('fr')} className={`px-2 font-bold ${language === 'fr' ? 'text-red-600' : 'text-gray-400'}`}>FR</button>
                             <span className="text-gray-300">|</span>
                            <button onClick={() => setLanguage('ar')} className={`px-2 font-bold ${language === 'ar' ? 'text-red-600' : 'text-gray-400'}`}>AR</button>
                        </div>
                        <button onClick={onCartToggle} className="relative text-gray-600 hover:text-red-600 p-2">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.658-.463 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
                            </svg>
                            {cartItemCount > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">{cartItemCount}</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};