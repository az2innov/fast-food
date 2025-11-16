import React, { useState, useCallback } from 'react';
import { getOrder } from '../services/api';
import { Order } from '../types';
import { useLanguage } from '../context/LanguageContext';

const StatusTimeline: React.FC<{ status: Order['status'] }> = ({ status }) => {
    const statuses: Order['status'][] = ['pending', 'preparing', 'ready', 'delivered'];
    const currentStatusIndex = statuses.indexOf(status);
    const { t } = useLanguage();

    return (
        <div className="mt-8">
            <ol className="flex items-center w-full">
                {statuses.map((s, index) => (
                    <li key={s} className={`flex w-full items-center ${index <= currentStatusIndex ? 'text-blue-600 dark:text-blue-500' : 'text-gray-400'} after:content-[''] after:w-full after:h-1 after:border-b ${index <= currentStatusIndex -1 ? 'after:border-blue-600' : 'after:border-gray-200'} after:border-4 after:inline-block`}>
                        <div className="flex flex-col items-center">
                            <span className={`flex items-center justify-center w-10 h-10 ${index <= currentStatusIndex ? 'bg-blue-100' : 'bg-gray-100'} rounded-full lg:h-12 lg:w-12 shrink-0`}>
                                {index <= currentStatusIndex ? 
                                    <svg className="w-5 h-5 text-blue-600 lg:w-6 lg:h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                    :
                                    <svg className="w-5 h-5 text-gray-500 lg:w-6 lg:h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 12a1 1 0 112 0 1 1 0 01-2 0zM9 5a1 1 0 112 0 1 1 0 01-2 0z"></path></svg>
                                }
                            </span>
                             <span className="text-xs sm:text-sm text-center mt-2">{t(`orderStatus.statuses.${s}`)}</span>
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
};

export const OrderStatus: React.FC<{ initialOrderId?: number }> = ({ initialOrderId }) => {
    const [orderId, setOrderId] = useState(initialOrderId?.toString() || '');
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { t, language } = useLanguage();

    const trackOrderById = useCallback(async (idToTrack: string) => {
        if (!idToTrack) return;

        setIsLoading(true);
        setError('');
        setOrder(null);

        try {
            const parsedOrderId = parseInt(idToTrack.trim(), 10);
            if (isNaN(parsedOrderId)) {
                setError(t('orderStatus.notFound'));
                setIsLoading(false);
                return;
            }
            const foundOrder = await getOrder(parsedOrderId);
            if (foundOrder) {
                setOrder(foundOrder);
            } else {
                setError(t('orderStatus.notFound'));
            }
        } catch (err) {
            setError('An error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [t]);


    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        trackOrderById(orderId);
    };

    React.useEffect(() => {
        if (initialOrderId) {
            const idString = initialOrderId.toString();
            setOrderId(idString);
            trackOrderById(idString);
        }
    }, [initialOrderId, trackOrderById]);

    return (
        <div className="container mx-auto max-w-3xl px-4 py-12">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">{t('orderStatus.title')}</h1>
            <div className="bg-white rounded-lg shadow-xl p-8">
                <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        placeholder={t('orderStatus.enterId')}
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    />
                    <button type="submit" disabled={isLoading} className="bg-red-600 text-white font-bold py-2 px-6 rounded-md hover:bg-red-700 transition-colors disabled:bg-red-300">
                        {isLoading ? 'Tracking...' : t('orderStatus.track')}
                    </button>
                </form>

                {error && <p className="text-red-500 text-center mt-4">{error}</p>}

                {order && (
                    <div className="mt-8 border-t pt-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('admin.orderDetailsModal.title')}</h2>
                        
                        {/* Order Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-6 text-gray-700">
                            <p><strong>{t('checkout.receipt.orderId')}:</strong> #{order.id}</p>
                            <p><strong>{t('admin.customer')}:</strong> {order.customerName}</p>
                            <p><strong>{t('checkout.receipt.date')}:</strong> {new Date(order.createdAt).toLocaleString(language)}</p>
                            <p><strong>{t('cart.total')}:</strong> {order.total.toFixed(2)} {t('currency')}</p>
                            <div className="sm:col-span-2">
                                <p><strong>{t('orderStatus.status')}:</strong> <span className="font-bold text-lg text-blue-600">{t(`orderStatus.statuses.${order.status}`)}</span></p>
                            </div>
                        </div>
                        
                        {/* Items List */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2 text-gray-800">{t('checkout.receipt.summary')}</h3>
                            <div className="divide-y divide-gray-200 border rounded-lg overflow-hidden">
                                {order.items.map(item => (
                                    <div key={item.id} className="flex justify-between items-center p-3">
                                        <div>
                                            <p className="font-semibold">{item.name}</p>
                                            <p className="text-sm text-gray-500">{item.quantity} x {item.price.toFixed(2)} {t('currency')}</p>
                                        </div>
                                        <p className="font-semibold">{(item.quantity * item.price).toFixed(2)} {t('currency')}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Estimated Preparation Time */}
                        <div className="bg-blue-50 p-4 rounded-lg text-center mb-8">
                             <p className="font-semibold text-blue-800">{t('checkout.receipt.prepTime')}</p>
                             {(() => {
                                const prepTimeBase = 5; // minutes
                                const prepTimePerItem = 2; // minutes
                                const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
                                const estimatedPrepTime = prepTimeBase + (totalItems * prepTimePerItem);
                                return <p className="text-2xl font-bold text-blue-900">~ {estimatedPrepTime} {t('checkout.receipt.minutes')}</p>;
                            })()}
                        </div>
                        
                        <StatusTimeline status={order.status} />
                    </div>
                )}
            </div>
        </div>
    );
};
