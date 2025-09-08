module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/**/*.html"],
  theme: {
    extend: {
      colors: {
        primary: "#7b1e23",
        accent: "#ef4444",
        dark: "#0b0f19",
        light: "#f9fafb"
      },
      boxShadow: {
        glow: "0 0 20px rgba(239,68,68,.35)",
        card: "0 4px 14px rgba(0,0,0,0.1)"
      }
    }
  },
  plugins: []
};
