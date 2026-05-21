'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bookmark, ClipboardList, GraduationCap, Home, PenLine, Search, User } from 'lucide-react';

const navItems = [
  { href: '/feed', label: 'Feed', Icon: Home },
  { href: '/search', label: 'Search', Icon: Search },
  { href: '/schools', label: 'Schools', Icon: GraduationCap },
  { href: '/my-complaints', label: 'My Complaints', Icon: ClipboardList },
  { href: '/bookmarks', label: 'Saved', Icon: Bookmark },
  { href: '/account', label: 'Account', Icon: User },
];

export default function SidebarNav() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-border bg-background/95 px-5 py-6 shadow-sm backdrop-blur md:flex md:flex-col">
      <Link href="/feed" className="mb-8 flex items-center gap-3 px-2" aria-label="VoiceIt feed">
        <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <GraduationCap size={22} />
        </span>
        <div>
          <p className="text-xl font-bold leading-none text-foreground">VoiceIt</p>
          <p className="mt-1 text-xs font-medium text-muted-foreground">Student feedback</p>
        </div>
      </Link>

      <Link
        href="/compose"
        className="mb-6 flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
      >
        <PenLine size={18} />
        New Complaint
      </Link>

      <nav className="space-y-1">
        {navItems.map(({ href, label, Icon }) => {
          const active = isActive(href);

          return (
            <Link
              key={href}
              href={href}
              className={`flex h-11 items-center gap-3 rounded-md px-3 text-sm font-semibold transition-colors ${
                active
                  ? 'bg-secondary text-primary'
                  : 'text-muted-foreground hover:bg-secondary/70 hover:text-foreground'
              }`}
            >
              <Icon size={20} className={active ? 'text-primary' : ''} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
