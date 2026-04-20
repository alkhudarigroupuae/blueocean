/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#FFD400', // CEO's Yellow
          black: '#000000',   // OLED Pure Black
          zinc: {
            950: '#09090B',
            900: '#18181B',
            800: '#27272A',
            700: '#3F3F46',
            400: '#A1A1AA',
            500: '#71717A',
          }
        }
      },
    },
  },
  plugins: [],
}

