
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { submitOrder } from '../services/api';
import { Order } from '../types';
import { CashVerificationModal } from './CashVerificationModal';

interface CheckoutProps {
    onOrderPlaced: (order: Order) => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ onOrderPlaced }) => {
    const { state, dispatch } = useCart();
    const { t } = useLanguage();
    const { user } = useAuth();
    const [customerName, setCustomerName] = useState(user?.name || '');
    const [customerPhone, setCustomerPhone] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

    const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    const handleConfirmCashOrder = async () => {
        setIsVerificationModalOpen(false);
        setIsProcessing(true);
        try {
            const newOrder = await submitOrder(state.items, customerName, customerPhone, 'cash');
            dispatch({ type: 'CLEAR_CART' });
            onOrderPlaced(newOrder);
        } catch (error) {
            console.error("Failed to submit order", error);
            // Here you would show an error message to the user
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!customerName || !customerPhone || state.items.length === 0) return;

        if (paymentMethod === 'cash') {
            setIsVerificationModalOpen(true);
            return; // Don't submit yet, wait for verification
        }

        // Card payment logic
        setIsProcessing(true);
        try {
            // This is a simulation for card payment. In a real app, you'd integrate a payment gateway.
            const newOrder = await submitOrder(state.items, customerName, customerPhone, 'card');
            dispatch({ type: 'CLEAR_CART' });
            onOrderPlaced(newOrder);
        } catch (error) {
            console.error("Failed to submit order", error);
            // Here you would show an error message to the user
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            <CashVerificationModal 
                isOpen={isVerificationModalOpen}
                onClose={() => setIsVerificationModalOpen(false)}
                onVerify={handleConfirmCashOrder}
            />
            <div className="container mx-auto max-w-2xl px-4 py-12">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">{t('checkout.title')}</h1>
                <div className="bg-white rounded-lg shadow-xl p-8">
                    <div className="mb-6 border-b pb-4">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                        {state.items.map(item => (
                            <div key={item.id} className="flex justify-between text-gray-600 mb-2">
                                <span>{item.name} x {item.quantity}</span>
                                <span>{(item.price * item.quantity).toFixed(2)} {t('currency')}</span>
                            </div>
                        ))}
                        <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
                            <span>{t('cart.total')}</span>
                            <span>{total.toFixed(2)} {t('currency')}</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            {/* Customer Info */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-2">Your Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">{t('checkout.customerName')}</label>
                                        <input type="text" id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" required />
                                    </div>
                                    <div>
                                        <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700">{t('checkout.customerPhone')}</label>
                                        <input type="tel" id="customerPhone" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="e.g., 05 XX XX XX XX" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" required />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-2">{t('checkout.paymentMethod')}</h3>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button type="button" onClick={() => setPaymentMethod('card')} className={`flex-1 p-4 border rounded-lg text-left transition-all ${paymentMethod === 'card' ? 'border-red-500 ring-2 ring-red-500' : 'border-gray-300'}`}>
                                        <h4 className="font-semibold">{t('checkout.cardPayment')}</h4>
                                        <p className="text-sm text-gray-500">Visa, MasterCard</p>
                                    </button>
                                    <button type="button" onClick={() => setPaymentMethod('cash')} className={`flex-1 p-4 border rounded-lg text-left transition-all ${paymentMethod === 'cash' ? 'border-red-500 ring-2 ring-red-500' : 'border-gray-300'}`}>
                                        <h4 className="font-semibold">{t('checkout.cashPayment')}</h4>
                                        <p className="text-sm text-gray-500">Pay upon delivery or pickup</p>
                                    </button>
                                </div>
                            </div>

                            {/* Card Details (Conditional) */}
                            {paymentMethod === 'card' && (
                                <div className="space-y-4 border-t pt-6">
                                    <div>
                                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">{t('checkout.cardNumber')}</label>
                                        <input type="text" id="cardNumber" placeholder="•••• •••• •••• 4242" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" required />
                                    </div>
                                    <div className="flex space-x-4">
                                        <div className="flex-1">
                                            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">{t('checkout.expiryDate')}</label>
                                            <input type="text" id="expiryDate" placeholder="MM/YY" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" required />
                                        </div>
                                        <div className="flex-1">
                                            <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">{t('checkout.cvc')}</label>
                                            <input type="text" id="cvc" placeholder="123" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" required />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Cash Payment Info */}
                            {paymentMethod === 'cash' && (
                                <div className="border-t pt-6">
                                    <p className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">{t('checkout.cashPaymentInfo')}</p>
                                </div>
                            )}
                        </div>
                        
                        <button type="submit" disabled={isProcessing} className="w-full mt-8 bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors text-lg disabled:bg-red-300">
                            {isProcessing ? 'Processing...' : (paymentMethod === 'card' ? t('checkout.payNow') : t('checkout.placeOrder'))}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};
