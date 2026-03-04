'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, GraduationCap, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  const navItems = [
    { href: '/feed', label: 'Feed', Icon: Home },
    { href: '/search', label: 'Search', Icon: Search },
    { href: '/schools', label: 'Schools', Icon: GraduationCap },
    { href: '/account', label: 'Account', Icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border h-16 flex items-center justify-around">
      {navItems.map(({ href, label, Icon }) => (
        <Link
          key={href}
          href={href}
          className={`flex flex-col items-center justify-center w-16 h-16 transition-colors ${isActive(href)
              ? 'text-foreground'
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
