'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, X } from 'lucide-react';
import { useCart } from '@/lib/cart/CartContext';
import { createWhatsAppLink } from '@/lib/whatsapp';

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal, itemCount } = useCart();

  if (!isOpen) return null;

  const message = `Hello Prolific Clothing, I'd like to order:\n\n${items
    .map(
      (item) =>
        `- ${item.product.name} | Size: ${item.size} | Color: ${item.color.name} | Qty: ${item.quantity} | ₦${(
          item.product.price * item.quantity
        ).toLocaleString()}`
    )
    .join('\n')}\n\nSubtotal: ₦${subtotal.toLocaleString()}\n\nPlease confirm availability and delivery details.`;
  const whatsappHref = createWhatsAppLink(message);

  return (
    <div className="fixed inset-0 z-[100] flex">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeCart} />
      <aside className="relative ml-auto flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[var(--bg)] text-[var(--text)] shadow-[0_40px_80px_rgba(0,0,0,0.4)]">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-[#d3b88b]">Shopping Bag</p>
            <p className="mt-2 text-sm text-[#b8ac9a]">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition hover:border-gold hover:text-gold"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-lg font-serif text-white">Your bag is empty</p>
              <p className="mt-3 text-sm text-[#b8ac9a]">Explore our collections to add pieces to your bag.</p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="mt-6 inline-flex rounded-[18px] border border-white/10 px-6 py-3 text-sm uppercase tracking-[0.22em] transition hover:border-gold hover:text-gold"
              >
                Continue shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 rounded-[22px] border border-white/10 bg-[#100f0d] p-4" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                  <div className="relative h-24 w-24 overflow-hidden rounded-[16px] bg-[#14110f]">
                    <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-[#d3b88b]">{item.product.category}</p>
                        <p className="mt-2 text-base font-serif text-white">{item.product.name}</p>
                        <p className="mt-1 text-xs text-[#b8ac9a]">Size {item.size} · {item.color.name}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-xs uppercase tracking-[0.2em] text-[#b8ac9a] transition hover:text-gold"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 rounded-full border border-white/10 px-3 py-1">
                        <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 transition hover:text-gold">
                          <Minus size={14} />
                        </button>
                        <span className="text-sm">{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 transition hover:text-gold">
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="text-sm text-white">₦{(item.product.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-white/10 px-6 py-6">
            <div className="flex items-center justify-between text-sm text-[#b8ac9a]">
              <span>Subtotal</span>
              <span className="text-white">₦{subtotal.toLocaleString()}</span>
            </div>
            <p className="mt-2 text-xs text-[#b8ac9a]">Delivery calculated at checkout.</p>
            <div className="mt-6 space-y-3">
              <Link
                href="/cart"
                onClick={closeCart}
                className="inline-flex w-full items-center justify-center rounded-[18px] border border-white/10 px-6 py-4 text-sm uppercase tracking-[0.22em] transition hover:border-gold hover:text-gold"
              >
                View Cart
              </Link>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center rounded-[18px] bg-white px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#0f0d0b] transition hover:bg-[#f2ede4]"
              >
                Checkout via WhatsApp
              </a>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
