/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // screens: {
    //   tablet: "640px",
    //   laptop: "1024px",
    //   desktop: "1280px",
    // },
    backgroundImage: {
      loginbg: "url('https://res.cloudinary.com/ds6avfn6i/image/upload/v1672437676/esaonlineapp/Login_background/lgin_eubqpd.png')",
      // loginbg: "url('/images/lgin.png')",
    },
    extend: {},
  },
  plugins: [],
};
