'use client';

import { BoltedPanel, StatusLED, HazardAlert } from '@/components/ui';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-industrial-100 tracking-wide">
          Dashboard
        </h1>
        <p className="text-industrial-400 text-sm mt-1">
          Supply chain intelligence overview
        </p>
      </div>

      {/* Alert demo */}
      <HazardAlert severity="warning" title="Demo Mode">
        READY IP is running with sample automotive data. Connect to live patent sources to begin real analysis.
      </HazardAlert>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <BoltedPanel title="Suppliers" delay={0}>
          <div className="flex items-baseline justify-between">
            <span className="font-display text-3xl font-bold text-industrial-50">47</span>
            <StatusLED status="green" label="Tracked" />
          </div>
        </BoltedPanel>

        <BoltedPanel title="Components" delay={0.1}>
          <div className="flex items-baseline justify-between">
            <span className="font-display text-3xl font-bold text-industrial-50">128</span>
            <span className="data-label">6 Tiers</span>
          </div>
        </BoltedPanel>

        <BoltedPanel title="Patents Indexed" delay={0.2}>
          <div className="flex items-baseline justify-between">
            <span className="font-display text-3xl font-bold text-brand-primary">2,341</span>
            <StatusLED status="blue" label="Scanning" pulse />
          </div>
        </BoltedPanel>

        <BoltedPanel title="Risk Alerts" delay={0.3}>
          <div className="flex items-baseline justify-between">
            <span className="font-display text-3xl font-bold text-signal-red">3</span>
            <StatusLED status="red" label="Active" pulse />
          </div>
        </BoltedPanel>
      </div>

      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <BoltedPanel title="Innovation Scores" delay={0.4} className="lg:col-span-2">
          <div className="h-64 flex items-center justify-center">
            <span className="data-label text-industrial-500">
              Innovation score chart will render here
            </span>
          </div>
        </BoltedPanel>

        <BoltedPanel title="Recent Alerts" delay={0.5}>
          <div className="space-y-3">
            {[
              { supplier: 'ArcelorMittal', issue: 'Patent filing rate declining', severity: 'amber' as const },
              { supplier: 'NXP Semiconductors', issue: 'Single-source dependency', severity: 'red' as const },
              { supplier: 'Toray Industries', issue: 'Geographic concentration risk', severity: 'amber' as const },
            ].map((alert, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-industrial-600/20 last:border-0">
                <StatusLED status={alert.severity} size="sm" />
                <div>
                  <div className="font-mono text-xs font-medium text-industrial-200">
                    {alert.supplier}
                  </div>
                  <div className="text-xs text-industrial-400 mt-0.5">
                    {alert.issue}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </BoltedPanel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BoltedPanel title="Supply Chain Coverage" delay={0.6}>
          <div className="h-48 flex items-center justify-center">
            <span className="data-label text-industrial-500">
              Geographic map will render here
            </span>
          </div>
        </BoltedPanel>

        <BoltedPanel title="Technology Maturity" delay={0.7}>
          <div className="h-48 flex items-center justify-center">
            <span className="data-label text-industrial-500">
              Technology maturity heatmap will render here
            </span>
          </div>
        </BoltedPanel>
      </div>
    </div>
  );
}
