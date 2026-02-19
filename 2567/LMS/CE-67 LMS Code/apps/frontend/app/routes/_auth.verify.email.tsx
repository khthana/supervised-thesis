import { getPublicEnv } from '@/lib/env.server';
import { redirectWithToast } from '@/server/toaster.server';
import { type LoaderFunctionArgs, redirect } from 'react-router';

export async function loader({ request }: LoaderFunctionArgs) {
	const env = getPublicEnv();
	const url = new URL(request.url);
	const token = url.searchParams.get('token');

	if (!token) {
		return redirectWithToast('/login', {
			type: 'error',
			message: 'Token has expired. Please login and try again.',
		});
	}

	const response = await fetch(`${env.BACKEND_URL}/api/auth/verify/account`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			// 'Accept-Language': locale,
		},
		body: JSON.stringify({
			mailtype: 'email',
			token: token,
		}),
	});

	const data = await response.json();
	console.log(data);
	if (!response.ok) {
		return redirectWithToast('/login', {
			type: 'error',
			message: 'Something went wrong. Please login and try again.',
		});
	}

	return redirect('/');
}
