import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sand:      '#F5EFE4',
        'sand-dark': '#EAE0CF',
        ink:       '#1A1610',
        'ink-light': '#4A4236',
        gold:      '#C4953A',
        'gold-light': '#E8C97A',
        cream:     '#FDFAF6',
        accent:    '#8B3A2A',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body:    ['DM Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        marquee:   'marquee 28s linear infinite',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        shimmer:   'shimmer 1.5s infinite',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
