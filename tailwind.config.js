const withMT = require("@material-tailwind/react/utils/withMT");
const flowbite = require("flowbite-react/tailwind");
const colors = require("tailwindcss/colors");
module.exports = withMT({
	darkMode: "class",
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}", // All file types that might use Tailwind classes
    "./node_modules/flowbite/**/*.js",
    "./node_modules/flowbite-react/dist/types/components/**/*.ts",
		"./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
		"./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
		"./node_modules/react-tailwindcss-datepicker/dist/index.esm.{js,ts,jsx,tsx}"

  ],
  theme: {
    screens: {
			'sm': '640px',
			// => @media (min-width: 640px) { ... }

			'md': '768px',
			// => @media (min-width: 768px) { ... }

			'lg': '1024px',
			// => @media (min-width: 1024px) { ... }

			'xl': '1280px',
			// => @media (min-width: 1280px) { ... }

			'2xl': '1536px'
			// => @media (min-width: 1536px) { ... }

    },
    extend: {
      colors: {
				primary: '#15668a',
        secondary: "#14171A",
				transparent: 'transparent',
				current: 'currentColor',
				black: colors.black,
				white: colors.white,
				sky: colors.sky,
				cyan: colors.cyan,
				blue: colors.blue,
				gray: colors.gray,
				stone: colors.stone,
				neutral: colors.neutral,
				zinc: colors.zinc,
				slate: colors.slate,
				rose: colors.rose,
				emerald: colors.emerald,
				indigo: colors.indigo,
				yellow: colors.yellow,
				'orient': {
					50: '#f2fafd',
					100: '#e4f2fa',
					200: '#c2e6f5',
					300: '#8cd3ed',
					400: '#4fbbe1',
					500: '#28a3cf',
					600: '#1984b0',
					700: '#15668a',
					800: '#165976',
					900: '#184a62',
					950: '#102f41'
				}
      },
			fontFamily: {
				serif: ["Playfair Display", "serif"], // Primary font for body text
				sans: ["Frank Ruhl Libre", "Arial", "sans-serif"], // Secondary font for headings/navigation
				slab: ['Roboto Slab', 'serif'], // Complementary font for emphasis/quotes
				mono: ['Fira Code', 'Courier New', 'monospace'] // Monospace for code blocks
			}
    },
  },
  plugins: [
    require("flowbite/plugin"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
		require('@tailwindcss/container-queries')

    // You don't need to add 'flowbite/plugin' twice
  ],
});
