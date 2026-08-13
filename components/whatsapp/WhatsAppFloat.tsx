'use client';

import { MessageSquare } from 'lucide-react';
import { createWhatsAppLink, generalInquiryMessage } from '@/lib/whatsapp';

export function WhatsAppFloat() {
  const whatsappHref = createWhatsAppLink(generalInquiryMessage);

  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/10 bg-[var(--bg-elevated)] px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-[var(--text)] shadow-[0_14px_40px_rgba(0,0,0,0.18)] transition hover:border-gold md:left-auto md:right-5 md:translate-x-0"
    >
      <span className="mr-3 inline-flex items-center justify-center rounded-full bg-[var(--text)] p-2 text-[var(--bg)]">
        <MessageSquare size={16} />
      </span>
      Chat on WhatsApp
    </a>
  );
}
