import type { Product } from '@/lib/types';

export type CartItem = {
  id: string;
  productId: string;
  product: Product;
  size: string;
  color: { name: string; hex: string };
  quantity: number;
};

export type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  itemCount: number;
  subtotal: number;
};
