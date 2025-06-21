/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primarybg:'#f3e2d2',
        primarybanner:'#118EC2',
        primarytextlight:'#ABCF38',
        secondarytext:'#2E8B57',
        primarytext:'#cb4e2e',
        primaryicon :"#ecc19a",


      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-out",
      },
    },
  },
  plugins: [],
}

