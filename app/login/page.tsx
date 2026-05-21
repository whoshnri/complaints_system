import { Metadata } from 'next';
import { signIn } from '@/app/actions/auth';
import LoginForm from './components/login-form';

export const metadata: Metadata = {
  title: 'Login - VoiceIt',
  description: 'Login to your VoiceIt account',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">VoiceIt</h1>
          <p className="text-muted-foreground">Anonymous student feedback platform</p>
        </div>

        <LoginForm signInAction={signIn} />

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <a href="/signup" className="font-medium text-foreground hover:underline">
            Sign up
          </a>
        </div>
        <div className="mt-3 text-center text-sm text-muted-foreground">
          School account?{' '}
          <a href="/school-login" className="font-medium text-primary hover:underline">
            Open school login
          </a>
        </div>
      </div>
    </div>
  );
}
