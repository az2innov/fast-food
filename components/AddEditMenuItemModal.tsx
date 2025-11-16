import React, { useState, useEffect } from 'react';
import { MenuItem, Category } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface AddEditMenuItemModalProps {
    item: Omit<MenuItem, 'id'> | MenuItem | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (item: Omit<MenuItem, 'id'> | MenuItem) => void;
}

const emptyItem: Omit<MenuItem, 'id'> = {
    name: '',
    description: '',
    price: 0,
    category: 'burgers',
    imageUrl: '',
};

export const AddEditMenuItemModal: React.FC<AddEditMenuItemModalProps> = ({ item, isOpen, onClose, onSave }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState(item || emptyItem);
    const isEditing = item && 'id' in item;

    useEffect(() => {
        setFormData(item || emptyItem);
    }, [item, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-4">{isEditing ? t('admin.editMenuItemModal.title') : t('admin.addMenuItemModal.title')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('admin.menuItemForm.name')}</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">{t('admin.menuItemForm.description')}</label>
                        <input type="text" name="description" id="description" value={formData.description} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">{t('admin.menuItemForm.price')}</label>
                        <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">{t('admin.menuItemForm.category')}</label>
                        <select name="category" id="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md">
                            <option value="burgers">{t('menu.categories.burgers')}</option>
                            <option value="sides">{t('menu.categories.sides')}</option>
                            <option value="drinks">{t('menu.categories.drinks')}</option>
                            <option value="desserts">{t('menu.categories.desserts')}</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">{t('admin.menuItemForm.imageUrl')}</label>
                        <input type="text" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                    </div>
                    <div className="mt-6 flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">{t('checkout.verification.cancel')}</button>
                        <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold">{t('admin.menuItemForm.save')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
