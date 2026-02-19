import type { ApiResponse } from '@/interfaces/sharetype';
import { getPublicEnv } from '@/lib/env.server';
import { getAccessToken } from '@/server/token.server';
// /routes/action.upload.covercourse.tsx
import type { ActionFunction } from 'react-router';

export interface UploadImageResponse {
	imageUrl?: string;
	message: string;
	success: boolean;
}

export const action: ActionFunction = async ({ request, params }) => {
	try {
		console.log('Upload cover course action called');

		const accessToken = await getAccessToken(request);
		if (!accessToken) {
			console.log('No access token found');
			return {
				success: false,
				message: 'Unauthorized: Please log in to upload images',
			};
		}

		const formData = await request.formData();

		const courseId = formData.get('course_id');
		if (!courseId) {
			console.error('No course ID provided');
			return {
				success: false,
				message: 'Course ID is required',
			};
		}

		const file = formData.get('file') as File | null;
		if (!file || file.size === 0) {
			console.error('No file uploaded or file is empty');
			return {
				success: false,
				message: 'No file selected or file is empty',
			};
		}

		console.log(`Uploading image for course ${courseId}:`, file.name, file.type, file.size);

		const apiFormData = new FormData();
		apiFormData.append('file', file);

		const env = getPublicEnv();
		const uploadUrl = `${env.BACKEND_URL}/api/media/courses/avatar/${courseId}`;

		console.log('Uploading to:', uploadUrl);

		const response = await fetch(uploadUrl, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${accessToken.accessToken}`,
			},
			body: apiFormData,
		});

		if (!response.ok) {
			console.error('Upload failed with status:', response.status);

			let errorMessage = 'Failed to upload image';
			try {
				const errorData = await response.json();
				errorMessage = errorData.message || errorMessage;
			} catch (e) {
				console.error('Could not parse error response:', e);
			}

			return {
				success: false,
				message: errorMessage,
			};
		}

		const result = await response.json();
		console.log('Upload successful:', result);

		return {
			success: true,
			responseObject: {
				imageUrl: result.imageUrl || result.url || null,
				message: 'Image uploaded successfully',
				success: true,
			},
			statusCode: 200,
		} as ApiResponse<UploadImageResponse>;
	} catch (error) {
		console.error('Error in upload image action:', error);
		return {
			success: false,
			message: `An error occurred: ${error instanceof Error ? error.message : String(error)}`,
		};
	}
};
