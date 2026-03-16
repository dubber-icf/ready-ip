import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Industrial base palette
        industrial: {
          950: '#0A0E17',  // Near-black background
          900: '#0F1420',  // Deep background
          850: '#151B28',  // Panel background
          800: '#1A2233',  // Panel background alt
          750: '#1E2636',  // Panel header
          700: '#243044',  // Elevated surfaces
          600: '#334155',  // Borders
          500: '#475569',  // Muted text
          400: '#6B7280',  // Secondary text
          300: '#94A3B8',  // Body text
          200: '#CBD5E1',  // Primary text
          100: '#E2E8F0',  // Headings
          50:  '#F1F5F9',  // Bright text
        },
        // Signal colours (industrial safety palette)
        signal: {
          red:    '#EF4444',  // Critical / danger
          amber:  '#F59E0B',  // Warning / caution
          green:  '#22C55E',  // Operational / healthy
          blue:   '#3B82F6',  // Data / information
        },
        // Metal gradient stops
        metal: {
          dark:   '#374151',
          mid:    '#6B7280',
          light:  '#9CA3AF',
          bright: '#D1D5DB',
        },
        // Brand
        brand: {
          primary: '#F59E0B',   // Safety amber
          secondary: '#3B82F6', // Cool blue
        },
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],     // Industrial headers (swap to Eurostile for production)
        mono: ['JetBrains Mono', 'monospace'],   // Data and labels
        body: ['Inter', 'sans-serif'],           // Body text
      },
      letterSpacing: {
        industrial: '0.15em',  // Wide tracking for section headers
      },
      boxShadow: {
        'panel': '0 0 0 1px rgba(51, 65, 85, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.03)',
        'panel-hover': '0 0 0 1px rgba(51, 65, 85, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 4px 12px rgba(0, 0, 0, 0.3)',
        'bolt': 'inset 0 1px 2px rgba(0, 0, 0, 0.4), 0 1px 1px rgba(255, 255, 255, 0.05)',
        'led': '0 0 6px currentColor, 0 0 12px currentColor',
      },
      backgroundImage: {
        'carbon': 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)',
        'diamond-plate': 'linear-gradient(135deg, rgba(255,255,255,0.02) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.02) 75%, transparent 75%)',
        'hazard': 'repeating-linear-gradient(-45deg, #F59E0B, #F59E0B 10px, #0A0E17 10px, #0A0E17 20px)',
        'metal-gradient': 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)',
      },
      animation: {
        'bolt-screw': 'boltScrew 0.3s cubic-bezier(0.22, 0.68, 0.35, 1.0) forwards',
        'iris-open': 'irisOpen 0.4s cubic-bezier(0.4, 0.0, 0.2, 1.0) forwards',
        'led-pulse': 'ledPulse 2s ease-in-out infinite',
        'panel-settle': 'panelSettle 0.5s cubic-bezier(0.22, 0.68, 0.35, 1.0) forwards',
      },
      keyframes: {
        boltScrew: {
          '0%': { transform: 'rotate(0deg)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'rotate(180deg)', opacity: '1' },
        },
        irisOpen: {
          '0%': { clipPath: 'circle(0% at 50% 50%)' },
          '100%': { clipPath: 'circle(75% at 50% 50%)' },
        },
        ledPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        panelSettle: {
          '0%': { transform: 'translateY(20px) rotate(1.5deg)', opacity: '0' },
          '70%': { transform: 'translateY(-3px) rotate(-0.5deg)', opacity: '1' },
          '100%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
