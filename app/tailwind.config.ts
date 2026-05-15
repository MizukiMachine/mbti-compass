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
        background: '#FBFAF7',        // Warm canvas
        surface: '#FFFFFF',           // White
        'surface-elevated': '#FFFFFF', // White
        accent: '#533DC2',            // Deep purple
        'accent-secondary': '#8A7CE5', // Lighter purple
        'accent-glow': '#ECEBFE',     // Pale lavender glow
        border: 'rgba(0, 0, 0, 0.08)', // Light border
      },
      fontFamily: {
        sans: ['Avenir Next', 'Helvetica Neue', 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'sans-serif'],
        display: ['Georgia', 'Times New Roman', 'Yu Mincho', 'Hiragino Mincho ProN', 'serif'],
      },
      fontSize: {
        'display': ['48px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '600' }],
        'title-1': ['28px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
        'title-2': ['22px', { lineHeight: '1.3', fontWeight: '500' }],
        'body': ['17px', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['13px', { lineHeight: '1.4', letterSpacing: '0.01em', fontWeight: '400' }],
      },
      spacing: {
        'xs': '8px',
        'sm': '16px',
        'md': '24px',
        'lg': '32px',
        'xl': '48px',
        '2xl': '64px',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
