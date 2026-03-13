/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  extend: {
    colors: {

      primary: "#524E8D",
      peach: "#FFCCB9",
      rating: "#FBBF24",
      header: "#E8E5F4",

    }
  }
},
  plugins: [],
}