import type { ApiResponse } from '@/interfaces/sharetype';
import { getAccessToken } from '@/server/token.server';
import type { ActionFunctionArgs } from 'react-router';
import { getPublicEnv } from '../lib/env.server';

export async function action({ request, params }: ActionFunctionArgs) {
	console.log('action upload video');
	// const formData = await request.formData();
	// formData.append('file', formData.get('file') as File);
	// console.log('formData', formData.get('course_id'));
	const requestFormData = await request.formData();
	const file = requestFormData.get('file') as File;

	const env = getPublicEnv();
	const courseId = params.course_id;

	const tokenResult = await getAccessToken(request);
	const accessToken = tokenResult.accessToken;

	const newFormData = new FormData();
	newFormData.append('file', file);

	if (!accessToken) {
		return {
			status: 401,
			message: 'Authentication required',
			video: null,
		};
	}

	if (!courseId) {
		return {
			status: 400,
			message: 'Course ID is required',
			video: null,
		};
	}

	try {
		console.log('formData', newFormData);
		// console.log(`${env.BACKEND_URL}/api/media/courses/intro-video/${courseId}`)
		const response = await fetch(`${env.BACKEND_URL}/api/media/courses/intro-video/${courseId}`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
			body: newFormData,
		});

		console.log('response', response);

		if (!response.ok) {
			const errorResponse = await response.json();
			return {
				status: response.status,
				message: errorResponse.message || 'Failed to upload video',
				video: null,
			};
		}

		return await response.json();
	} catch (error) {
		return { error: error instanceof Error ? error.message : 'An unknown error occurred' };
	}
}
