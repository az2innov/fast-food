
import React, { useState, useEffect } from 'react';
import { Promotion, Category } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface EditPromotionModalProps {
    promotion: Promotion | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (promotion: Promotion) => void;
}

export const EditPromotionModal: React.FC<EditPromotionModalProps> = ({ promotion, isOpen, onClose, onSave }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState<Promotion | null>(promotion);

    useEffect(() => {
        setFormData(promotion);
    }, [promotion, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!formData) return;
        const { name, value } = e.target;
        setFormData(prev => prev ? { ...prev, [name]: name === 'discountPercentage' ? parseFloat(value) || 0 : value } : null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData) {
            onSave(formData);
        }
    };

    if (!isOpen || !formData) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-4">{t('admin.editPromotionModal.title')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('admin.addPromotionForm.name')}</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">{t('admin.addPromotionForm.description')}</label>
                        <input type="text" name="description" id="description" value={formData.description} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                    </div>
                    <div>
                        <label htmlFor="discountPercentage" className="block text-sm font-medium text-gray-700">{t('admin.addPromotionForm.discount')}</label>
                        <input type="number" name="discountPercentage" id="discountPercentage" value={formData.discountPercentage} onChange={handleChange} required min="1" max="100" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                    </div>
                    <div>
                        <label htmlFor="applicableCategory" className="block text-sm font-medium text-gray-700">{t('admin.addPromotionForm.category')}</label>
                        <select name="applicableCategory" id="applicableCategory" value={formData.applicableCategory} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md">
                            <option value="all">{t('menu.categories.all')}</option>
                            <option value="burgers">{t('menu.categories.burgers')}</option>
                            <option value="sides">{t('menu.categories.sides')}</option>
                            <option value="drinks">{t('menu.categories.drinks')}</option>
                            <option value="desserts">{t('menu.categories.desserts')}</option>
                        </select>
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
