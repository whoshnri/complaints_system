import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getSchoolById } from '@/lib/db';
import SchoolAdminNav from './components/school-admin-nav';

export const metadata: Metadata = {
  title: 'School Dashboard - VoiceIt',
  description: 'School dashboard for VoiceIt complaints',
};

export const dynamic = 'force-dynamic';

export default async function SchoolLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user || (user.role !== 'school' && !user.is_school_account)) {
    redirect('/school-login');
  }

  if (!user.school_id) {
    redirect('/school-login');
  }

  const school = await getSchoolById(String(user.school_id));

  return (
    <div className="min-h-screen bg-secondary/30 text-foreground">
      <SchoolAdminNav schoolName={school?.name ?? 'Assigned school'} />
      <main className="min-h-screen pb-20 md:pl-72 md:pb-0">{children}</main>
    </div>
  );
}
