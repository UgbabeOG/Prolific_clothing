'use client';

import { ArrowRight, MessageSquare } from 'lucide-react';

export function WhatsAppButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-3 rounded-[18px] border border-white/10 bg-[var(--bg-elevated)] px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-[var(--text)] transition hover:border-gold"
    >
      <MessageSquare size={18} />
      {label}
      <ArrowRight size={16} />
    </a>
  );
}
