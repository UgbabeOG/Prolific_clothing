'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'prolific-style-library-saved';
const SavedStylesContext = createContext<{
  styleIds: string[];
  storageError: string;
  toggleStyle: (styleId: string) => void;
  removeStyle: (styleId: string) => void;
}>({
  styleIds: [],
  storageError: '',
  toggleStyle: () => {},
  removeStyle: () => {},
});

function validStyleIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return Array.from(new Set(value.filter((id): id is string => typeof id === 'string' && /^P\d{3,}$/i.test(id))));
}

export function SavedStylesProvider({ children }: { children: React.ReactNode }) {
  const [styleIds, setStyleIds] = useState<string[]>([]);
  const [storageError, setStorageError] = useState('');

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setStyleIds(validStyleIds(JSON.parse(stored)));
    } catch {
      setStorageError('This browser is blocking local storage. Saved styles may not remain available after you leave this page.');
      window.dispatchEvent(new CustomEvent('style-library-storage-error'));
    }

    const syncStyles = (event: Event) => {
      if (event instanceof StorageEvent && event.key !== STORAGE_KEY) return;
      try {
        setStyleIds(validStyleIds(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]')));
      } catch {
        setStorageError('This browser is blocking local storage. Saved styles may not remain available after you leave this page.');
        window.dispatchEvent(new CustomEvent('style-library-storage-error'));
      }
    };

    window.addEventListener('storage', syncStyles);
    window.addEventListener('style-library-saved-changed', syncStyles);
    return () => {
      window.removeEventListener('storage', syncStyles);
      window.removeEventListener('style-library-saved-changed', syncStyles);
    };
  }, []);

  const persist = useCallback((nextIds: string[]) => {
    setStyleIds(nextIds);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextIds));
      setStorageError('');
      window.dispatchEvent(new CustomEvent('style-library-saved-changed'));
    } catch {
      setStorageError('This browser is blocking local storage. Saved styles may not remain available after you leave this page.');
      window.dispatchEvent(new CustomEvent('style-library-storage-error'));
    }
  }, []);

  const toggleStyle = useCallback((styleId: string) => {
    persist(styleIds.includes(styleId)
      ? styleIds.filter((id) => id !== styleId)
      : [...styleIds, styleId]);
  }, [persist, styleIds]);

  const removeStyle = useCallback((styleId: string) => {
    persist(styleIds.filter((id) => id !== styleId));
  }, [persist, styleIds]);

  return (
    <SavedStylesContext.Provider value={{ styleIds, storageError, toggleStyle, removeStyle }}>
      {children}
    </SavedStylesContext.Provider>
  );
}

export function useSavedStyles() {
  return useContext(SavedStylesContext);
}
