'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, X } from 'lucide-react';
import { createWhatsAppLink, savedStylesInquiryMessage } from '@/lib/whatsapp';
import type { PublicStyle } from '@/lib/styles';
import { useSavedStyles } from './SavedStylesProvider';

export function SavedStylesTray() {
  const { styleIds, removeStyle } = useSavedStyles();
  const [open, setOpen] = useState(false);
  const [stylesById, setStylesById] = useState<Record<string, PublicStyle>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open || styleIds.length === 0) return;
    let cancelled = false;

    const loadSavedStyles = async () => {
      setLoading(true);
      setError('');
      try {
        const chunks: string[][] = [];
        for (let index = 0; index < styleIds.length; index += 100) {
          chunks.push(styleIds.slice(index, index + 100));
        }

        const results = await Promise.all(chunks.map(async (ids) => {
          const response = await fetch(`/api/styles?ids=${encodeURIComponent(ids.join(','))}`);
          const payload = await response.json() as { styles?: PublicStyle[]; error?: string };
          if (!response.ok) throw new Error(payload.error ?? 'Could not load saved styles.');
          return payload.styles ?? [];
        }));

        if (!cancelled) {
          setStylesById(Object.fromEntries(results.flat().map((style) => [style.styleId, style])));
        }
      } catch (caught) {
        if (!cancelled) setError(caught instanceof Error ? caught.message : 'Could not load saved styles.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadSavedStyles();
    return () => {
      cancelled = true;
    };
  }, [open, styleIds]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  if (styleIds.length === 0) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed inset-x-4 bottom-4 z-30 mx-auto flex max-w-md items-center justify-center gap-2 rounded-full bg-[#d3b88b] px-6 py-4 text-xs font-semibold uppercase tracking-[0.19em] text-[#0b0907] shadow-[0_12px_36px_rgba(0,0,0,0.4)] transition hover:bg-[#e5d3b2] sm:bottom-6"
      >
        Saved styles ({styleIds.length})
        <ArrowUpRight size={15} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-5" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}>
          <section role="dialog" aria-modal="true" aria-labelledby="saved-styles-title" className="flex max-h-[92vh] w-full max-w-2xl flex-col rounded-t-3xl border border-white/10 bg-[var(--bg-elevated)] p-5 sm:rounded-3xl sm:p-8">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#d3b88b]">Your selection</p>
                <h2 id="saved-styles-title" className="mt-2 font-serif text-3xl">Your saved styles</h2>
              </div>
              <button type="button" aria-label="Close saved styles" onClick={() => setOpen(false)} className="rounded-full border border-white/10 p-2 text-[#d3c7b0] hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto py-2">
              {loading && <p className="py-5 text-sm text-[#b8ac9a]">Loading your saved styles…</p>}
              {error && <p role="alert" className="my-4 rounded-lg border border-red-400/30 bg-red-950/30 p-3 text-sm text-red-200">{error}</p>}
              <ul className="divide-y divide-white/10">
                {styleIds.map((styleId) => {
                  const style = stylesById[styleId];
                  return (
                    <li key={styleId} className="flex items-center gap-4 py-4">
                      {style ? (
                        <Link href={`/styles/${styleId}`} onClick={() => setOpen(false)} className="h-20 w-16 shrink-0 overflow-hidden rounded-md bg-black/20">
                          <Image src={style.imageUrl} alt={`${styleId} ${style.category.name}`} width={style.imageWidth} height={style.imageHeight} unoptimized loading="lazy" className="h-full w-full object-cover" />
                        </Link>
                      ) : (
                        <div className="grid h-20 w-16 shrink-0 place-items-center rounded-md bg-white/5 text-[10px] text-[#a99d84]">Unavailable</div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-serif text-xl">{styleId}</p>
                        <p className="mt-1 text-xs text-[#b8ac9a]">{style?.category.name ?? 'This style is no longer published'}</p>
                      </div>
                      <button type="button" onClick={() => removeStyle(styleId)} className="text-xs uppercase tracking-[0.15em] text-[#b8ac9a] hover:text-white">
                        Remove
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <a
              href={createWhatsAppLink(savedStylesInquiryMessage(styleIds))}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex min-h-14 items-center justify-center rounded-full bg-[#d3b88b] px-6 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#0b0907] transition hover:bg-[#e5d3b2]"
            >
              Send my selection to Prolific
            </a>
          </section>
        </div>
      )}
    </>
  );
}
