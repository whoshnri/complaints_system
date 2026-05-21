import { getSchoolComplaintsAction } from '@/app/actions/school-admin';
import SchoolComplaintsTable from './school-complaints-table';

export default async function SchoolComplaintsPage() {
  const { data, error } = await getSchoolComplaintsAction();

  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl bg-background md:border-x md:border-border">
      <header className="border-b border-border px-5 py-6">
        {/* <p className="text-sm font-semibold uppercase tracking-wide text-primary">Complaint management</p> */}
        <h1 className="mt-2 text-3xl font-bold text-foreground">School complaints</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Review reports submitted to your school and add official responses. Students control resolved status for their own complaints.
        </p>
      </header>

      {error ? (
        <div className="p-5">
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-5 text-sm text-destructive">
            {error}
          </div>
        </div>
      ) : (
        <SchoolComplaintsTable
          complaints={data?.complaints ?? []}
          verifiedSchool={Boolean(data?.schoolAccount?.verified_school)}
        />
      )}
    </div>
  );
}
