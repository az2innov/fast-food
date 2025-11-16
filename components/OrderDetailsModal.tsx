import React from 'react';
import { Order } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface OrderDetailsModalProps {
    order: Order | null;
    isOpen: boolean;
    onClose: () => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, isOpen, onClose }) => {
    const { t, language } = useLanguage();

    if (!isOpen || !order) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg transform transition-all" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-xl font-bold">{t('admin.orderDetailsModal.title')} #{order.id}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold text-gray-600">{t('admin.customer')}:</h3>
                            <p>{order.customerName}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-600">Phone:</h3>
                            <p>{order.customerPhone}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-600">{t('admin.orderDate')}:</h3>
                            <p>{new Date(order.createdAt).toLocaleString(language)}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-600">{t('admin.status')}:</h3>
                            <p>{t(`orderStatus.statuses.${order.status}`)}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold border-t pt-3 mt-3 mb-2">{t('checkout.receipt.summary')}</h3>
                        <ul className="divide-y divide-gray-200 border rounded-lg">
                            {order.items.map(item => (
                                <li key={item.id} className="p-3 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-sm text-gray-500">{item.quantity} x {item.price.toFixed(2)} {t('currency')}</p>
                                    </div>
                                    <span className="font-medium">{(item.quantity * item.price).toFixed(2)} {t('currency')}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg">
                        <span>{t('admin.total')}:</span>
                        <span>{order.total.toFixed(2)} {t('currency')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
