/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: {
          50: '#fdf8f0',
          100: '#faefd8',
          200: '#f5ddb0',
          300: '#edc47a',
          400: '#e3a84a',
          500: '#d4892a',
          600: '#b86e1f',
          700: '#95521c',
          800: '#7a421e',
          900: '#65371c',
        },
        chocolate: {
          50: '#fdf6ee',
          100: '#f9e8d3',
          200: '#f2cfa6',
          300: '#e9af6e',
          400: '#de8735',
          500: '#d46b19',
          600: '#c5520f',
          700: '#a33c10',
          800: '#833115',
          900: '#6b2a14',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      }
    },
  },
  plugins: [],
}
