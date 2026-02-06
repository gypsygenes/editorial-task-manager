/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* Semantic background tokens */
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        tertiary: 'rgb(var(--color-tertiary) / <alpha-value>)',
        'card-bg': 'rgb(var(--color-card-bg) / <alpha-value>)',

        /* Semantic text tokens */
        'text-primary': 'rgb(var(--color-text-primary) / <alpha-value>)',
        'text-secondary': 'rgb(var(--color-text-secondary) / <alpha-value>)',
        'text-muted': 'rgb(var(--color-text-muted) / <alpha-value>)',
        'text-hint': 'rgb(var(--color-text-hint) / <alpha-value>)',
        'text-ghost': 'rgb(var(--color-text-ghost) / <alpha-value>)',

        /* Card text tokens */
        'card-text': 'rgb(var(--color-card-text) / <alpha-value>)',
        'card-text-secondary': 'rgb(var(--color-card-text-secondary) / <alpha-value>)',
        'card-text-muted': 'rgb(var(--color-card-text-muted) / <alpha-value>)',
        'card-text-hint': 'rgb(var(--color-card-text-hint) / <alpha-value>)',

        /* Border & overlay tokens */
        border: 'rgb(var(--color-border) / <alpha-value>)',
        'border-subtle': 'rgb(var(--color-border-subtle) / <alpha-value>)',
        overlay: 'rgb(var(--color-overlay) / <alpha-value>)',

        /* Accent tokens */
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        'accent-hover': 'rgb(var(--color-accent-hover) / <alpha-value>)',
        'accent-muted': 'rgb(var(--color-accent-muted) / <alpha-value>)',
        'accent-focus': 'rgb(var(--color-accent-focus) / <alpha-value>)',

        /* Fixed status colors (not theme-dependent) */
        sage: '#7a9e7e',
        'sage-light': '#8fb893',
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-out-right': 'slideOutRight 0.3s ease-in',
        'fade-in': 'fadeIn 0.2s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      boxShadow: {
        'editorial': 'var(--shadow-editorial)',
        'editorial-hover': 'var(--shadow-editorial-hover)',
        'editorial-lg': 'var(--shadow-editorial-lg)',
      },
    },
  },
  plugins: [],
}
