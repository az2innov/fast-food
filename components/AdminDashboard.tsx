
import React, { useState, useEffect, useCallback } from 'react';
import { 
    getLiveOrders, 
    updateOrderStatus, 
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    addPromotion,
    updatePromotion,
    deletePromotion
} from '../services/api';
import { Order, MenuItem, Promotion, Category, OrderStatusType } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { OrderDetailsModal } from './OrderDetailsModal';
import { AddEditMenuItemModal } from './AddEditMenuItemModal';
import { EditPromotionModal } from './EditPromotionModal';

interface AdminDashboardProps {
    menuItems: MenuItem[];
    promotions: Promotion[];
    onDataChange: () => void;
}

// Local Confirmation Modal Component for better UX without creating a new file
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
            {t('checkout.verification.cancel')}
          </button>
          <button onClick={onConfirm} className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold">
            {t('admin.confirmDelete.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};


export const AdminDashboard: React.FC<AdminDashboardProps> = ({ menuItems, promotions, onDataChange }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isOrdersLoading, setIsOrdersLoading] = useState(true);
    const { t, language } = useLanguage();

    // Modal States
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isMenuItemModalOpen, setIsMenuItemModalOpen] = useState(false);
    const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
    const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
    const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ type: 'menu' | 'promo', id: number } | null>(null);


    // Form state for new promotion
    const [newPromoName, setNewPromoName] = useState('');
    const [newPromoDesc, setNewPromoDesc] = useState('');
    const [newPromoDiscount, setNewPromoDiscount] = useState<number | ''>('');
    const [newPromoCategory, setNewPromoCategory] = useState<Category | 'all'>('all');

    const fetchOrders = useCallback(async () => {
        try {
            const liveOrders = await getLiveOrders();
            setOrders(liveOrders);
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setIsOrdersLoading(false);
        }
    }, []);

    useEffect(() => {
        setIsOrdersLoading(true);
        fetchOrders();
        const interval = setInterval(fetchOrders, 10000); // Refresh every 10 seconds
        return () => clearInterval(interval);
    }, [fetchOrders]);
    
    const handleStatusUpdate = async (id: number, status: OrderStatusType) => {
        await updateOrderStatus(id, status);
        fetchOrders();
    };
    
    const handleShowDetails = (order: Order) => {
        setSelectedOrder(order);
        setIsDetailsModalOpen(true);
    }
    
    const handleSaveMenuItem = async (item: Omit<MenuItem, 'id'> | MenuItem) => {
        if ('id' in item) {
            await updateMenuItem(item);
        } else {
            await addMenuItem(item);
        }
        setIsMenuItemModalOpen(false);
        setEditingMenuItem(null);
        onDataChange();
    }

    const openDeleteConfirm = (type: 'menu' | 'promo', id: number) => {
        setItemToDelete({ type, id });
        setIsConfirmModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;

        try {
            if (itemToDelete.type === 'menu') {
                await deleteMenuItem(itemToDelete.id);
                alert(t('admin.alerts.deleteSuccess'));
            } else if (itemToDelete.type === 'promo') {
                await deletePromotion(itemToDelete.id);
                alert(t('admin.alerts.promoDeleteSuccess'));
            }
            onDataChange();
        } catch (error) {
            console.error("Delete failed:", error);
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            if (itemToDelete.type === 'menu') {
                alert(`${t('admin.alerts.deleteError')}\n${errorMessage}`);
            } else {
                alert(`${t('admin.alerts.promoDeleteError')}\n${errorMessage}`);
            }
        } finally {
            setIsConfirmModalOpen(false);
            setItemToDelete(null);
        }
    };


    const handleSavePromotion = async (promo: Promotion) => {
        await updatePromotion(promo);
        setIsPromoModalOpen(false);
        setEditingPromo(null);
        onDataChange();
    }

    const handleTogglePromo = async (promo: Promotion) => {
        await updatePromotion({ ...promo, isActive: !promo.isActive });
        onDataChange();
    }
    
    const handleAddPromo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPromoName || !newPromoDiscount || +newPromoDiscount <= 0) return;
        await addPromotion({
            name: newPromoName,
            description: newPromoDesc,
            discountPercentage: +newPromoDiscount,
            applicableCategory: newPromoCategory,
        });
        // reset form
        setNewPromoName('');
        setNewPromoDesc('');
        setNewPromoDiscount('');
        setNewPromoCategory('all');
        onDataChange();
    }

    if (isOrdersLoading) {
        return <div className="text-center p-10">Loading...</div>;
    }
    
    const getStatusClass = (status: OrderStatusType) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'preparing': return 'bg-blue-100 text-blue-800';
            case 'ready': return 'bg-indigo-100 text-indigo-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }
    
    return (
        <>
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title={t('admin.confirmDelete.title')}
                message={itemToDelete?.type === 'promo' ? t('admin.confirmDelete.messagePromo') : t('admin.confirmDelete.message')}
            />
            <OrderDetailsModal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} order={selectedOrder} />
            <AddEditMenuItemModal isOpen={isMenuItemModalOpen} onClose={() => { setIsMenuItemModalOpen(false); setEditingMenuItem(null); }} onSave={handleSaveMenuItem} item={editingMenuItem} />
            <EditPromotionModal isOpen={isPromoModalOpen} onClose={() => { setIsPromoModalOpen(false); setEditingPromo(null); }} onSave={handleSavePromotion} promotion={editingPromo} />
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">{t('admin.dashboard')}</h1>
                
                {/* Orders Section */}
                <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">{t('admin.orders')}</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.orderId')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.customer')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.orderDate')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.total')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.status')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.updateStatus')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.map(order => (
                                    <tr key={order.id} className={`${order.status === 'cancelled' ? 'bg-gray-100 opacity-60' : ''}`}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customerName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleString(language)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.total.toFixed(2)} {t('currency')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}>
                                                {t(`orderStatus.statuses.${order.status}`)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <select onChange={(e) => handleStatusUpdate(order.id, e.target.value as OrderStatusType)} value={order.status} className="border-gray-300 rounded-md">
                                                <option value="pending">{t('orderStatus.statuses.pending')}</option>
                                                <option value="preparing">{t('orderStatus.statuses.preparing')}</option>
                                                <option value="ready">{t('orderStatus.statuses.ready')}</option>
                                                <option value="delivered">{t('orderStatus.statuses.delivered')}</option>
                                                <option value="cancelled">{t('orderStatus.statuses.cancelled')}</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button onClick={() => handleShowDetails(order)} className="text-indigo-600 hover:text-indigo-900">{t('admin.details')}</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Menu Items Section */}
                <div className="bg-white rounded-lg shadow-xl p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold text-gray-700">{t('admin.menuItems')}</h2>
                        <button onClick={() => setIsMenuItemModalOpen(true)} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">{t('admin.addMenuItem')}</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {menuItems.map(item => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t(`menu.categories.${item.category}`)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.price.toFixed(2)} {t('currency')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button onClick={() => { setEditingMenuItem(item); setIsMenuItemModalOpen(true); }} className="text-indigo-600 hover:text-indigo-900">{t('admin.edit')}</button>
                                            <button onClick={() => openDeleteConfirm('menu', item.id)} className="text-red-600 hover:text-red-900">{t('admin.delete')}</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Promotions Section */}
                <div className="bg-white rounded-lg shadow-xl p-6 mt-8">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">{t('admin.promotions.title')}</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {promotions.map(promo => (
                                    <tr key={promo.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{promo.name}</div>
                                            <div className="text-sm text-gray-500">{promo.description}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{promo.discountPercentage}%</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{promo.applicableCategory}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${promo.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {promo.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button onClick={() => { setEditingPromo(promo); setIsPromoModalOpen(true); }} className="text-indigo-600 hover:text-indigo-900">{t('admin.edit')}</button>
                                            <button onClick={() => handleTogglePromo(promo)} className="text-gray-600 hover:text-gray-900">
                                                {promo.isActive ? 'Deactivate' : 'Activate'}
                                            </button>
                                            <button onClick={() => openDeleteConfirm('promo', promo.id)} className="text-red-600 hover:text-red-900">{t('admin.delete')}</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Add Promotion Form */}
                    <div className="mt-8 border-t pt-6">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">{t('admin.addPromotionForm.title')}</h3>
                        <form onSubmit={handleAddPromo} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="promoName" className="block text-sm font-medium text-gray-700">{t('admin.addPromotionForm.name')}</label>
                                    <input type="text" id="promoName" value={newPromoName} onChange={e => setNewPromoName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"/>
                                </div>
                                <div>
                                    <label htmlFor="promoDiscount" className="block text-sm font-medium text-gray-700">{t('admin.addPromotionForm.discount')}</label>
                                    <input type="number" id="promoDiscount" value={newPromoDiscount} onChange={e => setNewPromoDiscount(e.target.value === '' ? '' : Number(e.target.value))} required min="1" max="100" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"/>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="promoDesc" className="block text-sm font-medium text-gray-700">{t('admin.addPromotionForm.description')}</label>
                                <input type="text" id="promoDesc" value={newPromoDesc} onChange={e => setNewPromoDesc(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"/>
                            </div>
                            <div>
                                <label htmlFor="promoCategory" className="block text-sm font-medium text-gray-700">{t('admin.addPromotionForm.category')}</label>
                                <select id="promoCategory" value={newPromoCategory} onChange={e => setNewPromoCategory(e.target.value as Category | 'all')} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md">
                                    <option value="all">{t('menu.categories.all')}</option>
                                    <option value="burgers">{t('menu.categories.burgers')}</option>
                                    <option value="sides">{t('menu.categories.sides')}</option>
                                    <option value="drinks">{t('menu.categories.drinks')}</option>
                                    <option value="desserts">{t('menu.categories.desserts')}</option>
                                </select>
                            </div>
                            <div>
                                <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                    {t('admin.addPromotionForm.add')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};
