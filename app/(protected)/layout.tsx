import { Metadata } from 'next';
import BottomNav from './components/bottom-nav';
import FloatingCompose from './components/floating-compose';

export const metadata: Metadata = {
  title: 'VoiceIt',
  description: 'Anonymous student feedback platform',
};

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
