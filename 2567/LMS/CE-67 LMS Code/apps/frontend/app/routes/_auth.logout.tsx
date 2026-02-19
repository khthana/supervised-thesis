import { destroySession, getSession } from '@/server/sessions/learnify.server';
import { type LoaderFunctionArgs, redirect } from 'react-router';

export async function loader({ request }: LoaderFunctionArgs) {
	const session = await getSession(request.headers.get('Cookie'));
	const logoutSession = await destroySession(session);

	return redirect('/login', {
		headers: {
			'Set-Cookie': logoutSession,
		},
	});
}
