/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    // screens: {
    //   tablet: "640px",
    //   laptop: "1024px",
    //   desktop: "1280px",
    // },
    backgroundImage: {
      loginbg: "url('/images/ESA2.jpg')",
      // loginbg: "url('/images/lgin.png')",
    },
    extend: {},
  },
  plugins: [],
};
