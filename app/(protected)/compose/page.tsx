import { Metadata } from 'next';
import ComposeForm from './components/compose-form';

export const metadata: Metadata = {
  title: 'Compose - VoiceIt',
  description: 'Write a new complaint or feedback',
};

export default function ComposePage() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-3xl bg-background md:border-x md:border-border">
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 px-5 py-5 backdrop-blur">
        <h1 className="text-2xl font-bold text-foreground">New Complaint</h1>
        <p className="text-sm text-muted-foreground mt-1">Share your feedback anonymously</p>
      </div>

      <ComposeForm />
    </div>
  );
}
