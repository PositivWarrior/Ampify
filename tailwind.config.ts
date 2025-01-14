import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
          gold: '#d4af37',
          ivory: '#f8f1e1',
          charcoal: '#2e2e2e',
          'neutral-gray': '#4a4a4a',
      },
  },
  },
  plugins: [],
} satisfies Config;
