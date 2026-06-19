import type { Config } from 'tailwindcss';

// Original brand palette — black + electric lime. Locked because the
// Instagram post designs and brand identity are already built around
// this combo. Only the template/layout evolves over time; colours stay.
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:        '#0a0a0a',
        surface:   '#111111',
        'bg-card': '#111111',
        border:    '#1f1f1f',
        text:      '#e8e8e8',
        muted:     '#888888',
        accent:    '#c6ff00',  // electric lime — primary brand colour
        secondary: '#6366F1',  // indigo — links + secondary hover
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
