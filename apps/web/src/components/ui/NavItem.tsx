'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface NavItemProps {
  href: string;
  icon: ReactNode;
  label: string;
}

export function NavItem({ href, icon, label }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + '/');

  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 px-4 py-2.5 rounded-sm
        transition-all duration-200 ease-robotic
        group relative
        ${isActive
          ? 'bg-industrial-750 text-brand-primary'
          : 'text-industrial-400 hover:text-industrial-200 hover:bg-industrial-850'
        }
      `}
    >
      {/* Active indicator bar */}
      {isActive && (
        <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-brand-primary rounded-full" />
      )}
      <span className={`text-lg ${isActive ? 'text-brand-primary' : 'text-industrial-500 group-hover:text-industrial-300'}`}>
        {icon}
      </span>
      <span className="font-mono text-xs font-medium uppercase tracking-wider">
        {label}
      </span>
    </Link>
  );
}
