import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        kai: {
          navy: '#1A1A2E',
          cyan: '#00D4FF',
          gray: '#F5F5F5',
          dark: '#111111',
          border: '#E5E5E5'
        }
      },
      boxShadow: {
        card: '0 18px 45px rgba(26, 26, 46, 0.08)'
      }
    }
  },
  plugins: []
};

export default config;
