'use client';

import { useState, useEffect, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import { products } from '@/data/products';
import { loadOrders, saveOrder, createOrderNumber, type Order, type OrderItem, ORDER_STATUSES, STATUS_LABELS } from '@/lib/orders/order';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

type NewOrderItem = {
  product: typeof products[number];
  size: string;
  color: { name: string; hex: string };
  quantity: number;
};

export default function NewOrderPage() {
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    customerCity: '',
    notes: '',
    status: 'pending' as string,
  });
  const [items, setItems] = useState<NewOrderItem[]>([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (products.length > 0 && items.length === 0) {
      const p = products[0];
      setItems([{ product: p, size: p.sizes[0], color: p.colors[0], quantity: 1 }]);
    }
  }, [items.length]);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const addItem = () => {
    const p = products[0];
    setItems([...items, { product: p, size: p.sizes[0], color: p.colors[0], quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItemField = (index: number, field: keyof NewOrderItem, value: unknown) => {
    setItems(items.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (!form.customerName || !form.customerPhone) {
      setError('Customer name and phone are required.');
      return;
    }
    if (items.length === 0) {
      setError('Add at least one item.');
      return;
    }

    setLoading(true);
    try {
      const order: Order = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        orderNumber: createOrderNumber(),
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        customerPhone: form.customerPhone,
        customerAddress: form.customerAddress,
        customerCity: form.customerCity,
        items: items.map((item) => ({
          productId: item.product.id,
          product: item.product,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
        })),
        subtotal,
        status: form.status as Order['status'],
        notes: form.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      saveOrder(order);
      setNotice(`Order ${order.orderNumber} created successfully.`);
      setTimeout(() => {
        window.location.href = `/admin/orders/${order.id}`;
      }, 1000);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not create order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <AnnouncementBar />
      <Header />
      <main className="mx-auto max-w-4xl px-5 py-10 text-[var(--text)] sm:px-8 sm:py-16">
        <div className="mb-8">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#d3c7b0] transition hover:border-gold hover:text-white"
          >
            <ArrowLeft size={15} /> Back to orders
          </Link>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl">New order</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#b8ac9a]">
            Manually create an order from a WhatsApp conversation. Order numbers are assigned automatically.
          </p>
        </div>

        {error && <p role="alert" className="mb-6 rounded-lg border border-red-400/30 bg-red-950/30 p-4 text-sm text-red-200">{error}</p>}
        {notice && <p role="status" className="mb-6 rounded-lg border border-emerald-400/30 bg-emerald-950/20 p-4 text-sm text-emerald-200">{notice}</p>}

        <form onSubmit={handleSubmit} className="space-y-8 rounded-2xl border border-white/10 bg-[#100f0d] p-6 sm:p-8" style={{ backgroundColor: 'var(--bg-elevated)' }}>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-3">
              <label className="block text-xs uppercase tracking-[0.2em] text-[#d3c7b0]">
                Customer name
                <input required value={form.customerName} onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))} className="theme-input mt-2 w-full rounded-lg border px-4 py-3 text-sm" />
              </label>
            </div>
            <div className="space-y-3">
              <label className="block text-xs uppercase tracking-[0.2em] text-[#d3c7b0]">
                Email
                <input value={form.customerEmail} onChange={(e) => setForm((f) => ({ ...f, customerEmail: e.target.value }))} className="theme-input mt-2 w-full rounded-lg border px-4 py-3 text-sm" type="email" />
              </label>
            </div>
            <div className="space-y-3">
              <label className="block text-xs uppercase tracking-[0.2em] text-[#d3c7b0]">
                Phone
                <input required value={form.customerPhone} onChange={(e) => setForm((f) => ({ ...f, customerPhone: e.target.value }))} className="theme-input mt-2 w-full rounded-lg border px-4 py-3 text-sm" type="tel" />
              </label>
            </div>
            <div className="space-y-3 sm:col-span-2">
              <label className="block text-xs uppercase tracking-[0.2em] text-[#d3c7b0]">
                Address
                <input value={form.customerAddress} onChange={(e) => setForm((f) => ({ ...f, customerAddress: e.target.value }))} className="theme-input mt-2 w-full rounded-lg border px-4 py-3 text-sm" />
              </label>
            </div>
            <div className="space-y-3">
              <label className="block text-xs uppercase tracking-[0.2em] text-[#d3c7b0]">
                City
                <input value={form.customerCity} onChange={(e) => setForm((f) => ({ ...f, customerCity: e.target.value }))} className="theme-input mt-2 w-full rounded-lg border px-4 py-3 text-sm" />
              </label>
            </div>
            <div className="space-y-3 sm:col-span-2">
              <label className="block text-xs uppercase tracking-[0.2em] text-[#d3c7b0]">
                Order notes
                <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} className="theme-input mt-2 h-24 w-full rounded-lg border px-4 py-3 text-sm" />
              </label>
            </div>
            <div className="space-y-3 sm:col-span-2">
              <label className="block text-xs uppercase tracking-[0.2em] text-[#d3c7b0]">
                Initial status
                <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="theme-input mt-2 w-full rounded-lg border px-4 py-3 text-sm">
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#d3b88b]">Items</p>
              </div>
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#d3c7b0] transition hover:border-gold hover:text-white"
              >
                <Plus size={15} /> Add item
              </button>
            </div>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.product.id} className="grid gap-4 sm:grid-cols-4 border border-white/10 rounded-xl p-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.2em] text-[#d3c7b0]">Product</label>
                    <select
                      value={item.product.id}
                      onChange={(e) => {
                        const p = products.find((x) => x.id === e.target.value);
                        if (!p) return;
                        updateItemField(index, 'product', p);
                        updateItemField(index, 'size', p.sizes[0]);
                        updateItemField(index, 'color', p.colors[0]);
                      }}
                      className="theme-input w-full rounded-lg border px-4 py-3 text-sm"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.2em] text-[#d3c7b0]">Size</label>
                    <select value={item.size} onChange={(e) => updateItemField(index, 'size', e.target.value)} className="theme-input w-full rounded-lg border px-4 py-3 text-sm">
                      {item.product.sizes.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.2em] text-[#d3c7b0]">Color</label>
                    <select value={item.color.name} onChange={(e) => updateItemField(index, 'color', item.product.colors.find((c) => c.name === e.target.value) || item.color)} className="theme-input w-full rounded-lg border px-4 py-3 text-sm">
                      {item.product.colors.map((c) => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.2em] text-[#d3c7b0]">Qty</label>
                    <input type="number" min="1" value={item.quantity} onChange={(e) => updateItemField(index, 'quantity', Math.max(1, Number(e.target.value) || 1))} className="theme-input w-full rounded-lg border px-4 py-3 text-sm" />
                  </div>
                  <div className="flex items-end">
                    <button type="button" onClick={() => removeItem(index)} className="text-xs uppercase tracking-[0.16em] text-[#a99d84] hover:text-red-300">
                      <Trash2 size={16} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-lg font-serif text-white">
              <span>Subtotal</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full rounded-lg bg-[#d3b88b] px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#0b0907] disabled:opacity-50 hover:bg-[#e5d3b2]">
            <Save size={16} /> {loading ? 'Creating order…' : 'Create order'}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
