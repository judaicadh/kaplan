const withMT = require("@material-tailwind/react/utils/withMT");
const flowbite = require("flowbite-react/tailwind");
const colors = require("tailwindcss/colors");
module.exports = withMT({
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}", // All file types that might use Tailwind classes
    "./node_modules/flowbite/**/*.js",
    "./node_modules/flowbite-react/dist/types/components/**/*.ts",
    "./node_modules//@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules//@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.{js,ts}",


  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        primary: "#1DA1F2",
        secondary: "#14171A",
      },
      fontFamily: {
        sans: ["Graphik", "sans-serif"],
        serif: ["Merriweather", "serif"],
      },
    },
  },
  plugins: [
    require("flowbite/plugin"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),

    // You don't need to add 'flowbite/plugin' twice
  ],
});
