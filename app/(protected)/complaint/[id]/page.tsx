import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getComplaintByIdAction } from '@/app/actions/complaints';
import ComplaintDetailContent from './components/complaint-detail-content';
import { ArrowLeft } from 'lucide-react';

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
    <div className="mx-auto min-h-screen w-full max-w-3xl bg-background md:border-x md:border-border">
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 px-5 py-5 backdrop-blur">
        <a href="/feed" className="text-sm flex items-center text-muted-foreground hover:text-foreground mb-2 gap-1 block border w-fit rounded hover:bg-secondary/50 px-2 py-1">
         <ArrowLeft size={20} /> Back to Feed
        </a>
      </div>

      <ComplaintDetailContent complaint={complaint} />
    </div>
  );
}
