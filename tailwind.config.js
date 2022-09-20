/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			colors: {
				main_upper: '#23222b',
				main_outline: '#4e4d54',
				main_bg: '#1c1b22',
				main_white: '#fbfbfe',
			},
		},
	},
	plugins: [],
};
