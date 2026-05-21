import { Metadata } from 'next';
import { signUp } from '@/app/actions/auth';
import SignUpForm from './components/signup-form';

export const metadata: Metadata = {
  title: 'Sign Up - VoiceIt',
  description: 'Create your VoiceIt account',
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">VoiceIt</h1>
          <p className="text-muted-foreground">Create your anonymous feedback account</p>
        </div>

        <SignUpForm signUpAction={signUp} />

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <a href="/login" className="font-medium text-foreground hover:underline">
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}
