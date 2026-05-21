import { Metadata } from 'next';
import { cookies } from 'next/headers';
import AccountContent, { User } from './components/account-content';
import { getUserIdFromSession, getUserById } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Account - VoiceIt',
  description: 'Manage your VoiceIt account',
};

export default async function AccountPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('voiceit_session')?.value;
  let user = null;

  if (sessionToken) {
    const userId = await getUserIdFromSession(sessionToken);
    if (userId) {
      user = await getUserById(userId);
    }
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-3xl bg-background md:border-x md:border-border">
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 px-5 py-5 backdrop-blur">
        <h1 className="text-2xl font-bold text-foreground">Account</h1>
      </div>

      <AccountContent user={user as User} />
    </div>
  );
}
