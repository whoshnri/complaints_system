'use client';

import Link from 'next/link';
import { logoutAction } from '@/app/actions/auth';
import { LogOut, Bookmark, GraduationCap } from 'lucide-react';

export interface User {
  id: number;
  email?: string | null;
  username: string;
  created_at: string;
}

interface AccountContentProps {
  user?: User | null;
}

export default function AccountContent({ user }: AccountContentProps) {
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleLogout = async () => {
    await logoutAction();
  };

  if (!user) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Loading account information...
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      <div className="p-4 space-y-4">
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-1">Email</h2>
          <p className="text-foreground">{user.email || 'Not provided'}</p>
        </div>
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-1">Username</h2>
          <p className="text-foreground">{user.username}</p>
        </div>
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-1">Member Since</h2>
          <p className="text-foreground">{formatDate(user.created_at)}</p>
        </div>
      </div>

      <div className="p-4 space-y-1">
        <Link
          href="/schools"
          className="flex items-center gap-3 py-2 text-foreground hover:text-primary transition-colors"
        >
          <GraduationCap size={18} />
          <span className="text-sm font-medium">Followed Schools</span>
        </Link>
        <Link
          href="/bookmarks"
          className="flex items-center gap-3 py-2 text-foreground hover:text-primary transition-colors"
        >
          <Bookmark size={18} />
          <span className="text-sm font-medium">Saved Complaints</span>
        </Link>
      </div>

      <div className="p-4">
        <form action={handleLogout}>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-destructive text-destructive hover:bg-destructive/10 rounded-md transition-colors font-medium"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}
