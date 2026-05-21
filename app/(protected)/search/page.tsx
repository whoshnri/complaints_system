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
    <div className="mx-auto min-h-screen w-full max-w-4xl bg-background md:border-x md:border-border">
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 px-5 py-5 backdrop-blur">
        <h1 className="text-2xl font-bold text-foreground">Search</h1>
      </div>

      <SearchContent initialQuery={query!} />
    </div>
  );
}
