/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ejs}"],
  theme: {
    extend: {
      fontFamily: {
        header: ['Montserrat']
      },
      colors: {
        back: "#D9D9D9"
      }
    },
  },
  plugins: [],
}