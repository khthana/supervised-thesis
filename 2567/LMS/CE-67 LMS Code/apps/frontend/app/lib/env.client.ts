import { url, cleanEnv, host, port, str } from 'envalid';

const env = cleanEnv(import.meta.env, {
	VITE_HOST: host({ default: 'localhost' }),
	VITE_BACKEND_URL: url({ default: 'http://localhost:5000' }),
});

export function getPublicEnv() {
	return {
		isProduction: env.isProduction,
		isDevelopment: env.isDevelopment,
		isTest: env.isTest,
		HOST: env.VITE_HOST,
		BACKEND_URL: env.VITE_BACKEND_URL,
	};
}
