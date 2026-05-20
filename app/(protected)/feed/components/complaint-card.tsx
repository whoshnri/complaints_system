'use client';

import Link from 'next/link';
import { ThumbsUp, MessageCircle, Bookmark } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ComplaintCardProps {
  id: string;
  title: string;
  description: string;
  category?: string;
  status?: string;
  schoolName: string;
  createdAt: string;
  upvoteCount: number;
  commentCount: number;
  isUpvoted?: boolean;
  isBookmarked?: boolean;
}

export default function ComplaintCard({
  id,
  title,
  description,
  category,
  status,
  schoolName,
  createdAt,
  upvoteCount,
  commentCount,
  isUpvoted = false,
  isBookmarked = false,
}: ComplaintCardProps) {
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  // Map status to display format
  const statusDisplay = status ? status.replace('_', ' ').toUpperCase() : 'SUBMITTED';
  const statusColor = {
    submitted: 'text-muted-foreground',
    under_review: 'text-blue-500',
    resolved: 'text-green-500',
    dismissed: 'text-red-500',
  }[status || 'submitted'] || 'text-muted-foreground';

  return (
    <Link href={`/complaint/${id}`}>
      <article className="border-b border-border px-4 py-4 hover:bg-secondary transition-colors">
        <div className="flex gap-3">
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h2 className="text-lg font-semibold text-foreground leading-tight">{title}</h2>
            </div>

            <p className="text-sm text-foreground mb-3 line-clamp-2">{description}</p>

            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
              <span className="font-medium">{schoolName}</span>
              {category && <span className="px-2 py-0.5 bg-secondary rounded">{category}</span>}
              <span className={`px-2 py-0.5 rounded font-medium ${statusColor}`}>{statusDisplay}</span>
              <span>{timeAgo}</span>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <button
                onClick={(e) => e.preventDefault()}
                className={`flex items-center gap-1 hover:text-foreground transition-colors ${
                  isUpvoted ? 'text-foreground' : ''
                }`}
              >
                <ThumbsUp size={16} />
                <span>{upvoteCount}</span>
              </button>

              <button
                onClick={(e) => e.preventDefault()}
                className="flex items-center gap-1 hover:text-foreground transition-colors"
              >
                <MessageCircle size={16} />
                <span>{commentCount}</span>
              </button>

              <button
                onClick={(e) => e.preventDefault()}
                className={`flex items-center gap-1 ml-auto hover:text-foreground transition-colors ${
                  isBookmarked ? 'text-foreground' : ''
                }`}
              >
                <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
