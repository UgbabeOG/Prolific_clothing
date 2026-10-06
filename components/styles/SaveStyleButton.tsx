'use client';

import { Heart } from 'lucide-react';
import { useSavedStyles } from './SavedStylesProvider';

export function SaveStyleButton({ styleId, compact = false }: { styleId: string; compact?: boolean }) {
  const { styleIds, toggleStyle } = useSavedStyles();
  const isSaved = styleIds.includes(styleId);

  return (
    <button
      type="button"
      onClick={() => toggleStyle(styleId)}
      aria-pressed={isSaved}
      aria-label={isSaved ? `Remove ${styleId} from saved styles` : `Save ${styleId}`}
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-white/15 text-xs uppercase tracking-[0.15em] transition hover:border-[#d3b88b] ${
        compact ? 'h-9 w-9 bg-black/55 backdrop-blur-sm' : 'px-5 py-3'
      } ${isSaved ? 'text-[#d3b88b]' : 'text-[#d3c7b0]'}`}
    >
      <Heart size={compact ? 16 : 17} fill={isSaved ? 'currentColor' : 'none'} />
      {!compact && (isSaved ? 'Saved' : 'Save style')}
    </button>
  );
}
