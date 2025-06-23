/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        salon: {
          50: '#fef7ee',
          100: '#fdedd6',
          200: '#fbd7ac',
          300: '#f8bb77',
          400: '#f49640',
          500: '#f1771a',
          600: '#e25d10',
          700: '#bb4510',
          800: '#953915',
          900: '#793014',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}