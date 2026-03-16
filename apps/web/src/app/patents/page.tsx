'use client';

import { BoltedPanel, StatusLED } from '@/components/ui';

export default function PatentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-industrial-100 tracking-wide">
          Patent Intelligence
        </h1>
        <p className="text-industrial-400 text-sm mt-1">
          Search and analyse patent landscapes across multiple data sources
        </p>
      </div>

      {/* Search bar */}
      <BoltedPanel delay={0} header={false}>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search patents by technology, supplier, or CPC code..."
            className="flex-1 bg-industrial-900 border border-industrial-600/50 rounded-sm px-4 py-2.5
                       font-mono text-sm text-industrial-200 placeholder:text-industrial-500
                       focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/20
                       transition-colors duration-200"
          />
          <button className="px-6 py-2.5 bg-brand-primary text-industrial-950 font-display text-xs font-bold
                           uppercase tracking-industrial rounded-sm
                           hover:bg-brand-primary/90 transition-colors duration-200 ease-robotic">
            Search
          </button>
        </div>
        <div className="flex gap-4 mt-3">
          <StatusLED status="green" size="sm" label="Google Patents" />
          <StatusLED status="green" size="sm" label="IPScreener" />
          <StatusLED status="off" size="sm" label="WIPO" />
          <StatusLED status="off" size="sm" label="Lens.org" />
        </div>
      </BoltedPanel>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <BoltedPanel title="Search Results" delay={0.1} className="lg:col-span-2">
          <div className="h-96 flex items-center justify-center">
            <span className="data-label text-industrial-500">
              Patent search results will appear here
            </span>
          </div>
        </BoltedPanel>

        <BoltedPanel title="Filing Trends" delay={0.2}>
          <div className="h-96 flex items-center justify-center">
            <span className="data-label text-industrial-500">
              Patent timeline chart will render here
            </span>
          </div>
        </BoltedPanel>
      </div>
    </div>
  );
}
