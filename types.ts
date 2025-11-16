import { ReactNode, Dispatch } from 'react';

export type Category = 'burgers' | 'sides' | 'drinks' | 'desserts';

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: Category;
  imageUrl: string;
  promotion?: string; // e.g., "2 for 1" or "Save 20%"
}

export interface Promotion {
  id: number;
  name: string;
  description: string;
  discountPercentage: number;
  applicableCategory: Category | 'all';
  isActive: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
  customizations?: string[];
}

export type OrderStatusType = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface Order {
  id: number;
  items: CartItem[];
  total: number;
  status: OrderStatusType;
  customerName: string;
  customerPhone: string;
  paymentMethod: 'card' | 'cash';
  createdAt: Date;
}

export interface User {
  id:string;
  name: string;
  role: 'customer' | 'admin';
}

export type Language = 'en' | 'fr' | 'ar';

export interface Translations {
  [key: string]: string | Translations;
}

export interface AppTranslations {
  en: Translations;
  fr: Translations;
  ar: Translations;
}

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export interface CartState {
  items: CartItem[];
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: MenuItem }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' };

export interface CartContextType {
  state: CartState;
  // Fix: Use Dispatch type directly to resolve 'Cannot find namespace React' error. The import was also updated.
  dispatch: Dispatch<CartAction>;
}

export interface AuthContextType {
  user: User | null;
  login: (name: string, role: 'customer' | 'admin') => void;
  logout: () => void;
}

export interface ChildrenProp {
  children: ReactNode;
}