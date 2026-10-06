'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { ArrowRight, Heart, RotateCw } from 'lucide-react';
import { STYLE_PAGE_SIZE, type PublicStyle, type StyleCategory } from '@/lib/styles';
import { useSavedStyles } from './SavedStylesProvider';
import { SaveStyleButton } from './SaveStyleButton';

type GalleryResponse = {
  styles?: PublicStyle[];
  nextCursor?: string | null;
  hasMore?: boolean;
  error?: string;
};

export function StyleGallery({
  categories,
  initialStyles,
  configured,
}: {
  categories: StyleCategory[];
  initialStyles: PublicStyle[];
  configured: boolean;
}) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [styles, setStyles] = useState(initialStyles.slice(0, STYLE_PAGE_SIZE));
  const [cursor, setCursor] = useState(initialStyles.slice(0, STYLE_PAGE_SIZE).at(-1)?.styleId ?? null);
  const [hasMore, setHasMore] = useState(initialStyles.length > STYLE_PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const requestNumber = useRef(0);
  const { styleIds, storageError } = useSavedStyles();

  const loadPage = async (category: string, before: string | null, append: boolean) => {
    const currentRequest = ++requestNumber.current;
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (before) params.set('before', before);
      const response = await fetch(`/api/styles?${params.toString()}`);
      const result = await response.json() as GalleryResponse;
      if (!response.ok) throw new Error(result.error ?? 'Could not load styles.');
      if (currentRequest !== requestNumber.current) return;

      const nextStyles = result.styles ?? [];
      setStyles((current) => append ? [...current, ...nextStyles] : nextStyles);
      setCursor(result.nextCursor ?? null);
      setHasMore(Boolean(result.hasMore));
    } catch (caught) {
      if (currentRequest === requestNumber.current) {
        setError(caught instanceof Error ? caught.message : 'Could not load styles.');
      }
    } finally {
      if (currentRequest === requestNumber.current) setLoading(false);
    }
  };

  const selectCategory = (slug: string) => {
    setSelectedCategory(slug);
    setStyles([]);
    setCursor(null);
    setHasMore(false);
    void loadPage(slug, null, false);
  };

  return (
    <div className="mx-auto max-w-7xl px-5 pb-28 pt-10 sm:px-8 sm:pt-14">
      <header className="max-w-3xl">
        <p className="text-[10px] uppercase tracking-[0.34em] text-[#d3b88b]">Style Library</p>
        <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">Find Your Next Look</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#c2b49d] sm:text-base">
          Browse our collection of style references, save the looks you like and send your selection directly to Prolific Clothing.
        </p>
        <p className="mt-4 max-w-3xl text-xs leading-6 text-[#9e927f]">
          Our Style Library is a curated visual reference to help you communicate your preferred look. Final fabric, details, fit, pricing and availability are confirmed during consultation.
        </p>
      </header>
      {storageError && <p role="alert" className="mt-5 text-xs leading-6 text-amber-200">{storageError}</p>}

      {configured && (
        <nav aria-label="Filter styles by category" className="-mx-5 mt-8 overflow-x-auto px-5 sm:mx-0 sm:px-0">
          <ul className="flex w-max gap-2 pb-2 sm:gap-3">
            <li>
              <button type="button" aria-pressed={!selectedCategory} onClick={() => selectCategory('')} className={`rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.18em] transition sm:px-5 sm:py-2.5 ${!selectedCategory ? 'border-[#d3b88b] bg-[#d3b88b] text-[#0b0907]' : 'border-white/15 text-[#c2b49d] hover:border-[#d3b88b]'}`}>
                All
              </button>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <button type="button" aria-pressed={selectedCategory === category.slug} onClick={() => selectCategory(category.slug)} className={`rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.18em] transition sm:px-5 sm:py-2.5 ${selectedCategory === category.slug ? 'border-[#d3b88b] bg-[#d3b88b] text-[#0b0907]' : 'border-white/15 text-[#c2b49d] hover:border-[#d3b88b]'}`}>
                  {category.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {styleIds.length > 0 && (
        <div className="mt-4 flex items-center gap-2 text-xs text-[#b8ac9a] sm:hidden">
          <Heart size={14} /> {styleIds.length} {styleIds.length === 1 ? 'style' : 'styles'} saved
        </div>
      )}

      {!configured ? (
        <div className="mt-10 rounded-xl border border-white/10 bg-[#100f0d] px-6 py-10 text-center">
          <p className="font-serif text-2xl">Our visual library is being prepared.</p>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#b8ac9a]">Please check back soon to browse and save styles from Prolific Clothing.</p>
        </div>
      ) : error && styles.length === 0 ? (
        <div role="alert" className="mt-10 flex flex-col items-center gap-4 rounded-xl border border-red-400/20 bg-red-950/20 px-6 py-10 text-center">
          <p className="text-sm text-red-200">{error}</p>
          <button type="button" onClick={() => void loadPage(selectedCategory, null, false)} className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#d3b88b]">
            <RotateCw size={14} /> Try again
          </button>
        </div>
      ) : styles.length === 0 && !loading ? (
        <div className="mt-10 rounded-xl border border-white/10 bg-[#100f0d] px-6 py-10 text-center">
          <p className="font-serif text-2xl">{selectedCategory ? 'No styles in this category yet.' : 'The library is taking shape.'}</p>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#b8ac9a]">New looks will appear here as they are added to the Style Library.</p>
        </div>
      ) : (
        <section aria-label="Style references" className="mt-7">
          {error && (
            <div role="alert" className="mb-5 flex flex-wrap items-center justify-center gap-4 rounded-xl border border-red-400/20 bg-red-950/20 px-5 py-4 text-center">
              <p className="text-sm text-red-200">{error}</p>
              <button type="button" onClick={() => void loadPage(selectedCategory, cursor, true)} className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#d3b88b]">
                <RotateCw size={14} /> Retry
              </button>
            </div>
          )}
          <div className="columns-2 gap-3 sm:gap-5 lg:columns-3 xl:columns-4">
            {styles.map((style) => (
              <article key={style.styleId} className="mb-4 inline-block w-full break-inside-avoid sm:mb-6">
                <div className="group relative overflow-hidden rounded-md bg-[#17130f]">
                  <Link href={`/styles/${style.styleId}`} aria-label={`View style ${style.styleId}`}>
                    <Image src={style.imageUrl} alt={`${style.category.name} style ${style.styleId}`} width={style.imageWidth} height={style.imageHeight} unoptimized loading="lazy" decoding="async" className="h-auto w-full transition duration-500 group-hover:scale-[1.025]" />
                  </Link>
                  <div className="absolute right-2 top-2 sm:right-3 sm:top-3">
                    <SaveStyleButton styleId={style.styleId} compact />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 px-1 pt-2.5">
                  <Link href={`/styles/${style.styleId}`} className="text-[11px] font-medium tracking-[0.13em] text-[#e5ddd0] transition hover:text-[#d3b88b]">
                    {style.styleId}
                  </Link>
                  <Link href={`/styles/${style.styleId}`} className="inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.13em] text-[#a99d84] hover:text-[#d3b88b]">
                    View <ArrowRight size={11} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
          {loading && <p className="py-8 text-center text-xs uppercase tracking-[0.2em] text-[#a99d84]">Loading styles…</p>}
          {hasMore && !loading && !error && (
            <div className="flex justify-center pt-5">
              <button type="button" onClick={() => void loadPage(selectedCategory, cursor, true)} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-[10px] uppercase tracking-[0.2em] text-[#d3c7b0] transition hover:border-[#d3b88b] hover:text-white">
                Load more <ArrowRight size={13} />
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
