'use client';

import Link from 'next/link';
import { ThumbsUp, MessageCircle, Bookmark } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ComplaintCardProps {
  id: string;
  title: string;
  content: string;
  schoolName: string;
  category?: string;
  urgency?: string;
  status?: string;
  createdAt: string;
  upvoteCount: number;
  commentCount: number;
  isUpvoted?: boolean;
  isBookmarked?: boolean;
}

export default function ComplaintCard({
  id,
  title,
  content,
  schoolName,
  category,
  urgency,
  status,
  createdAt,
  upvoteCount,
  commentCount,
  isUpvoted = false,
  isBookmarked = false,
}: ComplaintCardProps) {
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  return (
    <Link href={`/complaint/${id}`}>
      <article className="border-b border-border px-4 py-4 hover:bg-secondary transition-colors">
        <div className="flex gap-3">
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h2 className="text-lg font-semibold text-foreground leading-tight">{title}</h2>
            </div>

            <p className="text-sm text-black mb-3 line-clamp-2">{content}</p>

            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
              <span className="font-medium">{schoolName}</span>
             
              <span>{timeAgo}</span>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <button
                onClick={(e) => e.preventDefault()}
                className={`flex items-center gap-1 hover:text-foreground transition-colors ${
                  isUpvoted ? 'text-primary' : ''
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
                  isBookmarked ? 'text-primary' : ''
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
