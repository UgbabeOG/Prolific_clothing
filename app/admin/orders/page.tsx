import type { Metadata } from 'next';
import Link from 'next/link';
import { getSupabaseConfig } from '@/lib/supabase/config';
import {
  loadOrders,
  ORDER_STATUSES,
  STATUS_LABELS,
  STATUS_COLORS,
  type Order,
} from '@/lib/orders/order';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ArrowRight } from 'lucide-react';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Orders — Prolific Clothing Admin',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const configured = Boolean(getSupabaseConfig());
  const orders = (await loadOrders()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <AnnouncementBar />
      <Header />
      <main className="mx-auto max-w-6xl px-5 py-10 text-[var(--text)] sm:px-8 sm:py-16">
        <div className="mb-9">
          <p className="text-xs uppercase tracking-[0.32em] text-[#d3b88b]">Prolific Clothing · Admin</p>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl">Orders</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#b8ac9a]">
            Manage customer orders received via WhatsApp. Create, update, and track order status.
          </p>
        </div>

        {!configured && (
          <div className="rounded-2xl border border-[#d3b88b]/30 bg-[#100f0d] p-6 text-sm leading-7 text-[#d3c7b0]">
            Supabase is not configured. Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to the server environment, then restart the site.
          </div>
        )}

        <div className="mt-9 flex flex-wrap items-end justify-between gap-4">
          <Link
            href="/admin/orders/new"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#d3b88b] px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#0b0907] hover:bg-[#e5d3b2]"
          >
            <ArrowRight size={15} /> New order
          </Link>
        </div>

        <section className="mt-6 rounded-2xl border border-white/10 bg-[#100f0d] overflow-hidden" style={{ backgroundColor: 'var(--bg-elevated)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="pb-4 text-xs uppercase tracking-[0.2em] text-[#a99d84] pl-6">Order</th>
                  <th className="pb-4 text-xs uppercase tracking-[0.2em] text-[#a99d84] pl-4">Customer</th>
                  <th className="pb-4 text-xs uppercase tracking-[0.2em] text-[#a99d84]">Status</th>
                  <th className="pb-4 text-xs uppercase tracking-[0.2em] text-[#a99d84]">Subtotal</th>
                  <th className="pb-4 text-xs uppercase tracking-[0.2em] text-[#a99d84] pr-6">Created</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-sm text-[#a99d84]">
                      No orders yet. Create your first order from a WhatsApp conversation.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="border-b border-white/10 hover:bg-white/5 transition">
                      <td className="py-4 pl-6">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-serif text-lg text-white hover:text-[#d3b88b]"
                        >
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="py-4 pl-4 text-sm text-[#f7f1e8]">
                        <p>{order.customerName}</p>
                        <p className="mt-1 text-xs text-[#a99d84]">{order.customerPhone}</p>
                      </td>
                      <td className="py-4 pl-4">
                        <span className={`px-3 py-1 rounded-full border text-xs uppercase tracking-[0.14em] border-white/10 ${STATUS_COLORS[order.status]}`}>
                          {STATUS_LABELS[order.status]}
                        </span>
                      </td>
                      <td className="py-4 pl-4 text-sm text-[#f7f1e8]">₦{order.subtotal.toLocaleString()}</td>
                      <td className="py-4 pr-6 text-sm text-[#a99d84]">
                        {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {orders.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#a99d84]">Total orders</p>
              <p className="mt-1 text-lg font-serif text-white">{orders.length}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#a99d84]">Total value</p>
              <p className="mt-1 text-lg font-serif text-white">₦{orders.reduce((sum, o) => sum + o.subtotal, 0).toLocaleString()}</p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
