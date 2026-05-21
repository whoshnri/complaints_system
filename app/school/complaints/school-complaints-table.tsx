'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MessageSquareReply } from 'lucide-react';

type Complaint = {
  id: number;
  title: string;
  content: string;
  category?: string;
  urgency?: string;
  status?: string;
  created_at: string;
  upvote_count: number;
  comment_count: number;
};

export default function SchoolComplaintsTable({
  complaints,
  verifiedSchool,
}: {
  complaints: Complaint[];
  verifiedSchool: boolean;
}) {
  const [items, setItems] = useState(complaints);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <MessageSquareReply className="mb-4 size-12 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">No complaints assigned to your school</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Student complaints for your assigned school will appear here as soon as they are submitted.
        </p>
      </div>
    );
  }

  return (
    <div className="p-5">
      {!verifiedSchool && (
        <div className="mb-4 rounded-md border border-border bg-secondary/60 px-4 py-3 text-sm text-foreground">
          Your school account is pending verification. You can view complaint records, but official responses are read-only.
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-border">
        <div className="divide-y divide-border">
          {items.map((complaint) => (
            <article key={complaint.id} className="bg-background p-4">
              <div className="grid gap-4 lg:grid-cols-[1fr_180px]">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-foreground">{complaint.title}</h2>
                    <span className="rounded-md bg-secondary px-2 py-1 text-xs font-semibold text-primary">
                      {complaint.status ?? 'unresolved'}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{complaint.content}</p>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span>{complaint.category ?? 'Uncategorized'}</span>
                    <span>{complaint.urgency ?? 'medium'} urgency</span>
                    <span>{complaint.upvote_count} upvotes</span>
                    <span>{complaint.comment_count} comments</span>
                    <Link href={`/complaint/${complaint.id}`} className="font-semibold text-primary hover:underline">
                      Public detail
                    </Link>
                  </div>
                </div>

                <div className="flex items-start lg:justify-end">
                  <Link
                    href={`/school/complaints/${complaint.id}`}
                    className="w-full rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 lg:w-auto"
                  >
                    {verifiedSchool ? 'Respond' : 'View'}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
