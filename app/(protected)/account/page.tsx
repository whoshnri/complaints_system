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
    <div className="max-w-2xl mx-auto">
      <div className="sticky top-0 bg-background border-b border-border px-4 py-4 z-10">
        <h1 className="text-2xl font-bold text-foreground">Account</h1>
      </div>

      <AccountContent user={user as User} />
    </div>
  );
}
