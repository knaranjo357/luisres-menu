/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta de colores premium para el restaurante
        gold: {
          50: '#fefce8',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          DEFAULT: '#d4af37',
        },
        wood: {
          light: '#8b7355',
          medium: '#6d5a47',
          dark: '#5a4a3a',
          DEFAULT: '#6d5a47',
        },
        cream: {
          50: '#fefdfb',
          100: '#fef7f0',
          200: '#faebd7',
          300: '#f5deb3',
          400: '#f0d68c',
          light: '#faf6f2',
          DEFAULT: '#f5f5dc',
        },
      },
      fontFamily: {
        title: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
        accent: ['Crimson Text', 'serif'],
      },
      boxShadow: {
        luxury: '0 10px 40px rgba(0, 0, 0, 0.1)',
        'luxury-lg': '0 20px 60px rgba(0, 0, 0, 0.15)',
        'luxury-xl': '0 30px 80px rgba(0, 0, 0, 0.2)',
        glow: '0 0 20px rgba(212, 175, 55, 0.3)',
        'glow-strong': '0 0 30px rgba(212, 175, 55, 0.5)',
      },
      backgroundImage: {
        'premium-gradient': 'linear-gradient(135deg, #faf6f2 0%, #f5f5dc 100%)',
        'gold-gradient': 'linear-gradient(135deg, #d4af37 0%, #b8941f 100%)',
        'wood-gradient': 'linear-gradient(135deg, #6d5a47 0%, #5a4a3a 100%)',
        'shimmer': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};