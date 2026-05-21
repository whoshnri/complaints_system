import Link from 'next/link';
import { ClipboardList, Plus } from 'lucide-react';
import { getMyComplaintsAction } from '@/app/actions/complaints';

const statusLabels: Record<string, string> = {
  unresolved: 'Unresolved',
  resolved: 'Resolved',
};

export default async function MyComplaintsPage() {
  const { data: complaints, error } = await getMyComplaintsAction();

  return (
    <div className="mx-auto min-h-screen w-full max-w-4xl bg-background md:border-x md:border-border">
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 px-5 py-5 backdrop-blur">
        <h1 className="text-2xl font-bold text-foreground">My submitted complaints</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track the complaints you posted and update their resolution status.
        </p>
      </div>

      {error ? (
        <div className="p-5">
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-5 text-sm text-destructive">
            {error}
          </div>
        </div>
      ) : complaints.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
          <div className="mb-5 flex size-14 items-center justify-center rounded-lg bg-secondary text-primary">
            <ClipboardList size={28} />
          </div>
          <h2 className="text-lg font-semibold text-foreground">You have not submitted a complaint yet</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            When you raise a complaint, it will appear here so you can monitor its progress and mark it resolved.
          </p>
          <Link
            href="/compose"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            <Plus size={16} />
            Submit complaint
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {complaints.map((complaint: any) => (
            <Link
              key={complaint.id}
              href={`/complaint/${complaint.id}`}
              className="block px-5 py-4 transition-colors hover:bg-secondary/50"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="font-semibold text-foreground">{complaint.title}</h2>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{complaint.content}</p>
                  <p className="mt-2 text-xs font-medium text-muted-foreground">{complaint.school_name}</p>
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
  );
}
