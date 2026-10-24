import type { Product } from '@/lib/types';

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export type OrderItemInput = {
  productId: string;
  product: Product;
  size: string;
  color: { name: string; hex: string };
  quantity: number;
};

export type OrderInput = {
  id?: string;
  orderNumber?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  items: OrderItemInput[];
  subtotal: number;
  status: OrderStatus;
  notes: string;
};

export type OrderRecord = OrderInput & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

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
