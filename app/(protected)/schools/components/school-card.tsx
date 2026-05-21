'use client';

import { useState } from 'react';
import { followSchoolAction, unfollowSchoolAction } from '@/app/actions/complaints';

export interface School {
  id: number;
  name: string;
  description?: string;
  total_complaints?: number;
  resolved_complaints?: number;
  pending_complaints?: number;
  response_rate?: number;
}

interface SchoolCardProps {
  school: School;
  isFollowed: boolean;
}

export default function SchoolCard({ school, isFollowed: initialFollowed }: SchoolCardProps) {
  const [isFollowed, setIsFollowed] = useState(initialFollowed);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      if (isFollowed) {
        await unfollowSchoolAction(school.id);
        setIsFollowed(false);
      } else {
        await followSchoolAction(school.id);
        setIsFollowed(true);
      }
    } catch (err) {
      console.error('Failed to toggle follow:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-4 border-b border-border hover:bg-secondary/40 transition-colors">
      <div className="flex-1 min-w-0 mr-4">
        <h3 className="text-sm font-semibold text-foreground truncate">{school.name}</h3>
        {school.description && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{school.description}</p>
        )}
        <div className="flex flex-wrap gap-3 mt-1 text-[11px] text-muted-foreground">
          <span>Total: {school.total_complaints ?? 0}</span>
          <span>Resolved: {school.resolved_complaints ?? 0}</span>
          <span>Pending: {school.pending_complaints ?? 0}</span>
          <span>Response: {school.response_rate ?? 0}%</span>
        </div>
      </div>
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`shrink-0 rounded-md border px-4 py-1.5 text-xs font-semibold transition-all disabled:opacity-50 ${isFollowed
            ? 'border-primary bg-primary text-primary-foreground hover:bg-primary/90'
            : 'border-border bg-transparent text-foreground hover:border-primary/40 hover:bg-secondary'
          }`}
      >
        {loading ? '...' : isFollowed ? 'Following' : 'Follow'}
      </button>
    </div>
  );
}
