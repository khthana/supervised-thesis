import { createCookie } from 'react-router';

export const localeSession = createCookie('learnify_locale', {
	path: '/',
	sameSite: 'strict',
	secure: false, // or env.isProduction
	secrets: ['localized'],
	httpOnly: true,
});
