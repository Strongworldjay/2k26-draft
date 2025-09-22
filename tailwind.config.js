/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        board: "#7a0808",
      },
      fontFamily: {
        title: ["Impact", "Haettenschweiler", "Arial Black", "sans-serif"],
        ui: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}
