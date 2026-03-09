/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class", 
  theme: {
    extend: {
      colors: {
        brandblue: {
          50: "#e0f2ff",
          100: "#b3daff",
          200: "#80bfff",
          300: "#4da6ff",
          400: "#1a8cff",
          500: "#0073e6",
          600: "#0284C7",
          700: "#004280",
          800: "#00294d",
          900: "#00131a",
        },
      },
    },
  },
  plugins: [],
};
