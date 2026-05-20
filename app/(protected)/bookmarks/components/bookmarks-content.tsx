'use client';

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
        <div className="p-6 text-center text-muted-foreground">
          <p className="text-sm">You haven't bookmarked any complaints yet</p>
          <p className="text-xs text-muted-foreground mt-2">
            Bookmark complaints to save them for later
          </p>
        </div>
      ) : (
        bookmarks.map((bookmark) => (
          <ComplaintCard
            key={bookmark.id}
            id={bookmark.id.toString()}
            title={bookmark.title}
            description={bookmark.description}
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
