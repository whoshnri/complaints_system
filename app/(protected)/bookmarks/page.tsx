import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { getUserIdFromSession, getUserBookmarks } from '@/lib/db';
import BookmarksContent, { Bookmark } from './components/bookmarks-content';

export const metadata: Metadata = {
  title: 'Bookmarks - VoiceIt',
  description: 'Your saved complaints',
};

export default async function BookmarksPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('voiceit_session')?.value;
  let bookmarks: Bookmark[] = [];

  if (sessionToken) {
    const userId = await getUserIdFromSession(sessionToken);
    if (userId) {
      bookmarks = await getUserBookmarks(userId);
    }
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-4xl bg-background md:border-x md:border-border">
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 px-5 py-5 backdrop-blur">
        <h1 className="text-2xl font-bold text-foreground">Saved</h1>
        <p className="text-sm text-muted-foreground mt-1">Complaints you've bookmarked</p>
      </div>

      <BookmarksContent bookmarks={bookmarks} />
    </div>
  );
}
