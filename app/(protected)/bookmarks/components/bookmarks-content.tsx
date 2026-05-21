'use client';

import Link from 'next/link';
import { BookmarkPlus } from 'lucide-react';
import ComplaintCard from '../../feed/components/complaint-card';

export interface Bookmark {
  id: number;
  title: string;
  description: string;
  category?: string;
  status?: string;
  school_name: string;
  created_at: string;
  upvote_count?: number;
  comment_count?: number;
}

interface BookmarksContentProps {
  bookmarks: Bookmark[];
}

export default function BookmarksContent({ bookmarks }: BookmarksContentProps) {
  return (
    <div className="divide-y divide-border">
      {bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
          <div className="mb-5 flex size-14 items-center justify-center rounded-lg bg-secondary text-primary">
            <BookmarkPlus size={28} />
          </div>
          <h2 className="text-lg font-semibold text-foreground">No saved complaints yet</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Save important complaints to revisit official responses, status updates, and student contributions later.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/feed" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              Browse feed
            </Link>
            <Link href="/search" className="rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary">
              Search complaints
            </Link>
          </div>
        </div>
      ) : (
        bookmarks.map((bookmark) => (
          <ComplaintCard
            key={bookmark.id}
            id={bookmark.id.toString()}
            title={bookmark.title}
            content={bookmark.description}
            category={bookmark.category}
            status={bookmark.status}
            schoolName={bookmark.school_name}
            createdAt={bookmark.created_at}
            upvoteCount={bookmark.upvote_count || 0}
            commentCount={bookmark.comment_count || 0}
            isBookmarked={true}
          />
        ))
      )}
    </div>
  );
}
