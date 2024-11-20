import type { Config } from 'tailwindcss'

export default {
  content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}', './src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        success: '#20BB57',
        warning: '#FDD601',
        error: '#F31260',
        primary: '#CC0000',
        secondary: '#009ee0',
        tertiary: '#CC0000',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      boxShadow: {
        'table-row': '0 4px 8px rgba(0, 0, 0, 0.1)', // Define o valor da sombra
      },
    },
    keyframes: {
      slideDown: {
        from: { height: '0px' },
        to: { height: 'var(--radix-accordion-content-height)' },
      },
      slideUp: {
        from: { height: 'var(--radix-accordion-content-height)' },
        to: { height: '0px' },
      },
    },
    animation: {
      slideDown: 'slideDown 300ms cubic-bezier(0.87, 0, 0.13, 1)',
      slideUp: 'slideUp 300ms cubic-bezier(0.87, 0, 0.13, 1)',
    },
  },
  plugins: [],
} satisfies Config
