/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'appear-from-top': 'appear-from-top 0.5s ease-out',
      },
      keyframes: {
        'appear-from-top': {
          '0%': { transform: 'translateY(-32px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}