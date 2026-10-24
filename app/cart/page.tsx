'use client';

import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/cart/CartContext';
import { createWhatsAppLink } from '@/lib/whatsapp';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, itemCount } = useCart();

  const whatsappMessage = `Hello Prolific Clothing, I'd like to order:\n\n${items
    .map(
      (item) =>
        `- ${item.product.name} | Size: ${item.size} | Color: ${item.color.name} | Qty: ${item.quantity} | ₦${(
          item.product.price * item.quantity
        ).toLocaleString()}`
    )
    .join('\n')}\n\nSubtotal: ₦${subtotal.toLocaleString()}\n\nPlease confirm availability and delivery details.`;

  const whatsappHref = `https://wa.me/+2349154908402?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="bg-[var(--bg)] text-[var(--text)]">
      <AnnouncementBar />
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-24 sm:px-8">
        <div className="grid gap-10 xl:grid-cols-[1.4fr_0.6fr]">
          <section className="space-y-6 rounded-[28px] border border-white/10 bg-[#100f0d] p-10" style={{ backgroundColor: 'var(--bg-elevated)' }}>
            <p className="text-xs uppercase tracking-[0.32em] text-[#d3b88b]">Cart</p>
            <h1 className="text-4xl font-serif text-white">Your selected pieces.</h1>

            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center py-20">
                <p className="text-lg font-serif text-white">Your bag is empty</p>
                <p className="mt-3 text-sm text-[#b8ac9a]">Explore our collections to add pieces to your bag.</p>
                <Link
                  href="/shop"
                  className="mt-6 inline-flex rounded-[18px] border border-white/10 px-6 py-3 text-sm uppercase tracking-[0.22em] transition hover:border-gold hover:text-gold"
                >
                  Continue shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="grid gap-4 rounded-[24px] border border-white/10 bg-[#0d0b09] p-6 sm:grid-cols-[0.9fr_0.4fr]" style={{ backgroundColor: 'var(--bg-card)' }}>
                    <div className="flex items-center gap-4">
                      <Image src={item.product.images[0]} alt={item.product.name} fill className="h-24 w-24 rounded-[18px] object-cover" style={{ backgroundColor: 'var(--bg-card)' }} />
                      <div>
                        <p className="text-sm uppercase tracking-[0.26em] text-[#d3b88b]">{item.product.category}</p>
                        <h2 className="mt-3 text-xl font-serif text-white">{item.product.name}</h2>
                        <p className="mt-2 text-sm text-[#b8ac9a]">Size {item.size} · {item.color.name}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-xs uppercase tracking-[0.2em] text-[#b8ac9a] transition hover:text-gold"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="flex items-center justify-between gap-4 text-sm text-[#b8ac9a]">
                      <div className="flex items-center gap-3 rounded-full border border-white/10 px-3 py-1">
                        <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 transition hover:text-gold">
                          <Minus size={14} />
                        </button>
                        <span className="text-sm">{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 transition hover:text-gold">
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="text-base text-white">₦{(item.product.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {items.length > 0 && (
            <aside className="rounded-[28px] border border-white/10 bg-[#100f0d] p-10" style={{ backgroundColor: 'var(--bg-elevated)' }}>
              <p className="text-xs uppercase tracking-[0.32em] text-[#d3b88b]">Summary</p>
              <div className="mt-8 space-y-4 text-sm text-[#b8ac9a]">
                <div className="flex items-center justify-between">
                  <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Delivery</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t border-white/10 pt-4 text-base font-semibold text-white">
                  <div className="flex items-center justify-between">
                    <span>Total</span>
                    <span>₦{subtotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="mt-10 w-full inline-flex items-center justify-center rounded-[18px] bg-white px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#0f0d0b] transition hover:bg-[#f2ede4]"
              >
                Checkout via WhatsApp <ArrowRight size={14} />
              </a>
              <button className="mt-4 w-full rounded-[18px] border border-white/10 bg-transparent px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-white transition hover:border-gold hover:text-gold">
                Need help? Chat on WhatsApp
              </button>
            </aside>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
