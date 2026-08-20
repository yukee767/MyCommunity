/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0e1217",
        sidebar: "#111820",
        card: "#1a212b",
        border: "#232f3e",
        muted: "#8a96a8",
      },
    },
  },
  plugins: [],
}
