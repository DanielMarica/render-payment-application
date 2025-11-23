import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff5f5',
          100: '#ffe3e3',
          200: '#ffc9c9',
          300: '#ffa8a8',
          400: '#ff8787',
          500: '#ff6b6b',
          600: '#fa5252',
          700: '#f03e3e',
          800: '#e03131',
          900: '#c92a2a',
        },
        secondary: {
          50: '#e6fcfa',
          100: '#c3f7f2',
          200: '#9df0e8',
          300: '#76e7dc',
          400: '#54ddd0',
          500: '#4ecdc4',
          600: '#3bb8af',
          700: '#2a9d95',
          800: '#1e7d77',
          900: '#155e5b',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
