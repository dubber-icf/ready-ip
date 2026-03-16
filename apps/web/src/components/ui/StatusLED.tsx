'use client';

/**
 * StatusLED — chunky LED-style status indicator.
 * Resembles machine status panels on factory equipment.
 */

type LEDStatus = 'green' | 'amber' | 'red' | 'blue' | 'off';

interface StatusLEDProps {
  status: LEDStatus;
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  label?: string;
  className?: string;
}

const statusColors: Record<LEDStatus, { bg: string; glow: string; ring: string }> = {
  green: {
    bg: 'bg-signal-green',
    glow: 'shadow-[0_0_6px_#22C55E,0_0_12px_#22C55E]',
    ring: 'ring-signal-green/30',
  },
  amber: {
    bg: 'bg-signal-amber',
    glow: 'shadow-[0_0_6px_#F59E0B,0_0_12px_#F59E0B]',
    ring: 'ring-signal-amber/30',
  },
  red: {
    bg: 'bg-signal-red',
    glow: 'shadow-[0_0_6px_#EF4444,0_0_12px_#EF4444]',
    ring: 'ring-signal-red/30',
  },
  blue: {
    bg: 'bg-signal-blue',
    glow: 'shadow-[0_0_6px_#3B82F6,0_0_12px_#3B82F6]',
    ring: 'ring-signal-blue/30',
  },
  off: {
    bg: 'bg-industrial-700',
    glow: '',
    ring: 'ring-industrial-600/30',
  },
};

const sizeClasses: Record<string, string> = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4',
};

export function StatusLED({
  status,
  size = 'md',
  pulse = false,
  label,
  className = '',
}: StatusLEDProps) {
  const colors = statusColors[status];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* LED housing (dark ring) */}
        <div className={`
          ${sizeClasses[size]}
          rounded-full
          ${colors.bg}
          ${colors.glow}
          ring-2 ${colors.ring}
          ${pulse && status !== 'off' ? 'animate-led-pulse' : ''}
        `} />
      </div>
      {label && (
        <span className="data-label">{label}</span>
      )}
    </div>
  );
}
