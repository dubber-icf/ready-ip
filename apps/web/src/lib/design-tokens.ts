/**
 * READY IP Design Tokens
 * Industrial precision design system
 *
 * NOTE: When approaching production, switch font-display from Orbitron to Eurostile Extended.
 */

export const tokens = {
  colors: {
    // Industrial base palette
    base: {
      bg: '#0A0E17',
      bgDeep: '#0F1420',
      panel: '#151B28',
      panelAlt: '#1A2233',
      panelHeader: '#1E2636',
      elevated: '#243044',
      border: '#334155',
      borderSubtle: '#1E293B',
    },
    // Text hierarchy
    text: {
      muted: '#475569',
      secondary: '#6B7280',
      body: '#94A3B8',
      primary: '#CBD5E1',
      heading: '#E2E8F0',
      bright: '#F1F5F9',
    },
    // Signal colours (industrial safety)
    signal: {
      red: '#EF4444',
      redDim: '#991B1B',
      amber: '#F59E0B',
      amberDim: '#92400E',
      green: '#22C55E',
      greenDim: '#166534',
      blue: '#3B82F6',
      blueDim: '#1E40AF',
    },
    // Metal gradient stops
    metal: {
      dark: '#374151',
      mid: '#6B7280',
      light: '#9CA3AF',
      bright: '#D1D5DB',
    },
    // Brand
    brand: {
      primary: '#F59E0B',
      secondary: '#3B82F6',
    },
  },

  // Typography
  fonts: {
    display: "'Orbitron', sans-serif",      // Industrial headers
    mono: "'JetBrains Mono', monospace",    // Data and labels
    body: "'Inter', sans-serif",           // Body text
  },

  // Spacing (based on 4px grid)
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },

  // Border radii (minimal for industrial feel)
  radii: {
    none: '0px',
    sm: '2px',
    md: '4px',
    lg: '6px',
  },

  // Industrial animation timing
  animation: {
    // Robotic arm placement: fast start, precise stop
    easeRobotic: 'cubic-bezier(0.22, 0.68, 0.35, 1.0)',
    // Conveyor belt: smooth acceleration/deceleration
    easeConveyor: 'cubic-bezier(0.4, 0.0, 0.2, 1.0)',
    // Spring physics for Framer Motion
    spring: {
      stiffness: 300,
      damping: 30,
      mass: 1.5,
    },
    // Durations
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    panel: '600ms',
  },

  // Shadows
  shadows: {
    panel: '0 0 0 1px rgba(51, 65, 85, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.03)',
    panelHover: '0 0 0 1px rgba(51, 65, 85, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 4px 12px rgba(0, 0, 0, 0.3)',
    bolt: 'inset 0 1px 2px rgba(0, 0, 0, 0.4), 0 1px 1px rgba(255, 255, 255, 0.05)',
    led: (color: string) => `0 0 6px ${color}, 0 0 12px ${color}`,
  },
} as const;

export type DesignTokens = typeof tokens;
