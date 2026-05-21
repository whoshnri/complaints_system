import Link from 'next/link';
import type { Metadata } from 'next';
import SchoolSignUpForm from './components/school-signup-form';

export const metadata: Metadata = {
  title: 'Create School Account - VoiceIt',
  description: 'Create a VoiceIt school account',
};

export const dynamic = 'force-dynamic';

export default async function SchoolSignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary/40 px-4 py-10">
      <div className="w-full max-w-md rounded-lg border border-border bg-background p-6 shadow-sm">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">School access</p>
          <h1 className="mt-2 text-3xl font-bold text-foreground">Create School Account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Register the school profile and its login account. Verification is completed manually in the database.
          </p>
        </div>

        <SchoolSignUpForm />

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already have a school account?{' '}
          <Link href="/school-login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
