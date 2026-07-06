/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: { '2xl': '1280px' },
    },
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          50: '#eefdf3',
          100: '#d6f9e2',
          200: '#aef1c9',
          300: '#78e3a9',
          400: '#42cd85',
          500: '#1fb56a',
          600: '#149255',
          700: '#127447',
          800: '#125c3a',
          900: '#0f4b31',
          950: '#052a1b',
        },
        risk: {
          low: 'hsl(var(--risk-low))',
          moderate: 'hsl(var(--risk-moderate))',
          high: 'hsl(var(--risk-high))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 4px)',
        sm: 'calc(var(--radius) - 8px)',
        xl: 'calc(var(--radius) + 6px)',
        '2xl': 'calc(var(--radius) + 14px)',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(15, 75, 49, 0.10)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        glow: '0 0 0 1px rgba(31, 181, 106, 0.15), 0 8px 24px -4px rgba(31, 181, 106, 0.25)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        'accordion-down': { from: { height: 0 }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: 0 } },
        'fade-in': { from: { opacity: 0 }, to: { opacity: 1 } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.4s ease-out',
        float: 'float 5s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
