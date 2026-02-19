import { getPublicEnv } from '../lib/env.server';

export async function loader() {
	try {
		const env = getPublicEnv();
		const response = await fetch(`${env.BACKEND_URL}/api/users`);

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		const data = await response.json();
		// console.log('Data in loader:', data);
		return data.responseObject.users;
	} catch (error) {
		console.error('Failed to fetch users:', error);
		throw new Response('Failed to load users', { status: 500 });
	}
}
