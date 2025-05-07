/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        rubik: ['Rubik', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#FFFFFF',    
        },
        secondary: {
          DEFAULT: '#0C5560',    
        },
      }, 
    },
  },
  plugins: [],
} 