import { createCookieSessionStorage } from 'react-router';
import { createThemeSessionResolver } from 'remix-themes';

const themeSession = createCookieSessionStorage({
	cookie: {
		name: 'learnify_theme',
		sameSite: 'strict',
		path: '/',
		httpOnly: true,
		secrets: ['themed'],
		secure: false,
	},
});

export const themeSessionResolver = createThemeSessionResolver(themeSession);
