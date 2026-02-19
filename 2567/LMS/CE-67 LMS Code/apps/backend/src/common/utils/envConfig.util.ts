import { cleanEnv, email, host, num, port, str, testOnly } from 'envalid';

// Validate the environment variables
export const env = cleanEnv(process.env, {
	NODE_ENV: str({
		choices: ['development', 'production', 'test'],
	}),
	HOST: host(),
	PORT: port(),
	REDIS_HOST: host(),
	REDIS_PORT: port(),
	FRONTEND_URL: str(),
	CORS_ORIGIN: str(),
	COMMON_RATE_LIMIT_MAX_REQUESTS: num(),
	COMMON_RATE_LIMIT_WINDOW_MS: num(),
	ACCESS_TOKEN_SECRET: str(),
	ACCESS_TOKEN_EXP: str(),
	ACCESS_TOKEN_PUBLIC: str(),
	REFRESH_TOKEN_SECRET: str(),
	REFRESH_TOKEN_EXP: str(),
	REFRESH_TOKEN_PUBLIC: str(),
	VERIFY_TOKEN_SECRET: str(),
	VERIFY_TOKEN_PUBLIC: str(),
	NOREPLY_EMAIL: email(),
	NOREPLY_EMAIL_PASSWORD: str(),
	OAUTH2_GOOGLE_CLIENT_ID: str(),
	OAUTH2_GOOGLE_CLIENT_SECRET: str(),
	OAUTH2_GOOGLE_AUTH_URL: str(),
	OAUTH2_GOOGLE_TOKEN_URL: str(),
	OAUTH2_GOOGLE_TOKENINFO_URL: str(),
	VIDEO_SECRET_KEY: str(),
	VIDEO_SERVER_URL: str(),
	MEDIA_SERVER_URL: str(),
});
