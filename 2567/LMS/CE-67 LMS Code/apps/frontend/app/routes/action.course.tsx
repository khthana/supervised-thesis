import type { CourseWithUserType } from '@/interfaces/sharetype';
import type { LoaderFunctionArgs } from 'react-router';

export async function loader({ request, params }: LoaderFunctionArgs) {
	const course_id = params.course_id;
	const getPublicEnv = await import('@/lib/env.server').then((mod) => mod.getPublicEnv);
	const env = getPublicEnv();
	const { getAccessToken } = await import('@/server/token.server');
	const userServiceModule = await import('@/server/api/user.server');

	const { accessToken, status } = await getAccessToken(request);
	// console.log('Access token:', accessToken);
	if (status !== 200) {
		return { status: 401, message: 'Unauthorized' };
	}

	const user = await userServiceModule.default.getInfo(accessToken);

	try {
		// const response = await fetch(`${env.BACKEND_URL}/api/courses?id=${course_id}`);
		const response = await fetch(`${env.BACKEND_URL}/api/courses/${course_id}`);

		if (!response.ok) {
			console.error(`Failed to fetch course: ${response.status} ${response.statusText}`);
			return { status: response.status, message: 'Course not found' };
		}

		const Data = await response.json();
		const course = Data.responseObject as CourseWithUserType;

		if (course.created_by === user?.user_id) {
			return {
				status: 200,
				message: 'Course fetched successfully',
				course: course,
				isMyCourse: true,
			};
		}

		return {
			status: 200,
			message: 'Course fetched successfully',
			course: course,
			isMyCourse: false,
		};
	} catch (error) {
		console.error('Error fetching course:', error);
		return { status: 500, message: 'Failed to fetch course' };
	}
}
