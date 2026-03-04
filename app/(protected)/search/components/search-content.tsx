'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { searchComplaintsAction } from '@/app/actions/complaints';
import ComplaintCard from '../../feed/components/complaint-card';
import { Search as SearchIcon } from 'lucide-react';

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
    <div className="flex flex-col h-screen">
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
            className="px-4 py-2 bg-foreground text-background rounded-md hover:bg-primary transition-colors font-medium"
          >
            Search
          </button>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto">
        {!hasSearched ? (
          <div className="p-6 text-center text-muted-foreground">
            <p className="text-sm">Enter a search query to find complaints</p>
          </div>
        ) : loading ? (
          <div className="p-6 text-center text-muted-foreground">
            Searching...
          </div>
        ) : results.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <p className="text-sm">No results found for "{query}"</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {results.map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                id={complaint.id.toString()}
                title={complaint.title}
                content={complaint.content}
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
