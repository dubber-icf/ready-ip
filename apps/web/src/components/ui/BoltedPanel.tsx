'use client';

/**
 * BoltedPanel — industrial card component with hex bolt decorations at corners.
 * Animates into position with a mechanical settle motion.
 */

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { HexBolt } from './HexBolt';

interface BoltedPanelProps {
  children: ReactNode;
  title?: string;
  className?: string;
  /** Stagger delay for entrance animation (seconds) */
  delay?: number;
  /** Whether to show the metallic header bar */
  header?: boolean;
}

export function BoltedPanel({
  children,
  title,
  className = '',
  delay = 0,
  header = true,
}: BoltedPanelProps) {
  return (
    <motion.div
      className={`
        relative
        bg-industrial-850
        border border-industrial-600/50
        rounded-sm
        shadow-panel
        overflow-hidden
        transition-shadow duration-300 ease-robotic
        hover:shadow-panel-hover
        ${className}
      `}
      initial={{ y: 20, rotate: 1.5, opacity: 0 }}
      animate={{ y: 0, rotate: 0, opacity: 1 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.22, 0.68, 0.35, 1.0],
      }}
    >
      {/* Corner bolts */}
      <div className="absolute top-1.5 left-1.5 z-10">
        <HexBolt delay={delay + 0.3} />
      </div>
      <div className="absolute top-1.5 right-1.5 z-10">
        <HexBolt delay={delay + 0.35} />
      </div>
      <div className="absolute bottom-1.5 left-1.5 z-10">
        <HexBolt delay={delay + 0.4} />
      </div>
      <div className="absolute bottom-1.5 right-1.5 z-10">
        <HexBolt delay={delay + 0.45} />
      </div>

      {/* Header bar with metallic gradient */}
      {header && title && (
        <div className="relative bg-industrial-750 border-b border-industrial-600/50 px-6 py-3 metal-sheen">
          <h3 className="section-header">{title}</h3>
        </div>
      )}

      {/* Content */}
      <div className="relative px-6 py-4">
        {children}
      </div>
    </motion.div>
  );
}
