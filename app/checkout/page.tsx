'use client';

import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { useCart } from '@/lib/cart/CartContext';
import { createWhatsAppLink } from '@/lib/whatsapp';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { items, subtotal, itemCount } = useCart();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="bg-[var(--bg)] text-[var(--text)]">
        <AnnouncementBar />
        <Header />
        <main className="mx-auto max-w-7xl px-6 py-24 sm:px-8">
          <div className="rounded-[28px] border border-white/10 bg-[#100f0d] p-10 text-center" style={{ backgroundColor: 'var(--bg-elevated)' }}>
            <p className="text-xs uppercase tracking-[0.32em] text-[#d3b88b]">Checkout</p>
            <h1 className="mt-6 text-4xl font-serif text-white">Your bag is empty</h1>
            <p className="mt-4 text-lg text-[#b8ac9a]">Add items to your cart before checking out.</p>
            <a
              href="/shop"
              className="mt-8 inline-flex rounded-[18px] border border-white/10 px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-white transition hover:border-gold hover:text-gold"
            >
              Continue shopping
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const whatsappMessage = `Hello Prolific Clothing, I'd like to place an order:\n\n${items
    .map(
      (item) =>
        `- ${item.product.name} | Size: ${item.size} | Color: ${item.color.name} | Qty: ${item.quantity} | ₦${(
          item.product.price * item.quantity
        ).toLocaleString()}`
    )
    .join('\n')}\n\nSubtotal: ₦${subtotal.toLocaleString()}\n\nPlease confirm availability, pricing and delivery details.`;

  const whatsappHref = `https://wa.me/+2349154908402?text=${encodeURIComponent(whatsappMessage)}`;

  const handlePlaceOrder = () => {
    setLoading(true);
    window.open(whatsappHref, '_blank', 'noopener,noreferrer');
    router.push('/checkout/success');
  };

  return (
    <div className="bg-[var(--bg)] text-[var(--text)]">
      <AnnouncementBar />
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-24 sm:px-8">
        <div className="grid gap-14 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[28px] border border-white/10 bg-[#100f0d] p-10" style={{ backgroundColor: 'var(--bg-elevated)' }}>
            <p className="text-xs uppercase tracking-[0.32em] text-[#d3b88b]">Checkout</p>
            <h1 className="mt-6 text-4xl font-serif text-white">Complete your order with quiet luxury.</h1>
            <p className="mt-4 text-lg text-[#b8ac9a]">
              Enter your details below and we will confirm your order via WhatsApp. Final pricing and delivery are confirmed during consultation.
            </p>
            <form className="mt-12 space-y-10" onSubmit={(e) => {
              e.preventDefault();
              handlePlaceOrder();
            }}>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm uppercase tracking-[0.22em] text-[#d3b88b]" htmlFor="email">
                    Email
                  </label>
                  <input className="theme-input mt-3 w-full rounded-[16px] border border-white/10 px-4 py-4 text-sm outline-none transition focus:border-gold" id="email" type="email" required />
                </div>
                <div>
                  <label className="block text-sm uppercase tracking-[0.22em] text-[#d3b88b]" htmlFor="phone">
                    Phone
                  </label>
                  <input className="theme-input mt-3 w-full rounded-[16px] border border-white/10 px-4 py-4 text-sm outline-none transition focus:border-gold" id="phone" type="tel" required />
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm uppercase tracking-[0.22em] text-[#d3b88b]" htmlFor="address">
                    Delivery Address
                  </label>
                  <input className="theme-input mt-3 w-full rounded-[16px] border border-white/10 px-4 py-4 text-sm outline-none transition focus:border-gold" id="address" type="text" required />
                </div>
                <div>
                  <label className="block text-sm uppercase tracking-[0.22em] text-[#d3b88b]" htmlFor="city">
                    City
                  </label>
                  <input className="theme-input mt-3 w-full rounded-[16px] border border-white/10 px-4 py-4 text-sm outline-none transition focus:border-gold" id="city" type="text" required />
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm uppercase tracking-[0.22em] text-[#d3b88b]" htmlFor="payment">
                    Payment method
                  </label>
                  <select className="theme-input mt-3 w-full rounded-[16px] border border-white/10 px-4 py-4 text-sm outline-none transition focus:border-gold" id="payment" required>
                    <option>Bank transfer</option>
                    <option>Cash on delivery</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm uppercase tracking-[0.22em] text-[#d3b88b]" htmlFor="notes">
                    Order notes
                  </label>
                  <textarea className="theme-input mt-3 h-36 w-full rounded-[16px] border border-white/10 px-4 py-4 text-sm outline-none transition focus:border-gold" id="notes" />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-[18px] bg-white px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#0f0d0b] transition hover:bg-[#f2ede4] disabled:opacity-50"
              >
                {loading ? 'Sending via WhatsApp…' : 'Place order via WhatsApp'}
              </button>
            </form>
          </section>
          <aside className="space-y-8 rounded-[28px] border border-white/10 bg-[#100f0d] p-10" style={{ backgroundColor: 'var(--bg-elevated)' }}>
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-[#d3b88b]">Order Summary</p>
              <div className="mt-6 space-y-4 text-sm text-[#b8ac9a]">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <span>{item.product.name} × {item.quantity}</span>
                    <span>₦{(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t border-white/10 pt-4 text-base font-semibold text-white">
                  <div className="flex items-center justify-between">
                    <span>Total ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                    <span>₦{subtotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-[#a99d84]">
              After placing your order, WhatsApp will open with your order summary. A Prolific team member will respond to confirm availability, pricing, and delivery.
            </p>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
