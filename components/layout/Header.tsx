'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, Search, Heart, User, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { MobileMenu } from './MobileMenu';
import { SearchOverlay } from '@/components/search/SearchOverlay';

const navItems = [
  { label: 'Shop', href: '/shop' },
  { label: 'Collections', href: '/shop?collection=all' },
  { label: 'Bespoke', href: '/bespoke' },
  { label: 'About', href: '/about' },
  { label: 'Studio', href: '/studio' },
  { label: 'Journal', href: '/about#journal' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-500 ${
        isScrolled ? 'backdrop-blur-xl bg-[#0c0a08]/95 shadow-black/20' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 text-sm sm:px-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-[#101010]/80 text-[#f7f1e8] transition hover:border-gold hover:text-gold"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu size={18} />
          </button>
          <Link href="/" className="flex items-center gap-3">
            <Image src="/brand/logo.svg" alt="Prolific Clothing" width={32} height={32} className="h-8 w-8" />
            <span className="text-xs uppercase tracking-[0.3em] text-[#f7f1e8] hidden sm:inline-flex">Prolific Clothing</span>
          </Link>
        </div>

        <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative text-sm uppercase tracking-[0.26em] text-[#d3c7b0] transition hover:text-white"
            >
              {item.label}
              <span className="mt-2 block h-[1px] w-0 bg-gold transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="hidden h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-[#101010]/80 text-[#f7f1e8] transition hover:border-gold hover:text-gold md:inline-flex"
            aria-label="Search site"
            onClick={() => setSearchOpen(true)}
          >
            <Search size={18} />
          </button>
          <button
            type="button"
            className="hidden h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-[#101010]/80 text-[#f7f1e8] transition hover:border-gold hover:text-gold md:inline-flex"
            aria-label="Account"
          >
            <User size={18} />
          </button>
          <button
            type="button"
            className="hidden h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-[#101010]/80 text-[#f7f1e8] transition hover:border-gold hover:text-gold md:inline-flex"
            aria-label="Wishlist"
          >
            <Heart size={18} />
          </button>
          <button
            type="button"
            className="h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-[#101010]/80 text-[#f7f1e8] transition hover:border-gold hover:text-gold"
            aria-label="Shopping Bag"
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} onSearchOpen={() => setSearchOpen(true)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
