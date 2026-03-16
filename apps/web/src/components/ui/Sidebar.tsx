'use client';

import Image from 'next/image';
import { NavItem } from './NavItem';
import { StatusLED } from './StatusLED';

// SVG icons as simple components (avoiding icon library dependency for now)
const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="1" y="1" width="7" height="7" rx="1" />
    <rect x="10" y="1" width="7" height="4" rx="1" />
    <rect x="1" y="10" width="7" height="7" rx="1" />
    <rect x="10" y="7" width="7" height="10" rx="1" />
  </svg>
);

const ExplorerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="5" cy="5" r="2.5" />
    <circle cx="13" cy="5" r="2.5" />
    <circle cx="9" cy="14" r="2.5" />
    <line x1="7" y1="6" x2="11" y2="6" />
    <line x1="6.5" y1="7" x2="8" y2="12" />
    <line x1="11.5" y1="7" x2="10" y2="12" />
  </svg>
);

const PatentsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="1" width="12" height="16" rx="1" />
    <line x1="6" y1="5" x2="12" y2="5" />
    <line x1="6" y1="8" x2="12" y2="8" />
    <line x1="6" y1="11" x2="10" y2="11" />
    <circle cx="12" cy="13" r="2.5" />
    <line x1="14" y1="15" x2="16" y2="17" />
  </svg>
);

const RiskIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M9 1 L17 16 H1 Z" />
    <line x1="9" y1="6" x2="9" y2="11" />
    <circle cx="9" cy="13.5" r="0.5" fill="currentColor" />
  </svg>
);

const TableIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="1" y="1" width="16" height="16" rx="1" />
    <line x1="1" y1="6" x2="17" y2="6" />
    <line x1="1" y1="11" x2="17" y2="11" />
    <line x1="7" y1="1" x2="7" y2="17" />
  </svg>
);

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-56 bg-industrial-900 border-r border-industrial-600/30 flex flex-col z-40">
      {/* Logo area */}
      <div className="px-4 py-5 border-b border-industrial-600/30">
        <Image
          src="/logo.svg"
          alt="READY IP"
          width={180}
          height={32}
          priority
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        <NavItem href="/dashboard" icon={<DashboardIcon />} label="Dashboard" />
        <NavItem href="/explorer" icon={<ExplorerIcon />} label="Explorer" />
        <NavItem href="/patents" icon={<PatentsIcon />} label="Patents" />
        <NavItem href="/risk" icon={<RiskIcon />} label="Risk" />

        <div className="pt-4 pb-2 px-4">
          <div className="border-t border-industrial-600/30" />
        </div>

        <NavItem href="/data" icon={<TableIcon />} label="Data" />
      </nav>

      {/* System status footer */}
      <div className="px-4 py-3 border-t border-industrial-600/30">
        <div className="section-header mb-2">System Status</div>
        <div className="space-y-1.5">
          <StatusLED status="green" size="sm" label="API Online" />
          <StatusLED status="green" size="sm" label="Graph DB" />
          <StatusLED status="off" size="sm" label="Patent Feed" />
        </div>
      </div>
    </aside>
  );
}
