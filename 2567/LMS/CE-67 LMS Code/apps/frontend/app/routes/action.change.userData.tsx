import { getAccessToken } from '@/server/token.server';
import { ValidateUserSchema } from '@shared/types/users/user.model';
import type { ActionFunctionArgs } from 'react-router';
import { redirectDocument } from 'react-router';
import { getPublicEnv } from '../lib/env.server';

export async function action({ request }: ActionFunctionArgs) {
	console.log('Uploading User Data');
	const formData = await request.formData();
	const data = {
		firstname_en: formData.get('firstname_en'),
		firstname_th: formData.get('firstname_th'),
		lastname_en: formData.get('lastname_en'),
		lastname_th: formData.get('lastname_th'),
		email: formData.get('email'),
	};

	console.log('Data:', data);

	const env = getPublicEnv();
	const tokenResult = await getAccessToken(request);
	const accessToken = tokenResult.accessToken;

	if (!accessToken) {
		return {
			status: 401,
			message: 'Authentication required',
			avatar: null,
		};
	}

	try {
		const res = await fetch(`${env.BACKEND_URL}/api/users`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});

		console.error('Response:', res);

		if (!res.ok) {
			const status = res.body;
			console.error(`User update failed with status: ${status}`);
			return {
				status: status,
				message: 'User update failed',
			};
		}

		return redirectDocument('/profile');
	} catch (error) {
		return {
			ok: false,
			error: error instanceof Error ? error.message : 'An error occurred',
		};
	}
}
