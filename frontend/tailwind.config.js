/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sur: "#E0E5EC",
        light: "#FFFFFF",
        clay: "#A3B1C6",
        // Role accents
        admin:   { DEFAULT: "#1871E9", dark: "#1263C8" },
        teacher: { DEFAULT: "#7C3AED", dark: "#6D28D9" },
        student: { DEFAULT: "#10B981", dark: "#059669" },
        parent:  { DEFAULT: "#0EA5E9", dark: "#0284C7" },
        owner:   { DEFAULT: "#F59E0B", dark: "#D97706" },
        // Status
        success: "#10B981",
        warning: "#F59E0B",
        danger:  "#EF4444",
        info:    "#3B82F6",
      },
      boxShadow: {
        "neu-raise-sm":  "-4px -4px 8px #FFFFFF, 4px 4px 8px #A3B1C6",
        "neu-raise-md":  "-8px -8px 16px #FFFFFF, 8px 8px 16px #A3B1C6",
        "neu-raise-lg":  "-12px -12px 24px #FFFFFF, 12px 12px 24px #A3B1C6",
        "neu-sink-sm":   "inset -3px -3px 7px #FFFFFF, inset 3px 3px 7px #A3B1C6",
        "neu-sink-md":   "inset -5px -5px 10px #FFFFFF, inset 5px 5px 10px #A3B1C6",
        "neu-acc-admin": "-4px -4px 10px #FFFFFF, 5px 5px 12px rgba(24,113,233,.38)",
        "neu-acc-teacher":"-4px -4px 10px #FFFFFF, 5px 5px 12px rgba(124,58,237,.38)",
        "neu-acc-student":"-4px -4px 10px #FFFFFF, 5px 5px 12px rgba(16,185,129,.38)",
        "neu-acc-parent": "-4px -4px 10px #FFFFFF, 5px 5px 12px rgba(14,165,233,.38)",
      },
      fontFamily: { sans: ["Inter", "Segoe UI", "Arial", "sans-serif"] },
      borderRadius: { neu: "16px" },
      backgroundImage: {
        "neu-surface": "linear-gradient(145deg, #E6ECF5, #D9DFE9)",
      },
    },
  },
  plugins: [],
};
