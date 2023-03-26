/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'orangeBtn': '#ff7100',
        'lightBlueBackground': '#c4e5ff',
        'greenGrass': '#00e834',
        'blueTopBar': '#5b4adb',
        'yellowLevel': '#eeff31',
        'grayText': '#575757',
        'grayLight': '#D9D9D9',
        'lightGrayBadge': '#f1f1f2',
        'blueBackGround': '#466ED7',
        'yellowLevel': '#FFA755',
      },
    },
  },
  plugins: [],
}
