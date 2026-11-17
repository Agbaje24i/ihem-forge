/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // scan all React files
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand: deep violet "forge" scale
        forge: {
          50: "#F5F3FF",
          100: "#EAE6FF",
          200: "#D4CEFF",
          300: "#B3A9FF",
          400: "#8D7EFB",
          500: "#6D5BF3",
          600: "#5A43E6",
          700: "#4B34C9",
          800: "#3D2CA3",
          900: "#2A1F73",
          950: "#161040",
        },
        // Accent: warm ember / amber
        ember: {
          300: "#FFD08A",
          400: "#FFB347",
          500: "#FF9A1F",
          600: "#F07F00",
        },
      },
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: [
          '"Sora"',
          '"Plus Jakarta Sans"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px rgba(22,16,64,0.04), 0 8px 24px rgba(22,16,64,0.08)",
        glow: "0 10px 40px rgba(109,91,243,0.35)",
      },
    },
  },
  plugins: [],
};
