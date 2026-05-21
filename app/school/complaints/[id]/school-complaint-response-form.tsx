'use client';

import { useState } from 'react';

type ResponseAction = (complaintId: number, content: string) => Promise<{ data: any; error: string | null }>;

export default function SchoolComplaintResponseForm({
  complaintId,
  createResponseAction,
}: {
  complaintId: number;
  createResponseAction: ResponseAction;
}) {
  const [content, setContent] = useState('');
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submitResponse() {
    setPending(true);
    setMessage(null);

    const result = await createResponseAction(complaintId, content);
    if (result.error) {
      setMessage(result.error);
    } else {
      setContent('');
      setMessage('Official response posted.');
    }

    setPending(false);
  }

  return (
    <div className="mt-4">
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Write an official school response..."
        className="h-36 w-full resize-none rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
      />
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          The school can respond here, but only the student who submitted the complaint can change its resolved status.
        </p>
        <button
          type="button"
          disabled={pending || content.trim().length === 0}
          onClick={submitResponse}
          className="shrink-0 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? 'Posting...' : 'Post response'}
        </button>
      </div>
      {message && <p className="mt-3 text-sm font-medium text-muted-foreground">{message}</p>}
    </div>
  );
}
