/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ejs}"],
  theme: {
    extend: {
      fontFamily: {
        header: ['Montserrat']
      },
      colors: {
        back: "#ababab"
      }
    },
  },
  plugins: [],
}