// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        primary: "#2E7D32",
        secondary: "#81C784",
        accent: "#D4AF37",
        background: "#F8FFF8",
        card: "#FFFFFF",
        text: "#1A1A1A",
        success: "#4CAF50",
        info: "#2196F3",
        warning: "#FFC107",
        error: "#EF4444",
      },
    },
  },
  plugins: [],
};
