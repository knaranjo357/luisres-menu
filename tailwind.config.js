/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'wood-dark': '#5D4037',
        'wood-medium': '#8B4513',
        'wood-light': '#A0522D',
        'cream': '#FFF8DC',
        'cream-light': '#FAEBD7',
        'accent': '#D4A76A',
      },
      fontFamily: {
        'title': ['Playfair Display', 'serif'],
        'body': ['Lato', 'sans-serif'],
      },
      backgroundImage: {
        'restaurant-pattern': "url('/images/background.jpeg')",
      },
    },
  },
  plugins: [],
};