import { serverEnv } from '@/lib/env.server';
import { createCookieSessionStorage } from 'react-router';

export const userSession = createCookieSessionStorage({
	cookie: {
		name: 'learnify_session',
		sameSite: 'lax',
		path: '/',
		httpOnly: true,
		secrets: [serverEnv.SESSION_SECRET],
		secure: false,
	},
});

export const { getSession, commitSession, destroySession } = userSession;
