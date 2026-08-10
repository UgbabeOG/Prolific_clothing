'use client';

import { ArrowRight, MessageSquare } from 'lucide-react';

export function WhatsAppButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-3 rounded-[18px] border border-white/10 bg-[#f7f1e8] px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#14110e] transition hover:border-gold hover:text-[#14110e]"
    >
      <MessageSquare size={18} />
      {label}
      <ArrowRight size={16} />
    </a>
  );
}
