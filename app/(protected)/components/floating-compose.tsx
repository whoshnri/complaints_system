'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function FloatingCompose() {
  return (
    <Link
      href="/compose"
      className="fixed bottom-24 right-6 z-40 flex size-14 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-lg transition-shadow hover:shadow-xl md:hidden"
      aria-label="Compose new complaint"
    >
      <Plus size={24} />
    </Link>
  );
}
