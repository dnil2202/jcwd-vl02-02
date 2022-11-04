/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    '../../node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        'Public': ['Public Sans', 'sans-serif', defaultTheme.fontFamily.Public]
      },
      width: {
        'fit-navbarmd': '656px',
        'fit-navbarlg': '912px',
        'fit-navbarxl': '1168px',
        'fit-navbar2xl': '1424px',
        'fit-productmd': '620px',
        'fit-productxl': '876px',
        'fit-product2xl': '1132px',
      }
    },
    colors: {
      'main': {
        100: '#7dfff6',
        200: '#31fff0',
        300: '#00f3e1',
        400: '#00c2b4',
        500: '#009b90',
        600: '#007c73',
        700: '#00635c',
        800: '#004f4a',
        900: '#003f3b',
      },
      "btn-500": "#009B90", //secondary color (clicked) or btn bg color
      "btn-600": "#008076", //hover color
      "txt-500": "#213360" //main color
    }
  },
  plugins: [
    require('flowbite/plugin')
  ],
}
