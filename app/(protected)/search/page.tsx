import { Metadata } from 'next';
import SearchContent from './components/search-content';

export const metadata: Metadata = {
  title: 'Search - VoiceIt',
  description: 'Search complaints and feedback',
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {

  const { q } = await searchParams;
  const query = q || '';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="sticky top-0 bg-background border-b border-border px-4 py-4 z-10">
        <h1 className="text-2xl font-bold text-foreground">Search</h1>
      </div>

      <SearchContent initialQuery={query!} />
    </div>
  );
}
