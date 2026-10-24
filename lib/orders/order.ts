import type { Product } from '@/lib/types';

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export type OrderItem = {
  productId: string;
  product: Product;
  size: string;
  color: { name: string; hex: string };
  quantity: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  items: OrderItem[];
  subtotal: number;
  status: OrderStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

const STORAGE_KEY = 'prolific-orders';

function generateOrderNumber(existing: Order[]): string {
  const numbers = existing
    .map((o) => {
      const match = o.orderNumber.match(/PC-(\d+)/);
      return match ? Number(match[1]) : 0;
    })
    .filter((n) => n > 0);
  const next = numbers.length ? Math.max(...numbers) + 1 : 1;
  return `PC-${String(next).padStart(3, '0')}`;
}

export function loadOrders(): Order[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as Order[];
  } catch {
    return [];
  }
}

export function saveOrder(order: Order): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = loadOrders();
    const alreadyExists = existing.find((o) => o.id === order.id);
    const next = alreadyExists
      ? existing.map((o) => (o.id === order.id ? order : o))
      : [...existing, order];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch (error) {
    console.error('Failed to save order', error);
  }
}

export function deleteOrder(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = loadOrders();
    const next = existing.filter((o) => o.id !== id);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch (error) {
    console.error('Failed to delete order', error);
  }
}

export function createOrderNumber(): string {
  return generateOrderNumber(loadOrders());
}

export const ORDER_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'text-[#d3c7b0]',
  confirmed: 'text-[#d3b88b]',
  shipped: 'text-[#b8ac9a]',
  delivered: 'text-[#a99d84]',
  cancelled: 'text-[#a99d84]',
};
