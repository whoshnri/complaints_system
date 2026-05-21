'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { searchComplaintsAction } from '@/app/actions/complaints';
import ComplaintCard from '../../feed/components/complaint-card';
import { Search as SearchIcon, SearchX } from 'lucide-react';

interface SearchContentProps {
  initialQuery: string;
}

export default function SearchContent({ initialQuery }: SearchContentProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(initialQuery.length > 0);

  useEffect(() => {
    if (initialQuery.length > 0) {
      performSearch(initialQuery);
    }
  }, []);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const { data } = await searchComplaintsAction(searchQuery);
      setResults(data || []);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}`);
    performSearch(query);
  };

  return (
    <div className="flex min-h-[calc(100vh-81px)] flex-col bg-background">
      <div className="p-4 border-b border-border">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search complaints by title or content..."
              className="w-full pl-10 pr-3 py-2 bg-input border border-border text-foreground placeholder-muted-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Search
          </button>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto">
        {!hasSearched ? (
          <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
            <div className="mb-5 flex size-14 items-center justify-center rounded-lg bg-secondary text-primary">
              <SearchIcon size={28} />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Search the complaint record</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Look up complaints by title, description, category, or keywords students may have used.
            </p>
          </div>
        ) : loading ? (
          <div className="p-6 text-center text-muted-foreground">
            Searching...
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
            <div className="mb-5 flex size-14 items-center justify-center rounded-lg bg-secondary text-primary">
              <SearchX size={28} />
            </div>
            <h2 className="text-lg font-semibold text-foreground">No matching complaints</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              We could not find anything for "{query}". Try a school name, category, or a shorter phrase.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {results.map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                id={complaint.id.toString()}
                title={complaint.title}
                content={complaint.description}
                category={complaint.category}
                status={complaint.status}
                schoolName={complaint.school_name || 'Unknown School'}
                createdAt={complaint.created_at}
                upvoteCount={complaint.upvote_count || 0}
                commentCount={complaint.comment_count || 0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
