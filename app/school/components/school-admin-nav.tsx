'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Building2, ClipboardList, LogOut } from 'lucide-react';
import { logoutAction } from '@/app/actions/auth';

const navItems = [
  { href: '/school/dashboard', label: 'Dashboard', Icon: BarChart3 },
  { href: '/school/complaints', label: 'Complaints', Icon: ClipboardList },
];

export default function SchoolAdminNav({ schoolName }: { schoolName: string }) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-border bg-background px-5 py-6 shadow-sm md:flex md:flex-col">
      <Link href="/school/dashboard" className="mb-8 flex items-center gap-3 px-2">
       
        <div className="min-w-0">
          <p className="text-xl font-bold leading-none text-foreground">VoiceIt School</p>
          <p className="mt-1 truncate text-xs font-medium text-muted-foreground">{schoolName}</p>
        </div>
      </Link>

      <nav className="flex-1 space-y-1">
        {navItems.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');

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

      <form action={logoutAction}>
        <button
          type="submit"
          className="flex h-11 w-full items-center gap-3 rounded-md px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground"
        >
          <LogOut size={20} />
          Sign out
        </button>
      </form>
    </aside>
  );
}
