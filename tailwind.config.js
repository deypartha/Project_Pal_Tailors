/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#faf7f2',
          100: '#f3ece1',
          200: '#e6d8c3',
          300: '#d6c2a4',
          400: '#c2a580',
          500: '#a98a63',
          600: '#8c704f',
          700: '#6f5940',
          800: '#564733',
          900: '#3d3325',
        },
        charcoal: '#1c1917',
        blush: '#c98a8a',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 24px -8px rgba(86, 71, 51, 0.18)',
        card: '0 8px 40px -12px rgba(86, 71, 51, 0.22)',
        elevate: '0 20px 60px -20px rgba(28, 25, 23, 0.35)',
      },
    },
  },
  plugins: [],
};
