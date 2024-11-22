/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8d6aee',
        secondary: {
          DEFAULT: '#162698',
          dark: '#0a254a',
        },
        highlight: '#4cb9cf',
        light: '#fbfbfb',
        dark: '#0a122f',
      },
      fontFamily: {
        sans: ['ABeeZee', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
