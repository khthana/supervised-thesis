import { getPublicEnv } from '@/lib/env.server';
import type { ActionFunctionArgs } from 'react-router';

export async function loader() {
	return null;
}

export async function action({ request }: ActionFunctionArgs) {
	const env = getPublicEnv();

	try {
		const formData = await request.formData();
		// console.log('Processing form data');

		const name = formData.get('name') as string;

		const requestBody = {
			name,
		};

		// console.log('Request body:', requestBody);

		try {
			const response = await fetch(`${env.BACKEND_URL}/api/courses/categories/main`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(requestBody),
			});

			if (!response.ok) {
				throw new Error('API error response');
			}

			const responseData = await response.json();

			if (!response.ok) {
				console.error('API error response:', responseData);
				return {
					status: response.status,
					message: responseData.message || 'API error response',
				};
			}

			// console.log('User registered successfully');

			return {
				status: 200,
				message: 'User registered successfully',
				user: responseData.responseObject || null,
			};
		} catch (error) {
			console.error('Error registering user:', error);
			return { status: 500, message: 'Failed to register user' };
		}
	} catch (error) {
		console.error('Error processing form data:', error);
		return { status: 500, message: 'Failed to process form data' };
	}
}
