import { Metadata } from 'next';
import { getFeedAction } from '@/app/actions/complaints';
import FeedContent from './components/feed-content';

export const metadata: Metadata = {
  title: 'Feed - VoiceIt',
  description: 'Browse student complaints and feedback',
};

export default async function FeedPage() {
  const { data: complaints, empty } = await getFeedAction();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="sticky top-0 bg-background border-b border-border px-4 py-4 z-10">
        <h1 className="text-2xl font-bold text-foreground">Feed</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Complaints from schools you follow</p>
      </div>
      <FeedContent initialComplaints={complaints ?? []} isEmpty={empty ?? false} />
    </div>
  );
}
