'use client';

import { useEffect, useState } from 'react';
import { createCommentAction, getCommentsAction } from '@/app/actions/complaints';
import CommentCard from './comment-card';

interface CommentsSectionProps {
  complaintId: number;
}

export default function CommentsSection({ complaintId }: CommentsSectionProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await getCommentsAction(complaintId);
        setComments(data || []);
      } catch (error) {
        console.error('Failed to load comments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [complaintId]);

  if (loading) {
    return <div className="p-4 text-center text-muted-foreground">Loading comments...</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPosting(true);
    try {
      const { data, error: submitError } = await createCommentAction(complaintId, commentInput);
      if (submitError) {
        setError(submitError);
        return;
      }
      if (data) {
        setComments((prev) => [...prev, data]);
        setCommentInput('');
      }
    } catch {
      setError('Failed to post contribution');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="divide-y divide-border">
      <div className="px-4 py-3 bg-secondary">
        <h2 className="font-semibold text-foreground text-sm">
          {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-2">
        <textarea
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          placeholder="Add your anonymous contribution..."
          className="w-full px-3 py-2 bg-input border border-border text-foreground placeholder-muted-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none h-24"
          maxLength={1000}
          required
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={posting}
            className="px-4 py-2 bg-foreground text-background rounded-md hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            {posting ? 'Posting...' : 'Post Contribution'}
          </button>
        </div>
      </form>

      {comments.length === 0 ? (
        <div className="p-6 text-center text-muted-foreground text-sm">
          No comments yet. Be the first to share your thoughts.
        </div>
      ) : (
        comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))
      )}
    </div>
  );
}
