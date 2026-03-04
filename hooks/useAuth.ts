'use client';

import { useCallback, useEffect, useState } from 'react';
import { getSessionUser } from '@/lib/auth';

export interface User {
  id: string;
  email: string;
  username: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkSession() {
      try {
        const session = await getSessionUser();
        if (session?.user_id) {
          // Fetch user details (you'll need to add this to your DB functions)
          setUser({
            id: session.user_id,
            email: '',
            username: '',
          });
        }
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to check session');
        setLoading(false);
      }
    }

    checkSession();
  }, []);

  return { user, loading, error };
}
