'use client';

/**
 * IrisLoader — mechanical iris/shutter loading animation.
 * Radial segments rotate open to reveal content beneath.
 */

import { motion, AnimatePresence } from 'framer-motion';

interface IrisLoaderProps {
  loading: boolean;
  className?: string;
}

const SEGMENTS = 8;
const SEGMENT_ANGLE = 360 / SEGMENTS;

export function IrisLoader({ loading, className = '' }: IrisLoaderProps) {
  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className={`absolute inset-0 z-50 flex items-center justify-center bg-industrial-950/80 backdrop-blur-sm ${className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative w-24 h-24">
            {/* Iris segments */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              {Array.from({ length: SEGMENTS }).map((_, i) => {
                const startAngle = i * SEGMENT_ANGLE;
                const endAngle = startAngle + SEGMENT_ANGLE;
                const startRad = (startAngle * Math.PI) / 180;
                const endRad = (endAngle * Math.PI) / 180;

                const outerRadius = 48;
                const innerRadius = 12;

                const x1 = 50 + outerRadius * Math.cos(startRad);
                const y1 = 50 + outerRadius * Math.sin(startRad);
                const x2 = 50 + outerRadius * Math.cos(endRad);
                const y2 = 50 + outerRadius * Math.sin(endRad);
                const x3 = 50 + innerRadius * Math.cos(endRad);
                const y3 = 50 + innerRadius * Math.sin(endRad);
                const x4 = 50 + innerRadius * Math.cos(startRad);
                const y4 = 50 + innerRadius * Math.sin(startRad);

                const d = `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 0 0 ${x4} ${y4} Z`;

                return (
                  <motion.path
                    key={i}
                    d={d}
                    fill={i % 2 === 0 ? '#1E2636' : '#243044'}
                    stroke="#334155"
                    strokeWidth="0.5"
                    initial={{ opacity: 1 }}
                    animate={{
                      rotate: [0, SEGMENT_ANGLE / 2, 0],
                      opacity: [1, 0.7, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.08,
                      ease: [0.4, 0.0, 0.2, 1.0],
                    }}
                    style={{ transformOrigin: '50px 50px' }}
                  />
                );
              })}

              {/* Centre bolt */}
              <motion.circle
                cx="50"
                cy="50"
                r="6"
                fill="#151B28"
                stroke="#4B5563"
                strokeWidth="1"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{ transformOrigin: '50px 50px' }}
              />
              <circle cx="50" cy="50" r="2" fill="#374151" />
            </svg>

            {/* Loading text */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className="data-label text-industrial-500">PROCESSING</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
