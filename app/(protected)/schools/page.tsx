import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { getSchoolsAction, getFollowedSchoolsAction } from '@/app/actions/complaints';
import SchoolsList from './components/schools-list';
import { School } from './components/school-card';

export const metadata: Metadata = {
  title: 'Schools - VoiceIt',
  description: 'Browse and follow schools',
};

export default async function SchoolsPage() {
  const [{ data: schools }, { data: followed }] = await Promise.all([
    getSchoolsAction(),
    getFollowedSchoolsAction(),
  ]);

  const followedSchoolIds = (followed ?? []).map((s: any) => s.id as number);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="sticky top-0 bg-background border-b border-border px-4 py-4 z-10">
        <h1 className="text-2xl font-bold text-foreground">Schools</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Follow schools to see their complaints in your feed
        </p>
      </div>

      <SchoolsList
        initialSchools={(schools as School[]) ?? []}
        followedSchoolIds={followedSchoolIds}
      />
    </div>
  );
}
