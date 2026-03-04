'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function FloatingCompose() {
  return (
    <Link
      href="/compose"
      className="fixed bottom-24 right-6 w-14 h-14 bg-foreground text-primary-foreground rounded flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
      aria-label="Compose new complaint"
    >
      <Plus size={24} />
    </Link>
  );
}
