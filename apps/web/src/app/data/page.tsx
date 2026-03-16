'use client';

import { BoltedPanel } from '@/components/ui';

export default function DataPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-industrial-100 tracking-wide">
          Data Table
        </h1>
        <p className="text-industrial-400 text-sm mt-1">
          Browse and filter suppliers, components, and materials
        </p>
      </div>

      <BoltedPanel title="Supply Chain Data" delay={0}>
        <div className="h-[calc(100vh-260px)] flex items-center justify-center">
          <span className="data-label text-industrial-500">
            Paginated, filterable data table will render here
          </span>
        </div>
      </BoltedPanel>
    </div>
  );
}
