import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:       '#152038',
        surface:  '#1C2B4A',
        border:   '#2E4270',
        gold:     '#F59E0B',
        'electric-blue': '#3B82F6',
        'off-white':     '#F0F4FF',
        'muted-slate':   '#7B93C4',
        'deep-navy':     '#0C2340',
        'deep-blue':     '#185FA5',
      },
      fontFamily: {
        sans: ['IBM Plex Sans', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      letterSpacing: {
        tight:  '-0.02em',
        widest: '0.12em',
      },
    },
  },
  plugins: [],
}

export default config
