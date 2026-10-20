/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#14170f',
        olive: {
          900: '#2a3120',
          800: '#3f4a2b',
          700: '#4d5a34',
          600: '#5c6b3f',
          200: '#dfe3d2'
        },
        khaki: {
          300: '#c9bd93',
          200: '#dcd3b3',
          100: '#ece5cd'
        },
        paper: '#f3efe4',
        alert: {
          700: '#7a2620',
          100: '#f3ded9'
        }
      },
      fontFamily: {
        display: ['"Barlow Condensed"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace']
      }
    }
  },
  plugins: []
};