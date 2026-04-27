/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#102a43",
        mist: "#f8fbff",
        blush: "#fff1eb",
        coral: "#ff7a59",
        teal: "#14b8a6",
        gold: "#f59e0b",
      },
      boxShadow: {
        glow: "0 20px 50px rgba(16, 42, 67, 0.12)",
      },
    },
  },
  plugins: [],
};
