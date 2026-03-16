'use client';

/**
 * HazardAlert — industrial warning/alert component.
 * Features diagonal hazard stripes and mechanical slide-in animation.
 */

import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type AlertSeverity = 'critical' | 'warning' | 'info';

interface HazardAlertProps {
  children: ReactNode;
  severity: AlertSeverity;
  title?: string;
  visible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const severityConfig: Record<AlertSeverity, {
  border: string;
  bg: string;
  icon: string;
  titleColor: string;
  stripe: boolean;
}> = {
  critical: {
    border: 'border-signal-red/60',
    bg: 'bg-signal-red/5',
    icon: '⬥',
    titleColor: 'text-signal-red',
    stripe: true,
  },
  warning: {
    border: 'border-signal-amber/60',
    bg: 'bg-signal-amber/5',
    icon: '⬥',
    titleColor: 'text-signal-amber',
    stripe: true,
  },
  info: {
    border: 'border-signal-blue/40',
    bg: 'bg-signal-blue/5',
    icon: '●',
    titleColor: 'text-signal-blue',
    stripe: false,
  },
};

export function HazardAlert({
  children,
  severity,
  title,
  visible = true,
  onDismiss,
  className = '',
}: HazardAlertProps) {
  const config = severityConfig[severity];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`relative overflow-hidden rounded-sm ${className}`}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            mass: 1.5,
          }}
        >
          {/* Hazard stripe accent (left edge) */}
          {config.stripe && (
            <div
              className="absolute left-0 top-0 bottom-0 w-1.5"
              style={{
                background: severity === 'critical'
                  ? 'repeating-linear-gradient(-45deg, #EF4444, #EF4444 3px, #0A0E17 3px, #0A0E17 6px)'
                  : 'repeating-linear-gradient(-45deg, #F59E0B, #F59E0B 3px, #0A0E17 3px, #0A0E17 6px)',
              }}
            />
          )}

          {/* Alert body */}
          <div className={`
            ${config.bg} ${config.border} border
            ${config.stripe ? 'pl-5' : 'pl-4'} pr-4 py-3
          `}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                {title && (
                  <div className={`flex items-center gap-2 mb-1 ${config.titleColor}`}>
                    <span className="text-xs">{config.icon}</span>
                    <span className="font-display text-xs font-semibold uppercase tracking-industrial">
                      {title}
                    </span>
                  </div>
                )}
                <div className="text-sm text-industrial-300">
                  {children}
                </div>
              </div>
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="text-industrial-500 hover:text-industrial-300 transition-colors text-sm font-mono"
                  aria-label="Dismiss alert"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
