/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
	content: ["./app/**/*.{ts,tsx,jsx,js}"],
	theme: {
		colors: {
			transparent: "transparent",
			current: "currentColor",
			black: colors.black,
			white: colors.white,
			gray: colors.gray,
			emerald: colors.emerald,
			indigo: colors.indigo,
			yellow: colors.yellow,
			purple: colors.purple,
			// Custom
			background: "#0f0e17",
			lightBackground: "#2e2f3e",
			text: "#fffffe",
			avatarBackground: "#DCE1E0",
			darkText: "#a7a9be",
			primary: "#ff8906",
			darkPrimary: "#f25f4c",
			secondary: "#e53170",
			// orange: "#F7A145",
			// blue: "#52908B",
			// dark: "#1E1E1E",
			// light: "#DCE1E0",
			// grey: "#2E3033",
		},
		extend: {
			animation: {
				text: "text 5s ease infinite",
			},
			keyframes: {
				text: {
					"0%, 100%": {
						"background-size": "200% 200%",
						"background-position": "left center",
					},
					"50%": {
						"background-size": "200% 200%",
						"background-position": "right center",
					},
				},
			},
		},
	},
	plugins: [],
};
