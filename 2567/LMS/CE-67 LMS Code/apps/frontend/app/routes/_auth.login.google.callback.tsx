import { Spinner } from '@heroui/react';
import React from 'react';
import { type LoaderFunctionArgs, redirect } from 'react-router';
import { getPublicEnv } from '../lib/env.server';
import userService from '../server/api/user.server';
import { commitSession, getSession } from '../server/sessions/learnify.server';

export async function loader({ request }: LoaderFunctionArgs) {
	const env = getPublicEnv();
	const url = new URL(request.url);
	const code = url.searchParams.get('code');

	if (!code) {
		return redirect('/login?provider=google&error=unknown');
	}

	const response = await fetch(`${env.BACKEND_URL}/api/auth/google/callback?code=${code}`, {
		method: 'POST',
	});

	if (!response.ok) {
		if (response.status === 401) {
			return redirect('/login?provider=google&error=unauthorized');
		}
		return redirect('/login?provider=google&error=unknown');
	}

	const respData = await response.json();
	const data = respData.responseObject;
	if (data.refreshToken && data.accessToken) {
		const accessToken = data.accessToken;
		const refreshToken = data.refreshToken;

		const session = await getSession(request.headers.get('Cookie'));
		session.set('accessToken', accessToken);
		session.set('refreshToken', refreshToken);

		const user = await userService.getLocalInfo(accessToken);

		// if (user?.is_verified === false) {
		// 	return redirect(`/verifyaccount?email=${user?.email}`, {
		// 		headers: {
		// 			'Set-Cookie': await commitSession(session),
		// 		},
		// 	});
		// }

		return redirect('/', {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Set-Cookie': await commitSession(session),
			},
		});
	}
	return redirect('/login?provider=google&error=unknown');
}

export default function GoogleCallback() {
	return <Spinner label='Redirecting...' color='default' />;
}
