/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          500: '#107C41',
          600: '#0F7A44',
          700: '#0c6237',
          800: '#094d2b',
          900: '#06371f',
          surface: '#EAF6EF',
        },
        appBg: '#F4F7F5',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'mobile': '0 10px 40px -10px rgba(0,0,0,0.08), 0 0 1px 1px rgba(0,0,0,0.05)',
        'card': '0 2px 10px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0,0,0,0.02)',
        'nav': '0 -4px 20px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
