import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-5xl font-bold text-foreground">VoiceIt</h1>
          <p className="text-xl text-muted-foreground">
            Give your feedback. Stay anonymous. Make change.
          </p>
        </div>

        <p className="text-lg text-foreground max-w-lg mx-auto leading-relaxed">
          VoiceIt is a platform for students to anonymously share complaints and feedback about their schools.
          Your voice matters, and you deserve to be heard without fear.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login">
            <Button size="lg">Sign In</Button>
          </Link>
          <Link href="/signup">
            <Button size="lg" variant="outline">Create Account</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 pt-8 border-t border-border">
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Anonymous</h3>
            <p className="text-sm text-muted-foreground">
              Speak freely without revealing your identity
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Safe</h3>
            <p className="text-sm text-muted-foreground">
              Your privacy is protected and respected
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Impactful</h3>
            <p className="text-sm text-muted-foreground">
              Your feedback drives positive change
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
