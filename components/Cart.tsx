
import React from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { CartItem } from '../types';

interface CartProps {
    isOpen: boolean;
    onClose: () => void;
    onCheckout: () => void;
}

const CartItemRow: React.FC<{ item: CartItem }> = ({ item }) => {
    const { dispatch } = useCart();
    const { t } = useLanguage();

    return (
        <div className="flex items-center space-x-4 py-3">
            <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-md object-cover"/>
            <div className="flex-1">
                <h4 className="font-semibold text-gray-800 text-sm">{item.name}</h4>
                <p className="text-gray-500 text-sm">{item.price.toFixed(2)} {t('currency')}</p>
                <div className="flex items-center mt-1">
                     <button onClick={() => dispatch({type: 'UPDATE_QUANTITY', payload: {id: item.id, quantity: item.quantity - 1}})} className="px-2 py-0.5 border rounded-l">-</button>
                     <span className="px-3 py-0.5 border-t border-b">{item.quantity}</span>
                     <button onClick={() => dispatch({type: 'UPDATE_QUANTITY', payload: {id: item.id, quantity: item.quantity + 1}})} className="px-2 py-0.5 border rounded-r">+</button>
                </div>
            </div>
            <div className="text-right">
                <p className="font-bold text-gray-800">{(item.price * item.quantity).toFixed(2)} {t('currency')}</p>
                <button onClick={() => dispatch({type: 'REMOVE_ITEM', payload: item.id})} className="text-red-500 text-xs hover:underline mt-1">{t('cart.remove')}</button>
            </div>
        </div>
    );
}

export const Cart: React.FC<CartProps> = ({ isOpen, onClose, onCheckout }) => {
    const { state } = useCart();
    const { t } = useLanguage();
    const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <>
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}></div>
            <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl z-50 transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b">
                        <h2 className="text-2xl font-bold text-gray-800">{t('cart.title')}</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 divide-y">
                        {state.items.length === 0 ? (
                            <p className="text-center text-gray-500 py-10">{t('cart.empty')}</p>
                        ) : (
                            state.items.map(item => <CartItemRow key={item.id} item={item} />)
                        )}
                    </div>
                    
                    {state.items.length > 0 && (
                        <div className="p-4 border-t bg-gray-50">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-lg font-medium text-gray-700">{t('cart.subtotal')}:</span>
                                <span className="text-xl font-bold text-gray-900">{subtotal.toFixed(2)} {t('currency')}</span>
                            </div>
                            <button onClick={onCheckout} className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors text-lg">
                                {t('cart.checkout')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};