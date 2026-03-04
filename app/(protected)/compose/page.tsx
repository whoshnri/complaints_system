import { Metadata } from 'next';
import ComposeForm from './components/compose-form';

export const metadata: Metadata = {
  title: 'Compose - VoiceIt',
  description: 'Write a new complaint or feedback',
};

export default function ComposePage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="sticky top-0 bg-background border-b border-border px-4 py-4 z-10">
        <h1 className="text-2xl font-bold text-foreground">New Complaint</h1>
        <p className="text-sm text-muted-foreground mt-1">Share your feedback anonymously</p>
      </div>

      <ComposeForm />
    </div>
  );
}
