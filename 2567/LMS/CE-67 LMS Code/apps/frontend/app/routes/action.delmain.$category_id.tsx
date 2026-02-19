import { getAccessToken } from '@/server/token.server';
import type { ActionFunctionArgs } from 'react-router';
import { getPublicEnv } from '../lib/env.server';

export async function action({ request, params }: ActionFunctionArgs) {
	console.log('Deleting category');
	const env = getPublicEnv();
	const { category_id } = params;
	const formData = await request.formData();
	// const name = formData.get("name") as string;

	console.log('Category ID:', category_id);
	// console.log("Name:", name);

	const tokenResult = await getAccessToken(request);
	const accessToken = tokenResult.accessToken;
	if (!accessToken) {
		return {
			status: 401,
			message: 'Authentication required',
			category: null,
		};
	}
	if (!category_id) {
		return {
			status: 400,
			message: 'Category ID is required',
			category: null,
		};
	}

	try {
		const response = await fetch(`${env.BACKEND_URL}/api/courses/categories/main/${category_id}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name,
			}),
		});

		if (!response.ok) {
			const status = response.status;
			console.error(`Category update failed with status: ${status}`);
			console.error(response);
		}

		return {
			status: 200,
			message: 'Category updated successfully',
		};
	} catch (error) {
		return {
			ok: false,
			error: error instanceof Error ? error.message : 'An error occurred',
		};
	}
}
