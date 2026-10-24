'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { OrderItemInput, OrderInput, OrderRecord, OrderStatus } from './constants';
import {
  ORDER_STATUSES,
  STATUS_LABELS,
  STATUS_COLORS,
} from './constants';

async function requireStyleAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    throw new Error(`Could not verify the admin session: ${error.message}`);
  }
  if (!user || user.app_metadata?.role !== 'style_admin') {
    throw new Error('A Style Library administrator account is required.');
  }
  return supabase;
}

function mapRow(row: any): OrderRecord {
  return {
    id: row.id,
    orderNumber: row.order_number,
    customerName: row.customer_name,
    customerEmail: row.customer_email ?? '',
    customerPhone: row.customer_phone,
    customerAddress: row.customer_address ?? '',
    customerCity: row.customer_city ?? '',
    items: row.items as OrderItemInput[],
    subtotal: row.subtotal,
    status: row.status as OrderStatus,
    notes: row.notes ?? '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function loadOrders(): Promise<OrderRecord[]> {
  const supabase = await requireStyleAdmin();
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Could not load orders: ${error.message}`);
  }

  return (data ?? []).map(mapRow);
}

export async function generateOrderNumber(): Promise<string> {
  const supabase = await requireStyleAdmin();
  const { data, error } = await supabase
    .from('orders')
    .select('order_number')
    .order('order_number', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Could not generate order number: ${error.message}`);
  }

  let next = 1;
  if (data?.order_number) {
    const match = String(data.order_number).match(/PC-(\d+)/);
    if (match) {
      next = Number(match[1]) + 1;
    }
  }

  return `PC-${String(next).padStart(3, '0')}`;
}

export async function saveOrder(order: OrderInput): Promise<OrderRecord> {
  const supabase = await requireStyleAdmin();
  const orderNumber = order.orderNumber || (await generateOrderNumber());

  const payload = {
    id: order.id ?? crypto.randomUUID(),
    order_number: orderNumber,
    customer_name: order.customerName,
    customer_email: order.customerEmail || null,
    customer_phone: order.customerPhone,
    customer_address: order.customerAddress || null,
    customer_city: order.customerCity || null,
    items: order.items,
    subtotal: order.subtotal,
    status: order.status,
    notes: order.notes || null,
    updated_at: new Date().toISOString(),
  };

  if (order.id) {
    const { data, error } = await supabase
      .from('orders')
      .update(payload)
      .eq('id', order.id)
      .select()
      .single();

    if (error) {
      throw new Error(`Could not update order: ${error.message}`);
    }

    return mapRow(data);
  }

  const { data, error } = await supabase
    .from('orders')
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(`Could not create order: ${error.message}`);
  }

  return mapRow(data);
}

export async function deleteOrder(id: string): Promise<void> {
  const supabase = await requireStyleAdmin();
  const { error } = await supabase.from('orders').delete().eq('id', id);

  if (error) {
    throw new Error(`Could not delete order: ${error.message}`);
  }
}
