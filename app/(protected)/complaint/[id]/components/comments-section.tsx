'use client';

import { useEffect, useState } from 'react';
import { MessagesSquare } from 'lucide-react';
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
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {posting ? 'Posting...' : 'Post Contribution'}
          </button>
        </div>
      </form>

      {comments.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-secondary text-primary">
            <MessagesSquare size={24} />
          </div>
          <h3 className="text-base font-semibold text-foreground">No contributions yet</h3>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Add context, supporting details, or a related experience to help the school understand the issue.
          </p>
        </div>
      ) : (
        comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))
      )}
    </div>
  );
}
