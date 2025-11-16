import { supabase } from './supabaseClient';
import { MenuItem, Order, CartItem, Promotion } from '../types';

// Helper to handle Supabase errors
const handleSupabaseError = (error: any, context: string) => {
    if (error) {
        console.error(`Supabase error in ${context}:`, error);
        throw new Error(error.message);
    }
};

// Map raw order data from Supabase to our application's Order type
const mapSupabaseOrder = (orderData: any): Order => ({
    ...orderData,
    createdAt: new Date(orderData.created_at),
});

export const getMenu = async (): Promise<MenuItem[]> => {
    // Reverted to read from the original 'menu_items' table to fix the error.
    const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('id', { ascending: true });
    
    handleSupabaseError(error, 'getMenu');
    return data || [];
};

export const getOrder = async (id: number): Promise<Order | null> => {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116: "The result contains 0 rows"
      handleSupabaseError(error, 'getOrder');
    }
    return data ? mapSupabaseOrder(data) : null;
}

export const submitOrder = async (
    items: CartItem[], 
    customerName: string, 
    customerPhone: string,
    paymentMethod: 'card' | 'cash'
): Promise<Order> => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    const { data, error } = await supabase
        .from('orders')
        .insert([{ 
            items, 
            customerName,
            customerPhone,
            paymentMethod, 
            total, 
            status: 'pending' 
        }])
        .select()
        .single();
    
    handleSupabaseError(error, 'submitOrder');
    if (!data) throw new Error("Order creation failed, no data returned.");
    return mapSupabaseOrder(data);
};

export const getLiveOrders = async(): Promise<Order[]> => {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error && error.code === '42P01') {
        console.warn("Orders table not found. Admin dashboard will show no orders.");
        return [];
    }

    handleSupabaseError(error, 'getLiveOrders');
    return (data || []).map(mapSupabaseOrder);
}

export const updateOrderStatus = async(id: number, status: Order['status']): Promise<Order> => {
    const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
        
    handleSupabaseError(error, 'updateOrderStatus');
    if (!data) throw new Error("Order update failed, no data returned.");
    return mapSupabaseOrder(data);
}

export const addMenuItem = async(item: Omit<MenuItem, 'id'>): Promise<MenuItem> => {
    const { data, error } = await supabase
        .from('menu_items')
        .insert([item])
        .select()
        .single();

    handleSupabaseError(error, 'addMenuItem');
    if (!data) throw new Error("Menu item creation failed.");
    return data;
}

export const updateMenuItem = async(item: MenuItem): Promise<MenuItem> => {
    const { id, ...updateData } = item;
    const { data, error } = await supabase
        .from('menu_items')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

    handleSupabaseError(error, 'updateMenuItem');
    if (!data) throw new Error("Menu item update failed.");
    return data;
}

export const deleteMenuItem = async(id: number): Promise<void> => {
    const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

    handleSupabaseError(error, 'deleteMenuItem');
}

export const getPromotions = async (): Promise<Promotion[]> => {
    const { data, error } = await supabase
        .from('promotions')
        .select('*');
        
    // Gracefully handle missing table
    if (error && error.code === '42P01') {
        console.warn("Promotions table not found. Continuing without promotions.");
        return [];
    }

    handleSupabaseError(error, 'getPromotions');
    return data || [];
}

export const addPromotion = async(promo: Omit<Promotion, 'id' | 'isActive'>): Promise<Promotion> => {
    const newPromoData = { ...promo, isActive: true };
    const { data, error } = await supabase
        .from('promotions')
        .insert([newPromoData])
        .select()
        .single();

    handleSupabaseError(error, 'addPromotion');
    if (!data) throw new Error("Promotion creation failed.");
    return data;
}

export const updatePromotion = async(promo: Promotion): Promise<Promotion> => {
    const { id, ...updateData } = promo;
    const { data, error } = await supabase
        .from('promotions')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
    
    handleSupabaseError(error, 'updatePromotion');
    if (!data) throw new Error("Promotion update failed.");
    return data;
}

export const deletePromotion = async(id: number): Promise<void> => {
    const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', id);

    handleSupabaseError(error, 'deletePromotion');
}