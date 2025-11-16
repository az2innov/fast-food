import React, { useState } from 'react';
import { MenuItem, Category, Promotion } from '../types';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

interface MenuProps {
  menuItems: MenuItem[];
  activePromotions: Promotion[];
}

const MenuItemCard: React.FC<{ item: MenuItem; promotion: Promotion | undefined }> = ({ item, promotion }) => {
    const { dispatch } = useCart();
    const { t } = useLanguage();
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

    const handleImageLoad = () => {
        setIsImageLoading(false);
    };

    const handleImageError = () => {
        setIsImageLoading(false);
        setImageError(true);
    };

    const originalPrice = item.price;
    const isOnSale = !!promotion;
    const discountedPrice = isOnSale ? originalPrice * (1 - promotion.discountPercentage / 100) : null;
    const finalPrice = discountedPrice !== null ? discountedPrice : originalPrice;

    const handleAddToCart = () => {
        dispatch({ type: 'ADD_ITEM', payload: { ...item, price: finalPrice } });
    };

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
            <div className="relative h-48">
                {/* The image is always rendered to ensure the browser loads it. Its visibility is controlled by opacity. */}
                <img 
                    className={`w-full h-full object-cover transition-opacity duration-300 ${isImageLoading || imageError ? 'opacity-0' : 'opacity-100'}`}
                    src={item.imageUrl} 
                    alt={item.name} 
                    loading="lazy" 
                    onLoad={handleImageLoad}
                    onError={handleImageError} 
                />

                {/* Skeleton Loader: shown on top of the (invisible) image while loading */}
                {isImageLoading && (
                    <div className="absolute inset-0 w-full h-full bg-gray-300 animate-pulse"></div>
                )}
                
                {/* Error Placeholder: shown if the image fails to load */}
                {imageError && (
                     <div className="absolute inset-0 w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}

                <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
                    {/* Programmatic promotion (e.g., Weekend Burger Fest) */}
                    <div>
                        {isOnSale && (
                            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                                {promotion.name}
                            </span>
                        )}
                    </div>

                    {/* Simple item-specific promotion (e.g., New!) */}
                    <div>
                        {item.promotion && (
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                {t('menu.promotion')}
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-600 text-sm mt-1 h-10">{item.description}</p>
                {item.promotion && <p className="text-sm text-green-600 mt-2 font-medium">{item.promotion}</p>}
                <div className="flex items-center justify-between mt-4">
                    {isOnSale && discountedPrice !== null ? (
                        <div>
                            <span className="text-xl font-bold text-red-600">{discountedPrice.toFixed(2)} {t('currency')}</span>
                            <span className="text-sm line-through text-gray-500 ml-2">{originalPrice.toFixed(2)} {t('currency')}</span>
                        </div>
                    ) : (
                        <span className="text-xl font-bold text-gray-900">{item.price.toFixed(2)} {t('currency')}</span>
                    )}
                    <button onClick={handleAddToCart} className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-full hover:bg-red-700 transition-colors">
                        {t('menu.addToCart')}
                    </button>
                </div>
            </div>
        </div>
    );
};


export const Menu: React.FC<MenuProps> = ({ menuItems, activePromotions }) => {
    const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
    const { t } = useLanguage();

    const categories: { key: Category | 'all', label: string }[] = [
        { key: 'all', label: t('menu.categories.all') },
        { key: 'burgers', label: t('menu.categories.burgers') },
        { key: 'sides', label: t('menu.categories.sides') },
        { key: 'drinks', label: t('menu.categories.drinks') },
        { key: 'desserts', label: t('menu.categories.desserts') },
    ];

    const filteredItems = selectedCategory === 'all'
        ? menuItems
        : menuItems.filter(item => item.category === selectedCategory);
    
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">{t('menu.title')}</h1>
            <div className="flex justify-center mb-8">
                <div className="flex space-x-2 sm:space-x-4 bg-gray-200 p-1 rounded-full">
                    {categories.map(({key, label}) => (
                         <button
                            key={key}
                            onClick={() => setSelectedCategory(key)}
                            className={`px-4 sm:px-6 py-2 text-sm sm:text-base font-medium rounded-full transition-colors ${selectedCategory === key ? 'bg-white text-red-600 shadow' : 'text-gray-600 hover:bg-gray-300'}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredItems.map(item => {
                    const applicablePromotion = activePromotions.find(
                        promo => promo.applicableCategory === 'all' || promo.applicableCategory === item.category
                    );
                    return <MenuItemCard key={item.id} item={item} promotion={applicablePromotion} />;
                })}
            </div>
        </div>
    );
};