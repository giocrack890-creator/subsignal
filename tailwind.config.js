/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        "nivel-0": "#050505",
        "nivel-1": "#0A0A0A",
        "nivel-2": "#0F110F",
        "nivel-3": "#141814",
        "nivel-4": "#1A1F1A",
        "nivel-5": "#232823",
        "border-sutil": "rgba(255,255,255,0.04)",
        "border-medio": "rgba(255,255,255,0.08)",
        "border-activo": "rgba(52,211,153,0.25)",
        accent: "#34D399",
      },
      transitionTimingFunction: {
        linear: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
};
