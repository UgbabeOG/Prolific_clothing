import type { Metadata } from 'next';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { SavedStylesTray } from '@/components/styles/SavedStylesTray';
import { StyleGallery } from '@/components/styles/StyleGallery';
import { getPublicStyles, getStyleCategories } from '@/lib/styles.server';
import { getSupabaseConfig } from '@/lib/supabase/config';
import { STYLE_PAGE_SIZE } from '@/lib/styles';

export const metadata: Metadata = {
  title: 'Style Library — Prolific Clothing',
  description: 'Browse visual style references, save the looks you like and send your selection directly to Prolific Clothing.',
};

export const dynamic = 'force-dynamic';

export default async function StyleLibraryPage() {
  const configured = Boolean(getSupabaseConfig());
  const [categories, styles] = configured
    ? await Promise.all([getStyleCategories(), getPublicStyles({ limit: STYLE_PAGE_SIZE + 1 })])
    : [[], []];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <AnnouncementBar />
      <Header />
      <main>
        <StyleGallery categories={categories} initialStyles={styles} configured={configured} />
      </main>
      <Footer />
      <SavedStylesTray />
    </div>
  );
}
