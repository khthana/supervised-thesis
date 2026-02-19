import { getAccessToken } from '@/server/token.server';
import type { ActionFunctionArgs } from 'react-router';
import { redirectDocument } from 'react-router';
import { getPublicEnv } from '../lib/env.server';

export async function action({ request }: ActionFunctionArgs) {
	console.log('Uploading avatar');
	const formData = await request.formData();
	const avatarFile = formData.get('file') as File | null;

	if (!avatarFile || avatarFile.size === 0) {
		console.error('No file uploaded');
		return {
			ok: false,
			error: 'No file uploaded',
		};
	}

	const apiFormData = new FormData();
	apiFormData.append('file', avatarFile);

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
		const response = await fetch(`${env.BACKEND_URL}/api/media/users/avatar`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
			body: apiFormData,
		});

		if (!response.ok) {
			const status = response.status;
			console.error(`Avatar upload failed with status: ${status}`);
		}

		console.log('Response:', response);

		return redirectDocument('/profile');
	} catch (error) {
		return {
			ok: false,
			error: error instanceof Error ? error.message : 'An error occurred',
		};
	}
}
