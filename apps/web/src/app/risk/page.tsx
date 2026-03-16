'use client';

import { BoltedPanel, StatusLED, HazardAlert } from '@/components/ui';

export default function RiskPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-industrial-100 tracking-wide">
          Risk Assessment
        </h1>
        <p className="text-industrial-400 text-sm mt-1">
          Composite risk scores, threat monitoring, and alternative supplier recommendations
        </p>
      </div>

      <HazardAlert severity="critical" title="Critical Risk">
        NXP Semiconductors (Netherlands) is the sole supplier for 3 tier-2 components.
        Patent filing rate has declined 34% over 24 months. 2 alternative suppliers identified.
      </HazardAlert>

      {/* Risk overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BoltedPanel title="Critical" delay={0}>
          <div className="flex items-center gap-3">
            <StatusLED status="red" size="lg" pulse />
            <span className="font-display text-4xl font-bold text-signal-red">1</span>
          </div>
        </BoltedPanel>

        <BoltedPanel title="Warning" delay={0.1}>
          <div className="flex items-center gap-3">
            <StatusLED status="amber" size="lg" pulse />
            <span className="font-display text-4xl font-bold text-signal-amber">5</span>
          </div>
        </BoltedPanel>

        <BoltedPanel title="Monitored" delay={0.2}>
          <div className="flex items-center gap-3">
            <StatusLED status="blue" size="lg" />
            <span className="font-display text-4xl font-bold text-signal-blue">12</span>
          </div>
        </BoltedPanel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BoltedPanel title="Risk Heat Map" delay={0.3}>
          <div className="h-80 flex items-center justify-center">
            <span className="data-label text-industrial-500">
              Component x Risk dimension heatmap will render here
            </span>
          </div>
        </BoltedPanel>

        <BoltedPanel title="Alternative Suppliers" delay={0.4}>
          <div className="h-80 flex items-center justify-center">
            <span className="data-label text-industrial-500">
              Patent-based alternative supplier recommendations will appear here
            </span>
          </div>
        </BoltedPanel>
      </div>
    </div>
  );
}
