'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, GraduationCap, ClipboardList, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  const navItems = [
    { href: '/feed', label: 'Feed', Icon: Home },
    { href: '/search', label: 'Search', Icon: Search },
    { href: '/schools', label: 'Schools', Icon: GraduationCap },
    { href: '/my-complaints', label: 'Mine', Icon: ClipboardList },
    { href: '/account', label: 'Account', Icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-border bg-background md:hidden">
      {navItems.map(({ href, label, Icon }) => (
        <Link
          key={href}
          href={href}
          className={`flex h-16 w-16 flex-col items-center justify-center transition-colors ${isActive(href)
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
            }`}
        >
          <Icon size={24} />
          <span className="text-xs mt-1">{label}</span>
        </Link>
      ))}
    </nav>
  );
}
