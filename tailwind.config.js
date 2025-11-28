/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        radiant: '#66BB6A',
        dire: '#EF5350',
        ancient: '#8D6E63',
        ti: '#FFD700',
      },
      fontFamily: {
        radiant: ['"Radiance"', 'sans-serif'],
        dire: ['"Exocet"', 'sans-serif'],
      },
      // This enables the glow drop-shadow used in the navbar
      dropShadow: {
        glow: '0 0 20px rgba(255, 215, 0, 0.8)',
        'glow-lg': '0 0 40px rgba(255, 215, 0, 0.9)',
        'radiant-glow': '0 0 30px rgba(102, 187, 106, 0.7)',
        'dire-glow': '0 0 30px rgba(239, 83, 80, 0.7)',
      },
      // Optional: add keyframes for extra animations later
      keyframes: {
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        }
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
      }
    },
  },
  plugins: [],
}