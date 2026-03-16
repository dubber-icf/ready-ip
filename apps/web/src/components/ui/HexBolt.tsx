'use client';

/**
 * HexBolt — decorative hex bolt SVG for panel corners.
 * Animates a screw-in rotation on mount.
 */

import { motion } from 'framer-motion';

interface HexBoltProps {
  size?: number;
  className?: string;
  delay?: number;
}

export function HexBolt({ size = 14, className = '', delay = 0 }: HexBoltProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial={{ rotate: 0, opacity: 0 }}
      animate={{ rotate: 180, opacity: 1 }}
      transition={{
        duration: 0.3,
        delay,
        ease: [0.22, 0.68, 0.35, 1.0],
      }}
    >
      {/* Outer hex */}
      <polygon
        points="12,1 21.5,6.5 21.5,17.5 12,23 2.5,17.5 2.5,6.5"
        fill="#1E2636"
        stroke="#4B5563"
        strokeWidth="1"
      />
      {/* Inner hex (socket) */}
      <polygon
        points="12,6 17,8.9 17,14.7 12,17.6 7,14.7 7,8.9"
        fill="#0F1420"
        stroke="#374151"
        strokeWidth="0.75"
      />
      {/* Centre dot */}
      <circle cx="12" cy="12" r="1.5" fill="#374151" />
    </motion.svg>
  );
}
