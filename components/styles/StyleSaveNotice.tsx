'use client';

import { useSavedStyles } from './SavedStylesProvider';

export function StyleSaveNotice() {
  const { storageError } = useSavedStyles();
  return storageError ? <p role="alert" className="text-xs leading-6 text-amber-200">{storageError}</p> : null;
}
