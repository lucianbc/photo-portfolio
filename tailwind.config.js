/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    container: false,
  },
  content: [
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/templates/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        title: ["Open Sans", "sans-serif"]
      }
    }
  },
  plugins: [
    function ( {addComponents }) {
      addComponents({
        '.container': {
          maxWidth: '1800px',
          margin: 'auto',
          width: '95%',
          // backgroundColor: 'red',
        }
      })
    }
  ],
};
