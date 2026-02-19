import { reactRouter } from '@react-router/dev/vite';
// import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	server: {
		host: process.env.VITE_HOST,
		strictPort: true,
		port: process.env.VITE_PORT ? Number.parseInt(process.env.VITE_PORT, 10) : undefined,
		allowedHosts: [
			'ce.learnify.home.unixvextor.com',
			'ce67-36.cloud.ce.kmitl.ac.th',
			'ce-learnify.com',
			'www.ce-learnify.com',
		],
	},
	plugins: [
		// tailwindcss(),
		reactRouter(),
		tsconfigPaths(),
	],
});
