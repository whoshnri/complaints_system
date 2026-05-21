import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getSchoolComplaintDetailAction, createAdminResponseAction } from '@/app/actions/school-admin';
import SchoolComplaintResponseForm from './school-complaint-response-form';

const statusLabels: Record<string, string> = {
  unresolved: 'Unresolved',
  resolved: 'Resolved',
};

export default async function SchoolComplaintDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const complaintId = Number(id);
  const { data, error } = await getSchoolComplaintDetailAction(complaintId);

  if (!data && !error) {
    notFound();
  }

  if (error || !data) {
    return (
      <div className="mx-auto min-h-screen w-full max-w-4xl bg-background p-6 md:border-x md:border-border">
        <Link href="/school/complaints" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
          <ArrowLeft size={16} />
          Back to complaints
        </Link>
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-5 text-sm text-destructive">
          {error ?? 'Complaint not found.'}
        </div>
      </div>
    );
  }

  const { complaint, comments, schoolAccount } = data;
  const officialReplies = comments.filter((comment: any) => comment.is_admin_reply);

  return (
    <div className="mx-auto min-h-screen w-full max-w-4xl bg-background md:border-x md:border-border">
      <header className="border-b border-border px-5 py-5">
        <Link href="/school/complaints" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
          <ArrowLeft size={16} />
          Back to complaints
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-secondary px-2 py-1 text-xs font-semibold text-primary">
            {statusLabels[complaint.status] ?? complaint.status}
          </span>
          {complaint.category && (
            <span className="rounded-md border border-border px-2 py-1 text-xs font-semibold text-muted-foreground">
              {complaint.category}
            </span>
          )}
        </div>
        <h1 className="mt-4 text-3xl font-bold text-foreground">{complaint.title}</h1>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{complaint.content}</p>
      </header>

      <section className="border-b border-border p-5">
        <h2 className="text-lg font-semibold text-foreground">Official response</h2>
        {!schoolAccount.verified_school && (
          <div className="mt-3 rounded-lg border border-primary/30 bg-secondary/60 p-4 text-sm text-muted-foreground">
            Your school account is pending verification. This page is read-only until `verifiedSchool` is true.
          </div>
        )}
        {schoolAccount.verified_school && (
          <SchoolComplaintResponseForm
            complaintId={complaint.id}
            createResponseAction={createAdminResponseAction}
          />
        )}
      </section>

      <section className="p-5">
        <h2 className="text-lg font-semibold text-foreground">Previous official replies</h2>
        {officialReplies.length === 0 ? (
          <p className="mt-3 rounded-lg border border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
            No official response has been posted yet.
          </p>
        ) : (
          <div className="mt-3 divide-y divide-border rounded-lg border border-border">
            {officialReplies.map((comment: any) => (
              <article key={comment.id} className="p-4">
                <p className="whitespace-pre-wrap text-sm text-foreground">{comment.content}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {comment.username ?? 'School account'} · {new Date(comment.created_at).toLocaleDateString()}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
