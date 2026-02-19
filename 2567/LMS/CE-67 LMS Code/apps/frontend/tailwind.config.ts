const { heroui } = require('@heroui/react');
import type { Config } from 'tailwindcss';

export default {
	content: [
		// make sure it's pointing to the ROOT node_module
		'./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}',
		'../../node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
		},
	},
	darkMode: 'class',
	plugins: [heroui()],
} satisfies Config;
