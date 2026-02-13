/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        brand: {
          dark: "#124B2B",
          base: "#1F6F43",
        },
        gray: {
          100: "#F8F9FA",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#111827",
        },
        neutral: {
          black: "#000000",
          white: "#FFFFFF",
        },
        feedback: {
          danger: "#EF4444",
          success: "#19AD70",
        },
        blue: {
          dark: "#1E3A8A",
          base: "#3B82F6",
          light: "#DBEAFE",
        },
        purple: {
          dark: "#6D28D9",
          base: "#8B5CF6",
          light: "#EDE9FE",
        },
        pink: {
          dark: "#BE185D",
          base: "#EC4899",
          light: "#FCE7F3",
        },
        red: {
          dark: "#B91C1C",
          base: "#EF4444",
          light: "#FEE2E2",
        },
        orange: {
          dark: "#C2410C",
          base: "#F97316",
          light: "#FFEDD5",
        },
        yellow: {
          dark: "#CA8A04",
          base: "#EAB308",
          light: "#FEF3C7",
        },
        green: {
          dark: "#15803D",
          base: "#22C55E",
          light: "#DCFCE7",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
