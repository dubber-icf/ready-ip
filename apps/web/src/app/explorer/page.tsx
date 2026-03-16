'use client';

import { BoltedPanel } from '@/components/ui';

export default function ExplorerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-industrial-100 tracking-wide">
          Supply Chain Explorer
        </h1>
        <p className="text-industrial-400 text-sm mt-1">
          Interactive knowledge graph of suppliers, components, and patent relationships
        </p>
      </div>

      <BoltedPanel title="Knowledge Graph" delay={0}>
        <div className="h-[calc(100vh-220px)] flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="font-display text-lg text-industrial-500">
              SIGMA.JS GRAPH
            </div>
            <p className="data-label text-industrial-500 max-w-md">
              Interactive knowledge graph will render here. Nodes represent suppliers,
              components, materials, and patents. Click to explore relationships.
            </p>
          </div>
        </div>
      </BoltedPanel>
    </div>
  );
}
