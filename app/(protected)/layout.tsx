import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import BottomNav from './components/bottom-nav';
import FloatingCompose from './components/floating-compose';
import SidebarNav from './components/sidebar-nav';
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
    <div className="min-h-screen bg-secondary/30 text-foreground">
      <SidebarNav />
      <main className="min-h-screen pb-24 md:pl-72 md:pb-0">
        {children}
      </main>
      <BottomNav />
      <FloatingCompose />
    </div>
  );
}
