import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getComplaintByIdAction } from '@/app/actions/complaints';
import ComplaintDetailContent from './components/complaint-detail-content';

export const metadata: Metadata = {
  title: 'Complaint - VoiceIt',
  description: 'View complaint details and comments',
};

export default async function ComplaintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: complaint } = await getComplaintByIdAction(parseInt(id, 10));

  if (!complaint) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="sticky top-0 bg-background border-b border-border px-4 py-4 z-10">
        <a href="/feed" className="text-sm text-muted-foreground hover:text-foreground mb-2 block">
          ← Back to Feed
        </a>
      </div>

      <ComplaintDetailContent complaint={complaint} />
    </div>
  );
}
