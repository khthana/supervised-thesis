import type { ApiResponse } from '@/interfaces/sharetype';
import { getPublicEnv } from '@/lib/env.server';
import { getAccessToken } from '@/server/token.server';
// /routes/action.course.upload-image.$course_id.tsx
import type { ActionFunction } from 'react-router';

export const action: ActionFunction = async ({ request, params }) => {
	console.log('action create course');
	try {
		const env = getPublicEnv();
		const accessToken = await getAccessToken(request);

		if (!accessToken) {
			return {
				success: false,
				message: 'Access token not found',
			};
		}

		// console.log('Access token:', accessToken);

		const fromData = await request.formData();
		const Subject_id = fromData.get('subject_id');
		const Name = fromData.get('name');
		const Description = fromData.get('description');
		const Category = fromData.get('category_id');
		const SubCategory = fromData.get('category_id');
		const Language = fromData.get('course_language');

		// Check if the required fields are present
		if (!Subject_id || !Name || !Description || !Category || !SubCategory || !Language) {
			return {
				success: false,
				message: 'Missing required fields',
			};
		}

		// Log the received form data
		console.log('Received form data:', {
			Subject_id,
			Name,
			Description,
			Category,
			SubCategory,
			Language,
		});

		console.log('Token', `Bearer ${accessToken.accessToken}`);

		const res = await fetch(`${env.BACKEND_URL}/api/courses/`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${accessToken.accessToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				subject_id: Subject_id,
				name: Name,
				description: Description,
				category_id: Number(Category),
				subcategory_id: Number(SubCategory),
				course_language: Language,
			}),
		});

		if (!res.ok) {
			console.error(`Failed to create course: ${res.status} ${res.statusText}`);
			return {
				success: false,
				message: 'Failed to create course',
			};
		}

		// Return a success response
		return {
			success: true,
			data: { env, accessToken },
		};
	} catch (error) {
		console.error('Error in action:', error);
		return {
			success: false,
			message: error instanceof Error ? error.message : 'An unexpected error occurred',
		};
	}
};
