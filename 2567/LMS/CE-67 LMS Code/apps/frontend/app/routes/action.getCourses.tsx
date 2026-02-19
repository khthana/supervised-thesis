import type { ApiResponse, CourseWithCategories } from '@/interfaces/sharetype';
// /routes/action.getCourses.tsx
import { getPublicEnv } from '@/lib/env.server';
import type { LoaderFunctionArgs } from 'react-router';

export async function loader({ request }: LoaderFunctionArgs): Promise<ApiResponse<CourseWithCategories>> {
	const env = getPublicEnv();

	try {
		const courseResponse = await fetch(`${env.BACKEND_URL}/api/courses?limit=12&offset=0`, {
			method: 'GET',
			headers: {
				accept: 'application/json',
			},
		});

		if (!courseResponse.ok) {
			console.error(`Failed to fetch courses: ${courseResponse.status} ${courseResponse.statusText}`);
			return {
				success: false,
				message: 'Failed to fetch courses',
				statusCode: courseResponse.status,
				responseObject: {
					courses: {
						courses: [],
						totalCount: 0,
					},
					categories: [],
				},
			};
		}

		const courses = await courseResponse.json();

		// เรียก API categories
		const categoryResponse = await fetch(`${env.BACKEND_URL}/api/courses/categories`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (!categoryResponse.ok) {
			console.error(`Failed to fetch categories: ${categoryResponse.status} ${categoryResponse.statusText}`);
			return {
				success: false,
				message: 'Failed to fetch categories',
				statusCode: categoryResponse.status,
				responseObject: {
					courses: courses.responseObject,
					categories: [],
				},
			};
		}

		const categories = await categoryResponse.json();

		// ตรวจสอบว่ามีคอร์สหรือไม่
		let message = 'Fetched successfully';
		const courseArray = courses?.responseObject?.courses || [];

		if (Array.isArray(courseArray) && courseArray.length === 0) {
			message = 'No courses found';
		}

		// ส่งข้อมูลกลับไปให้ Frontend ในรูปแบบที่ถูกต้อง
		return {
			success: true,
			message,
			statusCode: 200,
			responseObject: {
				courses: courses.responseObject,
				categories: categories.responseObject,
			},
		};
	} catch (error) {
		console.error('Error in loader:', error);
		return {
			success: false,
			message: 'Failed to fetch courses',
			statusCode: 500,
			responseObject: {
				courses: {
					courses: [],
					totalCount: 0,
				},
				categories: [],
			},
		};
	}
}
