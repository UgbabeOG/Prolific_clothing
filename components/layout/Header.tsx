'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, Search, Heart, User, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { MobileMenu } from './MobileMenu';
import { SearchOverlay } from '@/components/search/SearchOverlay';
import { ThemeToggle } from '@/components/ThemeToggle';

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
  const [isLightTheme, setIsLightTheme] = useState(false);

  useEffect(() => {
    const syncTheme = () => setIsLightTheme(document.documentElement.getAttribute('data-theme') === 'light');
    const onScroll = () => setIsScrolled(window.scrollY > 28);

    syncTheme();
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    document.documentElement.addEventListener('themechange', syncTheme as EventListener);

    return () => {
      window.removeEventListener('scroll', onScroll);
      document.documentElement.removeEventListener('themechange', syncTheme as EventListener);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-500 ${
        isScrolled ? 'backdrop-blur-xl shadow-black/20' : 'bg-transparent'
      }`}
      style={{
        backgroundColor: isScrolled ? (isLightTheme ? 'rgba(255,255,255,0.95)' : 'rgba(12,10,8,0.95)') : undefined,
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 text-sm sm:px-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="header-btn md:hidden inline-flex h-11 w-11 items-center justify-center rounded-lg transition hover:border-gold hover:text-gold"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            data-tooltip="Menu"
          >
            <Menu size={18} />
          </button>
          <Link href="/" className="flex items-center gap-3">
            <Image
              src={isLightTheme ? '/assets/OB_monogram_black.svg' : '/assets/OB_monogram_gold.svg'}
              alt="Prolific Clothing"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className={`text-xs uppercase tracking-[0.3em] hidden sm:inline-flex ${isLightTheme ? 'text-[#0b0907]' : 'text-[#f7f1e8]'}`}>
              Prolific Clothing
            </span>
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
            className="header-btn hidden h-11 w-11 items-center justify-center rounded-lg transition hover:border-gold hover:text-gold md:inline-flex"
            aria-label="Search site"
            onClick={() => setSearchOpen(true)}
            data-tooltip="Search"
          >
            <Search size={18} />
          </button>
          <button
            type="button"
            className="header-btn hidden h-11 w-11 items-center justify-center rounded-lg transition hover:border-gold hover:text-gold md:inline-flex"
            aria-label="Account"
            data-tooltip="Account"
          >
            <User size={18} />
          </button>
          <button
            type="button"
            className="header-btn hidden h-11 w-11 items-center justify-center rounded-lg transition hover:border-gold hover:text-gold md:inline-flex"
            aria-label="Wishlist"
            data-tooltip="Wishlist"
          >
            <Heart size={18} />
          </button>
          <ThemeToggle />
          <button
            type="button"
            className="header-btn inline-flex h-11 w-11 items-center justify-center rounded-lg transition hover:border-gold hover:text-gold"
            aria-label="Shopping Bag"
            data-tooltip="Shopping Bag"
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
