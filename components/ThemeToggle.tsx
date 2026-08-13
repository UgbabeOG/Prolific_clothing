'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const syncTheme = () => {
      const current = document.documentElement.getAttribute('data-theme');
      const enabled = current === 'light' || (!current && window.matchMedia('(prefers-color-scheme: light)').matches);
      setIsLight(enabled);
      document.documentElement.setAttribute('data-theme', enabled ? 'light' : 'dark');
    };

    syncTheme();
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = () => {
      const stored = localStorage.getItem('theme');
      if (!stored) {
        syncTheme();
      }
    };

    mediaQuery.addEventListener?.('change', onChange);

    return () => {
      mediaQuery.removeEventListener?.('change', onChange);
    };
  }, []);

  const toggleTheme = () => {
    const next = !isLight;
    setIsLight(next);
    document.documentElement.setAttribute('data-theme', next ? 'light' : 'dark');
    localStorage.setItem('theme', next ? 'light' : 'dark');
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="header-btn inline-flex h-11 w-11 items-center justify-center rounded-lg transition hover:border-gold hover:text-gold"
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      data-tooltip={isLight ? 'Dark Mode' : 'Light Mode'}
    >
      {isLight ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
