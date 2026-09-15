/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        ink: { 900: '#0f172a', 700: '#334155', 500: '#64748b', 300: '#cbd5e1', 100: '#f1f5f9' },
        accent: { 600: '#2563eb', 500: '#3b82f6' },
      },
      fontFamily: {
        ui: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
