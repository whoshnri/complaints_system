'use client';

import Link from 'next/link';
import { BellPlus, GraduationCap } from 'lucide-react';
import ComplaintCard from './complaint-card';

export interface Complaint {
  id: string;
  title: string;
  content: string;
  school_name: string;
  category?: string;
  urgency?: string;
  status?: string;
  created_at: string;
  upvote_count: number;
  comment_count: number;
}

interface FeedContentProps {
  initialComplaints: Complaint[];
  isEmpty: boolean;
  followedCount: number;
}

export default function FeedContent({ initialComplaints, isEmpty, followedCount }: FeedContentProps) {
  if (isEmpty && followedCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="mb-5 flex size-14 items-center justify-center rounded-lg bg-secondary text-primary">
          <GraduationCap size={28} />
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-2">No schools followed yet</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Choose the schools you care about and this feed will become your live complaint stream.
        </p>
        <Link
          href="/schools"
          className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Browse Schools
        </Link>
      </div>
    );
  }

  if (initialComplaints.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="mb-5 flex size-14 items-center justify-center rounded-lg bg-secondary text-primary">
          <BellPlus size={28} />
        </div>
        <h2 className="text-lg font-semibold text-foreground">No complaints from followed schools yet</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          You are following {followedCount} {followedCount === 1 ? 'school' : 'schools'}, but no public complaints have been posted for them yet.
        </p>
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
            category={complaint.category}
            urgency={complaint.urgency}
            status={complaint.status}
            createdAt={complaint.created_at}
          upvoteCount={complaint.upvote_count}
          commentCount={complaint.comment_count}
        />
      ))}
    </div>
  );
}
