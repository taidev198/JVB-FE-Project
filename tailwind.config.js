/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './layouts/**/*.{js,ts,jsx,tsx}',
    './node_modules/flowbite/**/*.js',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        xs: { max: '450px' },
        xm: { min: '451px', max: '639px' },
      },
      colors: {
        dark: {},
        primary: {
          main: '#34a853',
          black: '#0b0d28',
          gray: '#7D8087',
          white: '#ffffff',
        },
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(261deg, #FEF2EB 0%, #F1F1F1 46.23%, #E4E0EA 99.82%)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('flowbite/plugin')],
};
