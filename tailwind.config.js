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
        'lexend': ['Lexend-Regular', 'sans-serif'],
        'lexend-black': ['Lexend-Black', 'sans-serif'],
        'lexend-bold': ['Lexend-Bold', 'sans-serif'],
        'lexend-extra-bold': ['Lexend-ExtraBold', 'sans-serif'],
        'lexend-extra-light': ['Lexend-ExtraLight', 'sans-serif'],
        'lexend-light': ['Lexend-Light', 'sans-serif'],
        'lexend-semi-bold': ['Lexend-SemiBold', 'sans-serif'],
        'lexend-thin': ['Lexend-Thin', 'sans-serif'],
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