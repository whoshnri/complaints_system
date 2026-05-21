import Link from 'next/link';
import type { Metadata } from 'next';
import { schoolSignIn } from '@/app/actions/auth';
import SchoolLoginForm from './components/school-login-form';

export const metadata: Metadata = {
  title: 'School Login - VoiceIt',
  description: 'Login to the VoiceIt school dashboard',
};

export default function SchoolLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary/40 px-4 py-10">
      <div className="w-full max-w-md rounded-lg border border-border bg-background p-6 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="mt-2 text-3xl font-bold text-foreground">School Login</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Review complaints, respond officially, and monitor resolution progress for your school.
          </p>
        </div>

        <SchoolLoginForm schoolSignInAction={schoolSignIn} />

        <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
          <Link href="/login" className="font-medium text-primary hover:underline">
            Student login
          </Link>
          <Link href="/school-signup" className="font-medium text-primary hover:underline">
            Create school
          </Link>
          <Link href="/" className="font-medium text-primary hover:underline">
            Back home
          </Link>
        </div>
      </div>
    </main>
  );
}
