import Link from 'next/link';
import { AlertCircle, CheckCircle2, Clock3, Inbox, TrendingUp } from 'lucide-react';
import { getSchoolDashboardAction } from '@/app/actions/school-admin';

const statusLabels: Record<string, string> = {
  unresolved: 'Unresolved',
  resolved: 'Resolved',
};

function StatCard({
  label,
  value,
  Icon,
}: {
  label: string;
  value: string | number;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {/* <Icon className="size-5 text-primary" /> */}
      </div>
      <p className="mt-3 text-3xl font-bold text-foreground">{value}</p>
    </div>
  );
}

export default async function SchoolDashboardPage() {
  const { data, error } = await getSchoolDashboardAction();

  if (error || !data) {
    return (
      <div className="mx-auto min-h-screen w-full max-w-6xl bg-background p-6 md:border-x md:border-border">
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-destructive">
          {error ?? 'Unable to load school dashboard.'}
        </div>
      </div>
    );
  }

  const { school, stats, recent_complaints: recentComplaints, schoolAccount } = data;

  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl bg-background md:border-x md:border-border">
      <header className="border-b border-border px-5 py-6">
        {/* <p className="text-sm font-semibold uppercase tracking-wide text-primary">School dashboard</p> */}
        <h1 className="mt-2 text-3xl font-bold text-foreground">{school?.name ?? 'Assigned school'}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Monitor student complaints, resolution progress, and recent activity for your assigned school.
        </p>
        {!schoolAccount.verified_school && (
          <div className="mt-4 rounded-lg border border-primary/30 bg-secondary/70 p-4 text-sm text-muted-foreground">
            This school account is pending verification. You can review complaints, but official responses are read-only until `verifiedSchool` is set to true.
          </div>
        )}
      </header>

      <section className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total complaints" value={stats.total} Icon={Inbox} />
        <StatCard label="Unresolved" value={stats.unresolved} Icon={Clock3} />
        <StatCard label="Resolved" value={stats.resolved} Icon={CheckCircle2} />
        <StatCard label="Response rate" value={`${stats.response_rate}%`} Icon={TrendingUp} />
      </section>

      <section className="grid gap-4 px-5 pb-5 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-secondary/40 p-4">
          <p className="text-sm font-medium text-muted-foreground">Unresolved</p>
          <p className="mt-2 text-2xl font-bold">{stats.unresolved}</p>
        </div>
        <div className="rounded-lg border border-border bg-secondary/40 p-4">
          <p className="text-sm font-medium text-muted-foreground">Resolved</p>
          <p className="mt-2 text-2xl font-bold">{stats.resolved}</p>
        </div>
      </section>

      <section className="px-5 pb-8">
        <div className="rounded-lg border border-border bg-background shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-4 py-4">
            <div>
              <h2 className="font-semibold text-foreground">Recent complaints</h2>
              <p className="text-sm text-muted-foreground">Latest reports submitted to your school.</p>
            </div>
            <Link href="/school/complaints" className="text-sm font-semibold text-primary hover:underline">
              Manage all
            </Link>
          </div>

          {recentComplaints.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
              <AlertCircle className="mb-4 size-10 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">No complaints yet</h3>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                When students submit complaints to your school, the newest reports will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentComplaints.map((complaint: any) => (
                <Link
                  key={complaint.id}
                  href="/school/complaints"
                  className="block px-4 py-4 transition-colors hover:bg-secondary/50"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{complaint.title}</h3>
                      <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{complaint.content}</p>
                    </div>
                    <span className="w-fit rounded-md bg-secondary px-2 py-1 text-xs font-semibold text-primary">
                      {statusLabels[complaint.status] ?? complaint.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
