'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, Trash2, Save } from 'lucide-react';
import {
  loadOrders,
  saveOrder,
  deleteOrder,
  ORDER_STATUSES,
  STATUS_LABELS,
  STATUS_COLORS,
  type Order,
} from '@/lib/orders/order';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

type OrderDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    let active = true;
    const fetchOrder = async () => {
      try {
        const orders = await loadOrders();
        const found = orders.find((o) => o.id === id);
        if (active) {
          setOrder(found ?? null);
          if (found) setStatus(found.status);
        }
      } catch (caught) {
        if (active) setError(caught instanceof Error ? caught.message : 'Could not load order.');
      } finally {
        if (active) setLoading(false);
      }
    };

    void fetchOrder();
    return () => {
      active = false;
    };
  }, [id]);

  const handleSave = async () => {
    if (!order) return;
    setError('');
    setNotice('');
    try {
      const next: Order = { ...order, status: status as Order['status'], updatedAt: new Date().toISOString() };
      await saveOrder(next);
      setOrder(next);
      setNotice('Order status updated.');
      setTimeout(() => setNotice(''), 3000);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not update order.');
    }
  };

  const handleDelete = async () => {
    if (!order) return;
    if (!window.confirm(`Delete order ${order.orderNumber}? This cannot be undone.`)) return;
    setError('');
    setNotice('');
    try {
      await deleteOrder(order.id);
      setNotice('Order deleted.');
      setTimeout(() => setNotice(''), 3000);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not delete order.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
        <AnnouncementBar />
        <Header />
        <main className="mx-auto max-w-6xl px-5 py-10 text-[var(--text)] sm:px-8 sm:py-16">
          <p className="text-sm text-[#b8ac9a]">Loading order…</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
        <AnnouncementBar />
        <Header />
        <main className="mx-auto max-w-6xl px-5 py-10 text-[var(--text)] sm:px-8 sm:py-16">
          <div className="rounded-2xl border border-white/10 bg-[#100f0d] p-12 text-center" style={{ backgroundColor: 'var(--bg-elevated)' }}>
            <p className="text-lg text-white">Order not found.</p>
            <Link
              href="/admin/orders"
              className="mt-6 inline-flex rounded-[18px] border border-white/10 px-6 py-3 text-sm uppercase tracking-[0.22em] transition hover:border-gold hover:text-gold"
            >
              Back to orders
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const itemTotal = order.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <AnnouncementBar />
      <Header />
      <main className="mx-auto max-w-6xl px-5 py-10 text-[var(--text)] sm:px-8 sm:py-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-[#d3b88b]">Prolific Clothing · Admin</p>
            <h1 className="mt-2 font-serif text-4xl sm:text-5xl">Order {order.orderNumber}</h1>
            <p className={`mt-1 text-xs uppercase tracking-[0.16em] ${STATUS_COLORS[order.status]}`}>
              {STATUS_LABELS[order.status]}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/orders"
              className="rounded-lg border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#d3c7b0] transition hover:border-gold hover:text-white"
            >
              Back to orders
            </Link>
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-[#d3b88b] px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#0b0907] disabled:opacity-50 hover:bg-[#e5d3b2]"
            >
              <Save size={15} /> Save changes
            </button>
          </div>
        </div>

        {error && <p role="alert" className="mb-6 rounded-lg border border-red-400/30 bg-red-950/30 p-4 text-sm text-red-200">{error}</p>}
        {notice && <p role="status" className="mb-6 rounded-lg border border-emerald-400/30 bg-emerald-950/20 p-4 text-sm text-emerald-200">{notice}</p>}

        <section className="grid gap-8 lg:grid-cols-[1fr_0.6fr]">
          <section className="space-y-6 rounded-2xl border border-white/10 bg-[#100f0d] p-6 sm:p-8" style={{ backgroundColor: 'var(--bg-elevated)' }}>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#d3b88b]">Customer details</p>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[#a99d84]">Name</p>
                <p className="mt-1 text-sm text-[#f7f1e8]">{order.customerName}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[#a99d84]">Email</p>
                <p className="mt-1 text-sm text-[#f7f1e8]">{order.customerEmail}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[#a99d84]">Phone</p>
                <p className="mt-1 text-sm text-[#f7f1e8]">{order.customerPhone}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[#a99d84]">Address</p>
                <p className="mt-1 text-sm text-[#f7f1e8]">{order.customerAddress}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[#a99d84]">City</p>
                <p className="mt-1 text-sm text-[#f7f1e8]">{order.customerCity}</p>
              </div>
              {order.notes && (
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[#a99d84]">Order notes</p>
                  <p className="mt-1 text-sm text-[#f7f1e8]">{order.notes}</p>
                </div>
              )}
            </div>
          </section>

          <section className="space-y-6 rounded-2xl border border-white/10 bg-[#100f0d] p-6 sm:p-8" style={{ backgroundColor: 'var(--bg-elevated)' }}>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#d3b88b]">Items</p>
            </div>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.productId} className="flex items-center gap-4 border-b border-white/10 pb-4 last:border-0">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-black/20 flex items-center justify-center">
                    <span className="text-[10px] text-[#a99d84]">{item.product.name.slice(0, 12)}…</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#f7f1e8]">{item.product.name}</p>
                    <p className="mt-1 text-xs text-[#a99d84]">Size {item.size} · {item.color.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#f7f1e8]">× {item.quantity}</p>
                    <p className="text-xs text-[#a99d84]">₦{(item.product.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-sm font-serif text-white">
                <span>Subtotal</span>
                <span>₦{itemTotal.toLocaleString()}</span>
              </div>
            </div>
          </section>

          <section className="space-y-6 rounded-2xl border border-white/10 bg-[#100f0d] p-6 sm:p-8" style={{ backgroundColor: 'var(--bg-elevated)' }}>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#d3b88b]">Order status</p>
            </div>
            <div className="space-y-3">
              {ORDER_STATUSES.map((s) => (
                <label key={s} className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="order-status"
                    value={s}
                    checked={status === s}
                    onChange={(e) => setStatus(e.target.value)}
                    className="rounded border-white/10 text-[#d3b88b] focus:ring-0"
                  />
                  <span className={`text-sm ${status === s ? 'text-[#d3b88b] font-medium' : 'text-[#a99d84]'}`}>
                    {STATUS_LABELS[s]}
                  </span>
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs text-[#a99d84]">
              Created {new Date(order.createdAt).toLocaleDateString()} · Updated {new Date(order.updatedAt).toLocaleDateString()}
            </p>
          </section>

          <section className="space-y-6 rounded-2xl border border-white/10 bg-[#100f0d] p-6 sm:p-8" style={{ backgroundColor: 'var(--bg-elevated)' }}>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#d3b88b]">Danger zone</p>
            </div>
            <button
              type="button"
              onClick={handleDelete}
              className="text-xs uppercase tracking-[0.16em] text-[#a99d84] hover:text-red-300 transition"
            >
              <Trash2 size={16} /> Delete order
            </button>
          </section>
        </section>
      </main>
      <Footer />
    </div>
  );
}
