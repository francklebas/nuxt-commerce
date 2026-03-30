import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/components/**/*.{vue,js,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/plugins/**/*.{js,ts}',
    './app/app.vue'
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: 'var(--cream-50)'
        },
        sand: {
          100: 'var(--sand-100)'
        },
        clay: {
          500: 'var(--clay-500)',
          700: 'var(--clay-700)'
        },
        ink: {
          900: 'var(--ink-900)'
        }
      },
      boxShadow: {
        soft: '0 22px 45px -22px rgba(56, 34, 18, 0.38)'
      }
    }
  },
  plugins: []
} satisfies Config
