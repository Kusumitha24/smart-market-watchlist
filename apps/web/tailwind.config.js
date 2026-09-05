/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        groww: {
          bg: '#0b0e14',
          card: '#131924',
          cardHover: '#1c2433',
          border: '#232d3f',
          primary: '#00d09c',
          primaryHover: '#00b386',
          accent: '#00baf2',
          danger: '#ff5252',
          warning: '#ff9800',
          muted: '#8b949e',
        },
      },
    },
  },
  plugins: [],
};
