'use client';

import { useState } from 'react';
import { schoolSignUp } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SchoolSignUpForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);

    try {
      const result = await schoolSignUp(formData);
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
        <label htmlFor="schoolName" className="mb-2 block text-sm font-medium text-foreground">
          School name
        </label>
        <Input
          id="schoolName"
          name="schoolName"
          type="text"
          placeholder="Faculty of Engineering"
          required
          disabled={loading}
          className="w-full"
        />
      </div>

      <div>
        <label htmlFor="faculty" className="mb-2 block text-sm font-medium text-foreground">
          Faculty or group
        </label>
        <Input
          id="faculty"
          name="faculty"
          type="text"
          placeholder="Engineering"
          disabled={loading}
          className="w-full"
        />
      </div>

      <div>
        <label htmlFor="description" className="mb-2 block text-sm font-medium text-foreground">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          placeholder="Short description of the school or department"
          disabled={loading}
          className="min-h-24 w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
          School email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="admin@school.edu"
          disabled={loading}
          className="w-full"
        />
      </div>

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

      <div>
        <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-foreground">
          Confirm password
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

      {/* <div className="rounded-md border border-border bg-secondary/50 p-3 text-sm text-muted-foreground">
        New school accounts are read-only until `verifiedSchool` is set to true in the database.
      </div> */}

      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Creating school account...' : 'Create school account'}
      </Button>
    </form>
  );
}
