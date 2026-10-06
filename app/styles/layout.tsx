import { SavedStylesProvider } from '@/components/styles/SavedStylesProvider';

export default function StyleLibraryLayout({ children }: { children: React.ReactNode }) {
  return <SavedStylesProvider>{children}</SavedStylesProvider>;
}
