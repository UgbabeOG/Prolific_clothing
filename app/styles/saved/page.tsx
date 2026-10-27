'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { createWhatsAppLink, savedStylesInquiryMessage } from '@/lib/whatsapp';
import { useSavedStyles } from '@/components/styles/SavedStylesProvider';

type SavedStyle = {
  styleId: string;
  category: { name: string };
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
};

export default function SavedStylesPage() {
  const { styleIds, removeStyle } = useSavedStyles();
  const [styles, setStyles] = useState<Map<string, SavedStyle>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (styleIds.length === 0) {
      setStyles(new Map());
      return;
    }
    setLoading(true);
    setError('');
    const loadStyles = async () => {
      try {
        const chunks: string[][] = [];
        for (let index = 0; index < styleIds.length; index += 100) {
          chunks.push(styleIds.slice(index, index + 100));
        }

        const results = await Promise.all(chunks.map(async (ids) => {
          const response = await fetch(`/api/styles?ids=${encodeURIComponent(ids.join(','))}`);
          const payload = await response.json() as { styles?: SavedStyle[]; error?: string };
          if (!response.ok) throw new Error(payload.error ?? 'Could not load saved styles.');
          return payload.styles ?? [];
        }));

        const map = new Map<string, SavedStyle>();
        results.flat().forEach((style) => map.set(style.styleId, style));
        setStyles(map);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'Could not load saved styles.');
      } finally {
        setLoading(false);
      }
    };

    void loadStyles();
  }, [styleIds]);

  const whatsappHref = createWhatsAppLink(savedStylesInquiryMessage(styleIds));

  return (
    <div className="bg-[var(--bg)] text-[var(--text)]">
      <AnnouncementBar />
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-24 sm:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <Link
              href="/styles"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#d3c7b0] transition hover:text-[#d3b88b]"
            >
              <ArrowLeft size={14} /> Back to Style Library
            </Link>
            <h1 className="mt-4 font-serif text-5xl leading-tight text-white sm:text-6xl">Your saved styles</h1>
          </div>
        </div>

        {styleIds.length === 0 ? (
          <div className="rounded-[28px] border border-white/10 bg-[#100f0d] p-16 text-center text-[#b8ac9a]" style={{ backgroundColor: 'var(--bg-elevated)' }}>
            <p className="text-lg text-white">No saved styles yet.</p>
            <p className="mt-4 text-sm">Browse the Style Library and save looks you love.</p>
          </div>
        ) : (
          <>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <p className="text-sm text-[#b9a887]">{styles.size} saved style{styles.size === 1 ? '' : 's'}</p>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#d3b88b] px-6 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#0b0907] transition hover:bg-[#e5d3b2]"
              >
                Send my selection to Prolific
              </a>
            </div>

            {error && <p role="alert" className="my-4 rounded-lg border border-red-400/30 bg-red-950/30 p-3 text-sm text-red-200">{error}</p>}

            <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {styleIds.map((styleId) => {
                const style = styles.get(styleId);
                if (!style) {
                  return (
                    <div key={styleId} className="h-96 flex flex-col items-center justify-center rounded-[26px] border border-white/10 bg-[#11100d] text-xs text-[#a99d84]">
                      <X size={20} className="mb-2 opacity-50" />
                      <p className="mt-2">Unavailable</p>
                    </div>
                  );
                }
                return (
                  <div key={styleId} className="flex flex-col gap-4">
                    <Link href={`/styles/${styleId}`} className="group relative overflow-hidden rounded-[26px] border border-white/10 bg-[#100f0d]">
                      <div className="relative h-96 overflow-hidden rounded-[26px] bg-[#16120f]">
                        <Image
                          src={style.imageUrl}
                          alt={`${styleId} ${style.category.name}`}
                          width={style.imageWidth}
                          height={style.imageHeight}
                          unoptimized
                          className="object-cover transition duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            removeStyle(styleId);
                          }}
                          className="absolute right-4 top-4 rounded-full border border-white/10 bg-black/40 text-white opacity-90 transition hover:border-gold hover:text-gold"
                          aria-label={`Remove ${styleId} from saved styles`}
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div className="mt-4 flex flex-col gap-1">
                        <p className="font-serif text-lg text-white">{styleId}</p>
                        <p className="text-xs text-[#b8ac9a]">{style.category.name}</p>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
