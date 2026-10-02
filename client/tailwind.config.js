/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  // accent-* classes are built dynamically from JSON (accent-${project.accent}), so keep them all.
  safelist: ['accent-violet', 'accent-cyan', 'accent-emerald', 'accent-orange', 'accent-pink', 'accent-blue'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        name: ['"Outfit"', '"Syne"', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: {
          950: '#05060a',
          900: '#090b12',
          800: '#0f1220',
          700: '#171b2c',
          600: '#222841',
          500: '#2f3654',
        },
        violet: { DEFAULT: '#8b5cf6', soft: '#c4b5fd' },
        cyan: { DEFAULT: '#22d3ee', soft: '#a5f3fc' },
        lime: { DEFAULT: '#a3e635' },
      },
      boxShadow: {
        glow: '0 0 60px -10px rgba(139,92,246,.5)',
        'glow-cyan': '0 0 60px -10px rgba(34,211,238,.45)',
        card: '0 30px 80px -30px rgba(0,0,0,.8)',
      },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        spinSlow: { to: { transform: 'rotate(360deg)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-14px)' } },
        pulseGlow: { '0%,100%': { opacity: 0.35 }, '50%': { opacity: 0.7 } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        blob: {
          '0%,100%': { transform: 'translate(0,0) scale(1)' },
          '33%': { transform: 'translate(40px,-60px) scale(1.1)' },
          '66%': { transform: 'translate(-30px,30px) scale(.95)' },
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        spinSlow: 'spinSlow 28s linear infinite',
        float: 'float 6s ease-in-out infinite',
        pulseGlow: 'pulseGlow 4s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
        blob: 'blob 18s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
