'use client';

import { useState } from 'react';
import { signUp } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SignUpForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);

    try {
      const result = await signUp(formData);
      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-foreground mb-2">
          Username
        </label>
        <Input
          id="username"
          name="username"
          type="text"
          placeholder="your_username"
          required
          disabled={loading}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Choose a username that doesn't reveal your identity
        </p>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
          Email (optional)
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="your@email.com"
          disabled={loading}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Only for password recovery - not shared publicly
        </p>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
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

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
          Confirm Password
        </label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          required
          disabled={loading}
          className="w-full"
        />
      </div>

      {error && (
        <div className="p-3 bg-destructive bg-opacity-10 border border-destructive text-white rounded text-sm">
          {error}
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Creating account...' : 'Sign up'}
      </Button>
    </form>
  );
}
