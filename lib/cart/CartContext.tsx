'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { CartContextValue, CartItem } from './types';

const CartContext = createContext<CartContextValue | undefined>(undefined);

const CART_STORAGE_KEY = 'prolific-cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load cart', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save cart', error);
    }
  }, [items]);

  const addItem = (item: Omit<CartItem, 'id'>) => {
    setItems((prev) => {
      const existing = prev.find(
        (cartItem) =>
          cartItem.productId === item.productId &&
          cartItem.size === item.size &&
          cartItem.color.name === item.color.name
      );
      if (existing) {
        return prev.map((cartItem) =>
          cartItem.id === existing.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      }
      return [...prev, { ...item, id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}` }];
    });
    setIsOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)));
  };

  const clearCart = () => setItems([]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      toggleCart: () => setIsOpen((prev) => !prev),
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    }),
    [items, isOpen]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
