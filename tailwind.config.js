/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      spacing: {
        '8xl': '96rem',
        '9xl': '128rem',
      },
      fontFamily: {
        // sans: ['Graphik', 'sans-serif'],
        // serif: ['Merriweather', 'serif'],
      },
      colors: {
        'modalBgColor': '#00000063',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    }
  },
}