/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: '#F5F8FA',
          100: '#E8F4FC',
          500: '#00A3CC',
          600: '#0091B8',
          700: '#007AA3',
          800: '#0066CC',
          900: '#004D99',
          950: '#003366',
        },
        brand: {
          primary: '#0066CC',
          secondary: '#00A3CC',
          accent: '#FF6B35',
        }
      },
    },
  },
  plugins: [],
}

