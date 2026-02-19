import { type LoaderFunctionArgs, redirect } from 'react-router';
import { getPublicEnv } from '../lib/env.server';

export async function loader({ params }: LoaderFunctionArgs) {
	const env = getPublicEnv();
	const { provider } = params;
	if (provider === 'google') {
		return redirect(`${env.BACKEND_URL}/api/auth/google`);
	}

	throw new Response('Provider not supported', { status: 400 });
}

export default function LoginProvider() {
	return null;
}
