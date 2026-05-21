import { Metadata } from 'next';
import { getFeedAction } from '@/app/actions/complaints';
import FeedContent from './components/feed-content';

export const metadata: Metadata = {
  title: 'Feed - VoiceIt',
  description: 'Browse student complaints and feedback',
};

export default async function FeedPage() {
  const { data: complaints, empty, followedCount } = await getFeedAction();

  return (
    <div className="mx-auto min-h-screen w-full max-w-4xl bg-background md:border-x md:border-border">
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 px-5 py-5 backdrop-blur">
        <h1 className="text-2xl font-bold text-foreground">Feed</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Complaints from schools you follow</p>
      </div>
      <FeedContent
        initialComplaints={complaints ?? []}
        isEmpty={empty ?? false}
        followedCount={followedCount ?? 0}
      />
    </div>
  );
}
