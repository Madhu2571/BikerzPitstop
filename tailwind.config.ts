import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pitstop: {
          950: "#090A0D",
          900: "#0F1117",
          850: "#151821",
          800: "#1C202C",
          700: "#272D3D",
          600: "#384157",
          500: "#4F5B7A",
          400: "#7C8BA6",
          300: "#A9B4C9",
          200: "#D1D7E4",
          100: "#E9ECF2",
        },
        racing: {
          orange: "#FF5500",
          amber: "#FF7700",
          yellow: "#FFB703",
          red: "#E63946",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
