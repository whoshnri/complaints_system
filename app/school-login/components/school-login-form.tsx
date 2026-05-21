'use client';

import { useState } from 'react';
import { Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type AuthAction = (formData: FormData) => Promise<{ error: string } | void>;

export default function SchoolLoginForm({ schoolSignInAction }: { schoolSignInAction: AuthAction }) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);

    try {
      const result = await schoolSignInAction(formData);
      if (result?.error) {
        setError(result.error);
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      

      <div>
        <label htmlFor="username" className="mb-2 block text-sm font-medium text-foreground">
          School username
        </label>
        <Input
          id="username"
          name="username"
          type="text"
          placeholder="school_account"
          required
          disabled={loading}
          className="w-full"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium text-foreground">
          Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          disabled={loading}
          className="w-full"
        />
      </div>

      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Opening dashboard...' : 'Open school dashboard'}
      </Button>
    </form>
  );
}
