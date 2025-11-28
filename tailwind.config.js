/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "system-ui"],
      },
      colors: {
        trr: {
          gold: "#FFD700",
          silver: "#C0C0C0",
          bronze: "#CD7F32",
          blood: "#FF0033",
          glass: "rgba(5,7,10,0.94)",
        },
      },
      boxShadow: {
        trr: "0 18px 45px rgba(0,0,0,0.7)",
        glow: "0 0 22px rgba(168,85,247,0.65)",
      },
      backgroundImage: {
        trrRadial:
          "radial-gradient(circle at top, #2b2d31 0, #0f0f12 55%, #000 100%)",
      },
    },
  },
  plugins: [],
};
