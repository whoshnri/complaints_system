'use client';

import Link from 'next/link';
import ComplaintCard from './complaint-card';

export interface Complaint {
  id: string;
  title: string;
  content: string;
  school_name: string;
  created_at: string;
  upvote_count: number;
  comment_count: number;
}

interface FeedContentProps {
  initialComplaints: Complaint[];
  isEmpty: boolean;
}

export default function FeedContent({ initialComplaints, isEmpty }: FeedContentProps) {
  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="text-4xl mb-4">🏫</div>
        <h2 className="text-lg font-semibold text-foreground mb-2">No schools followed yet</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Follow schools to see their complaints here in your feed.
        </p>
        <Link
          href="/schools"
          className="px-5 py-2 bg-foreground text-background text-sm font-semibold rounded-full hover:bg-foreground/80 transition-colors"
        >
          Browse Schools
        </Link>
      </div>
    );
  }

  if (initialComplaints.length === 0) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        <p className="text-sm">No complaints yet from schools you follow.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {initialComplaints.map((complaint) => (
        <ComplaintCard
          key={complaint.id}
          id={complaint.id}
          title={complaint.title}
          content={complaint.content}
          schoolName={complaint.school_name}
          createdAt={complaint.created_at}
          upvoteCount={complaint.upvote_count}
          commentCount={complaint.comment_count}
        />
      ))}
    </div>
  );
}
