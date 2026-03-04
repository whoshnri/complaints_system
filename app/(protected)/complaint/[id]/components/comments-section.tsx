'use client';

import { useEffect, useState } from 'react';
import { getCommentsAction } from '@/app/actions/complaints';
import CommentCard from './comment-card';

interface CommentsSectionProps {
  complaintId: number;
}

export default function CommentsSection({ complaintId }: CommentsSectionProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="divide-y divide-border">
      <div className="px-4 py-3 bg-secondary">
        <h2 className="font-semibold text-foreground text-sm">
          {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
        </h2>
      </div>

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
