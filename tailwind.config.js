/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0a192f",      // primary dark blue
        orange: "#f97316",    // accent
        grey: "#6b7280",
        white: "#ffffff",
        black: "#000000",
      },
      fontFamily: {
        sans: ["Helvetica Neue", "sans-serif"],
        heading: ["Playfair Display", "serif"],
      },
    },
  },
  plugins: [],
};