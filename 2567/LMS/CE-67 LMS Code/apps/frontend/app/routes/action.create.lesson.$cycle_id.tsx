import { getAccessToken } from '@/server/token.server';
import type { ActionFunctionArgs } from 'react-router';
import { getPublicEnv } from '../lib/env.server';

import { type CreateLesson, CreateLessonSchema } from '@shared/types/courses/lesson.model';

export async function action({ request, params }: ActionFunctionArgs) {
	console.log('action create lesson');
	const courseId = params.course_id;
	const formData = await request.formData();

	// const formData = await request.formData();

	// แปลงค่า sequence เป็น number
	const sequence = Number.parseInt(String(formData.get('sequence') || ''));

	// แปลงค่า requires_previous_lesson เป็น boolean
	const requiresPreviousLesson = formData.get('requires_previous_lesson') === 'true';

	// สร้าง object ข้อมูลที่มีค่าเป็น type ที่ถูกต้อง
	const lessonData: CreateLesson = {
		name: formData.get('name') as string,
		sequence: sequence, // กำหนดค่า default เป็น 9999 ถ้าไม่สามารถแปลงได้
		requires_previous_lesson: requiresPreviousLesson,
	};

	// Validate lessonData with zod
	// const lessonValidationResult = CreateLessonSchema.safeParse(JSON.stringify(lessonData));
	// if (!lessonValidationResult.success) {
	//   console.log('lessonValidationResult', lessonValidationResult.error.format());
	//   return {
	//     status: 400,
	//     message: 'Invalid lesson data',
	//     video: null,
	//   };
	// }

	const env = getPublicEnv();
	const cycle_id = params.cycle_id;

	const tokenResult = await getAccessToken(request);
	const accessToken = tokenResult.accessToken;

	if (!accessToken) {
		return {
			status: 401,
			message: 'Authentication required',
			video: null,
		};
	}

	if (!cycle_id) {
		return {
			status: 400,
			message: 'Course ID is required',
			video: null,
		};
	}

	try {
		// console.log('formData', formData);
		console.log('lessonData', JSON.stringify(lessonData));

		console.log(`${env.BACKEND_URL}/api/media/courses/intro-video/${courseId}`);
		const response = await fetch(`${env.BACKEND_URL}/api/courses/cycles/${cycle_id}/lessons`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify(lessonData),
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
