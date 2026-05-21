'use client';

import { useState } from 'react';
import { Heart, MessageSquare, Bookmark, CheckCircle2 } from 'lucide-react';
import {
  upvoteComplaintAction,
  removeUpvoteAction,
  bookmarkComplaintAction,
  removeBookmarkAction,
  updateOwnComplaintStatusAction,
} from '@/app/actions/complaints';
import CommentsSection from './comments-section';

interface ComplaintDetailContentProps {
  complaint: any;
}

export default function ComplaintDetailContent({ complaint }: ComplaintDetailContentProps) {
  const [isUpvoted, setIsUpvoted] = useState(complaint.user_upvoted || false);
  const [isBookmarked, setIsBookmarked] = useState(complaint.user_bookmarked || false);
  const [upvoteCount, setUpvoteCount] = useState(complaint.upvote_count || 0);
  const [status, setStatus] = useState<'resolved' | 'unresolved'>(complaint.status || 'unresolved');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

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

  const handleStatusChange = async (nextStatus: 'resolved' | 'unresolved') => {
    setUpdatingStatus(true);
    setStatusMessage(null);

    const result = await updateOwnComplaintStatusAction(complaint.id, nextStatus);
    if (result.error) {
      setStatusMessage(result.error);
    } else {
      setStatus(nextStatus);
      setStatusMessage(`Marked as ${nextStatus}.`);
    }

    setUpdatingStatus(false);
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

  const statusDisplay = status.toUpperCase();
  const statusColors: Record<string, string> = {
    resolved: 'text-green-600 bg-green-50 dark:bg-green-950',
    unresolved: 'text-primary bg-secondary',
  };
  const statusColor = statusColors[status] || 'text-muted-foreground bg-secondary';

  return (
    <div className="flex min-h-[calc(100vh-81px)] flex-col bg-background">
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

          <div className="flex flex-wrap items-center gap-2 mb-3">
            {complaint.category && (
              <span className="text-xs px-2 py-0.5 rounded-full border border-border uppercase tracking-wide">
                {complaint.category}
              </span>
            )}
            {status && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-secondary uppercase tracking-wide">
                {status}
              </span>
            )}
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-4 leading-tight">
            {complaint.title}
          </h1>

          

          <p className="text-sm text-muted-foreground mb-6 whitespace-pre-wrap">
            {complaint.content}
          </p>

          {complaint.user_is_owner && (
            <div className="mb-6 rounded-lg border border-border bg-secondary/30 p-4">
              <div className="flex items-start gap-3">
                
                <div className="flex-1">
                  <h2 className="text-sm font-semibold text-foreground">You own this complaint</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Only you can mark this complaint resolved or unresolved.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={updatingStatus || status === 'unresolved'}
                      onClick={() => handleStatusChange('unresolved')}
                      className="rounded-md border border-border px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Mark unresolved
                    </button>
                    <button
                      type="button"
                      disabled={updatingStatus || status === 'resolved'}
                      onClick={() => handleStatusChange('resolved')}
                      className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Mark resolved
                    </button>
                  </div>
                  {statusMessage && (
                    <p className="mt-3 text-xs font-medium text-muted-foreground">{statusMessage}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-6 py-3 border-t border-b border-border">
            <button
              onClick={handleUpvote}
              className={`flex items-center gap-2 text-sm transition-colors ${
                isUpvoted
                  ? 'text-primary font-medium'
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
                  ? 'text-primary font-medium'
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
