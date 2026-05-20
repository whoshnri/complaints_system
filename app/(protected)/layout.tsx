import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import BottomNav from './components/bottom-nav';
import FloatingCompose from './components/floating-compose';
import { getSessionUser } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'VoiceIt',
  description: 'Anonymous student feedback platform',
};

export const dynamic = 'force-dynamic';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionUser();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex flex-col min-h-screen max-w-2xl mx-auto bg-background">
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>
      <BottomNav />
      <FloatingCompose />
    </div>
  );
}
