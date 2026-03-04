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
    <div className="max-w-2xl mx-auto">
      <div className="sticky top-0 bg-background border-b border-border px-4 py-4 z-10">
        <h1 className="text-2xl font-bold text-foreground">Saved</h1>
        <p className="text-sm text-muted-foreground mt-1">Complaints you've bookmarked</p>
      </div>

      <BookmarksContent bookmarks={bookmarks} />
    </div>
  );
}
