'use client';

import Link from 'next/link';
import { X, Search, ShoppingBag } from 'lucide-react';

const navItems = [
  { label: 'Shop', href: '/shop' },
  { label: 'Collections', href: '/shop?collection=all' },
  { label: 'Bespoke', href: '/bespoke' },
  { label: 'Style Library', href: '/styles' },
  { label: 'About', href: '/about' },
  { label: 'Studio', href: '/studio' },
  { label: 'Journal', href: '/about#journal' },
];

export function MobileMenu({ open, onClose, onSearchOpen }: { open: boolean; onClose: () => void; onSearchOpen: () => void }) {
  return (
    <div className={`fixed inset-0 z-40 transition-opacity ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`absolute right-0 top-0 h-full w-full max-w-xs bg-[#090806] p-6 shadow-2xl transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`} style={{ backgroundColor: 'var(--bg-overlay)' }}>
        <div className="flex items-center justify-between">
          <span className="text-sm uppercase tracking-[0.32em] text-[#d2b88f]">Menu</span>
          <button
            type="button"
            onClick={onClose}
            className="header-btn inline-flex h-11 w-11 items-center justify-center rounded-lg transition"
            aria-label="Close navigation menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-10 flex flex-col gap-5 text-base uppercase tracking-[0.28em] text-[#f7f1e8]">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={onClose} className="transition hover:text-gold">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-12 flex items-center gap-4 border-t border-white/10 pt-8">
          <button
            type="button"
            onClick={() => {
              onSearchOpen();
              onClose();
            }}
            className="inline-flex items-center gap-3 text-sm uppercase tracking-[0.28em] text-[#f7f1e8] transition hover:text-gold"
          >
            <Search size={16} /> Search
          </button>
          <button type="button" className="inline-flex items-center gap-3 text-sm uppercase tracking-[0.28em] text-[#f7f1e8] transition hover:text-gold">
            <ShoppingBag size={16} /> Bag
          </button>
        </div>
      </div>
    </div>
  );
}
