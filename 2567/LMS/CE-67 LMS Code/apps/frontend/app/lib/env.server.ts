import { url, cleanEnv, host, port, str } from 'envalid';

export const DEFAULT_PASSWORD = '@Password123';

const env = cleanEnv(import.meta.env, {
	NODE_ENV: str({
		default: 'development',
		choices: ['development', 'production', 'test'],
	}),
	VITE_PORT: port({ default: 3000 }),
	VITE_HOST: host({ default: 'localhost' }),
	VITE_SESSION_SECRET: str(),
	VITE_ACCESS_TOKEN_PUBLIC: str(),
	VITE_REFRESH_TOKEN_PUBLIC: str(),
	VITE_BACKEND_URL: url({ default: 'http://localhost:5000' }),
	VITE_OAUTH2_GOOGLE_CLIENT_ID: str(),
	VITE_OAUTH2_GOOGLE_CLIENT_SECRET: str(),
});

export const serverEnv = {
	isProduction: env.NODE_ENV === 'production',
	isDevelopment: env.NODE_ENV === 'development',
	isTest: env.NODE_ENV === 'test',
	PORT: env.VITE_PORT,
	HOST: env.VITE_HOST,
	SESSION_SECRET: env.VITE_SESSION_SECRET,
	ACCESS_TOKEN_PUBLIC: env.VITE_ACCESS_TOKEN_PUBLIC,
	REFRESH_TOKEN_PUBLIC: env.VITE_REFRESH_TOKEN_PUBLIC,
	BACKEND_URL: env.VITE_BACKEND_URL,
	OAUTH2_GOOGLE_CLIENT_ID: env.VITE_OAUTH2_GOOGLE_CLIENT_ID,
	OAUTH2_GOOGLE_CLIENT_SECRET: env.VITE_OAUTH2_GOOGLE_CLIENT_SECRET,
};

export function getPublicEnv() {
	return {
		isProduction: serverEnv.isProduction,
		isDevelopment: serverEnv.isDevelopment,
		isTest: serverEnv.isTest,
		HOST: serverEnv.HOST,
		BACKEND_URL: serverEnv.BACKEND_URL,
	};
}
