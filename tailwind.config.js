/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'wood-dark': '#2C1810',
        'wood-medium': '#4A2511',
        'wood-light': '#6B3D1F',
        'cream': '#FFF8E7',
        'cream-light': '#FFFAF0',
        'accent': '#E4B04A',
      },
      fontFamily: {
        'title': ['Playfair Display', 'serif'],
        'body': ['Lato', 'sans-serif'],
      },
      backgroundImage: {
        'restaurant-pattern': "url('https://alliasoft.s3.us-east-2.amazonaws.com/restaurante-luisres/background.jpeg')",
      },
    },
  },
  plugins: [],
};