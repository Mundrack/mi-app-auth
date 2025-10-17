/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta minimalista blanco/negro
        primary: {
          DEFAULT: '#000000',
          hover: '#1a1a1a',
        },
        secondary: {
          DEFAULT: '#ffffff',
          hover: '#f9fafb',
        },
        accent: '#f3f4f6',
        border: '#e5e7eb',
        muted: '#6b7280',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}