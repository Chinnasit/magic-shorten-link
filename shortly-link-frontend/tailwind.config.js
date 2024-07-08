/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      dropShadow: {
        'custom': ['0 0 40px rgba(161, 161, 161, 0.30)']
      },
      
    },
  },
  plugins: [],
}

