'use client';

import { useState } from 'react';
import { Heart, MessageSquare, Bookmark } from 'lucide-react';
import { upvoteComplaintAction, removeUpvoteAction, bookmarkComplaintAction, removeBookmarkAction } from '@/app/actions/complaints';
import CommentsSection from './comments-section';

interface ComplaintDetailContentProps {
  complaint: any;
}

export default function ComplaintDetailContent({ complaint }: ComplaintDetailContentProps) {
  const [isUpvoted, setIsUpvoted] = useState(complaint.user_upvoted || false);
  const [isBookmarked, setIsBookmarked] = useState(complaint.user_bookmarked || false);
  const [upvoteCount, setUpvoteCount] = useState(complaint.upvote_count || 0);

  const handleUpvote = async () => {
    try {
      if (isUpvoted) {
        await removeUpvoteAction(complaint.id);
        setUpvoteCount(Math.max(0, upvoteCount - 1));
      } else {
        await upvoteComplaintAction(complaint.id);
        setUpvoteCount(upvoteCount + 1);
      }
      setIsUpvoted(!isUpvoted);
    } catch (error) {
      console.error('Failed to update upvote:', error);
    }
  };

  const handleBookmark = async () => {
    try {
      if (isBookmarked) {
        await removeBookmarkAction(complaint.id);
      } else {
        await bookmarkComplaintAction(complaint.id);
      }
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Failed to update bookmark:', error);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Map status to display format
  const statusDisplay = complaint.status ? complaint.status.replace('_', ' ').toUpperCase() : 'SUBMITTED';
  const statusColor = {
    submitted: 'text-muted-foreground bg-secondary',
    under_review: 'text-blue-600 bg-blue-50 dark:bg-blue-950',
    resolved: 'text-green-600 bg-green-50 dark:bg-green-950',
    dismissed: 'text-red-600 bg-red-50 dark:bg-red-950',
  }[complaint.status || 'submitted'] || 'text-muted-foreground bg-secondary';

  return (
    <div className="flex flex-col h-screen">
      <article className="flex-1 overflow-y-auto">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-muted-foreground uppercase">
              {complaint.school_name}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDate(complaint.created_at)}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-4 leading-tight">
            {complaint.title}
          </h1>

          <div className="flex items-center gap-2 mb-4">
            {complaint.category && (
              <span className="px-2 py-1 text-xs font-medium bg-secondary text-foreground rounded">
                {complaint.category}
              </span>
            )}
            <span className={`px-2 py-1 text-xs font-medium rounded ${statusColor}`}>
              {statusDisplay}
            </span>
          </div>

          <p className="text-sm text-muted-foreground mb-6 whitespace-pre-wrap">
            {complaint.description}
          </p>

          <div className="flex items-center gap-6 py-3 border-t border-b border-border">
            <button
              onClick={handleUpvote}
              className={`flex items-center gap-2 text-sm transition-colors ${
                isUpvoted
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Heart size={18} fill={isUpvoted ? 'currentColor' : 'none'} />
              <span>{upvoteCount}</span>
            </button>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MessageSquare size={18} />
              <span>{complaint.comment_count || 0}</span>
            </div>

            <button
              onClick={handleBookmark}
              className={`flex items-center gap-2 text-sm transition-colors ml-auto ${
                isBookmarked
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        <CommentsSection complaintId={complaint.id} />
      </article>
    </div>
  );
}
