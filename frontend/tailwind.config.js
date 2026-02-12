/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.5rem',
        sm: '2rem',
        lg: '3rem',
        xl: '4rem',
      },
      screens: {
        '2xl': '1280px',
      },
    },
    extend: {
      colors: {
        brand: {
          navy: '#0f1b3d',
          midnight: '#08102a',
          sky: '#38bdf8',
          teal: '#14b8a6',
          lime: '#bef264',
          blush: '#fef3f2',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 40px 80px -40px rgba(8,16,42,0.5)',
        soft: '0 20px 40px -24px rgba(15,27,61,0.45)',
      },
      dropShadow: {
        glow: '0 0 20px rgba(56,189,248,0.45)',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        slideUp: 'slideUp 0.3s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      backgroundImage: {
        'hero-grid':
          'radial-gradient(circle at top, rgba(20,184,166,0.2), transparent 55%), radial-gradient(circle at bottom, rgba(56,189,248,0.15), transparent 55%)',
      },
      borderRadius: {
        '3xl': '1.75rem',
      },
      spacing: {
        18: '4.5rem',
      },
    },
  },
  plugins: [],
}
