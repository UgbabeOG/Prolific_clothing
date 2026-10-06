import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { SaveStyleButton } from '@/components/styles/SaveStyleButton';
import { StyleSaveNotice } from '@/components/styles/StyleSaveNotice';
import { SavedStylesTray } from '@/components/styles/SavedStylesTray';
import { createWhatsAppLink, styleInquiryMessage } from '@/lib/whatsapp';
import { getPublicStyle } from '@/lib/styles.server';
import { getSupabaseConfig } from '@/lib/supabase/config';
import { notFound } from 'next/navigation';

type StylePageProps = { params: Promise<{ styleId: string }> };

export async function generateMetadata({ params }: StylePageProps): Promise<Metadata> {
  const { styleId } = await params;
  if (!getSupabaseConfig()) return { title: 'Style Library — Prolific Clothing' };
  const style = await getPublicStyle(styleId);
  return style
    ? { title: `${style.styleId} — Style Library | Prolific Clothing`, description: `${style.category.name} style reference ${style.styleId} from Prolific Clothing.` }
    : { title: 'Style not found — Prolific Clothing' };
}

export default async function StyleDetailPage({ params }: StylePageProps) {
  const { styleId } = await params;
  if (!getSupabaseConfig()) notFound();
  const style = await getPublicStyle(styleId);
  if (!style) notFound();

  const whatsappHref = createWhatsAppLink(styleInquiryMessage(style.styleId));

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <AnnouncementBar />
      <Header />
      <main className="mx-auto max-w-7xl px-5 pb-28 pt-8 sm:px-8 sm:pt-12">
        <Link href="/styles" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#b8ac9a] transition hover:text-[#d3b88b]">
          <ArrowLeft size={14} /> Back to Style Library
        </Link>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start lg:gap-14">
          <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-lg bg-[#17130f]">
            <Image src={style.imageUrl} alt={`${style.category.name} style ${style.styleId}`} width={style.imageWidth} height={style.imageHeight} unoptimized fetchPriority="high" className="h-auto max-h-[82vh] w-full object-contain" />
          </div>
          <aside className="space-y-6 lg:sticky lg:top-28">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#d3b88b]">{style.category.name}</p>
            <h1 className="font-serif text-4xl sm:text-5xl">Style {style.styleId}</h1>
            <p className="text-sm leading-7 text-[#b8ac9a]">
              A visual reference to help communicate your preferred look. Final fabric, details, fit, pricing and availability are confirmed during consultation.
            </p>
            <div className="flex flex-col gap-3 pt-2">
              <SaveStyleButton styleId={style.styleId} />
              <StyleSaveNotice />
              <a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#d3b88b] px-6 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#0b0907] transition hover:bg-[#e5d3b2]">
                Ask about this style <ArrowUpRight size={15} />
              </a>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
      <SavedStylesTray />
    </div>
  );
}
