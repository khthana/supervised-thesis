import type { ApiResponse, CourseWithCategories } from '@/interfaces/sharetype';
import { getPublicEnv } from '@/lib/env.server';
import { commitSession, getSession } from '@/server/sessions/learnify.server';
import type { LoaderFunctionArgs } from 'react-router';

export async function loader({ request, params }: LoaderFunctionArgs) {
	console.log('Fetching course cycles');
	const env = getPublicEnv();
	const { course_id } = params;

	if (!course_id) {
		console.error('No course_id provided');
		return {
			status: 400,
			message: 'Course ID is required',
			cycle: [],
		};
	}

	const session = await getSession(request.headers.get('Cookie'));
	let accessToken = session.get('accessToken');
	const refreshToken = session.get('refreshToken');

	// ถ้าไม่มี accessToken ให้ลองใช้ refreshToken
	if (!accessToken && refreshToken) {
		try {
			console.log('No access token, attempting to renew with refresh token');
			const renew = await fetch(`${env.BACKEND_URL}/api/auth/renew`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					refreshToken: refreshToken,
				}),
			});

			if (!renew.ok) {
				console.error(`Failed to renew access token: ${renew.status} ${renew.statusText}`);
				return {
					status: 401,
					message: 'Authentication required',
					cycle: [],
				};
			}

			const newTokenData = await renew.json();
			accessToken = newTokenData.accessToken;
			session.set('accessToken', accessToken);
			await commitSession(session);
			console.log('Successfully renewed access token');
		} catch (error) {
			console.error('Error renewing token:', error);
			return {
				status: 401,
				message: 'Authentication failed',
				cycle: [],
			};
		}
	}

	if (!accessToken) {
		console.error('No access token available after renewal attempt');
		return {
			status: 401,
			message: 'No authentication token available',
			cycle: [],
		};
	}

	try {
		console.log(`Fetching cycles for course ${course_id} with token`);
		const res = await fetch(`${env.BACKEND_URL}/api/courses/${course_id}/cycles`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/ ',
				Authorization: `Bearer ${accessToken}`,
			},
		});

		if (!res.ok) {
			console.error(`API error: ${res.status} ${res.statusText}`);
			return {
				status: res.status,
				message: `API error: ${res.status} ${res.statusText}`,
				cycle: [],
			};
		}

		const data = await res.json();
		console.log('Received data from API:', data);

		// ตรวจสอบโครงสร้างข้อมูลที่ได้รับ
		if (data.responseObject && Array.isArray(data.responseObject)) {
			return {
				status: 200,
				cycle: data.responseObject,
			};
		}

		// ถ้าโครงสร้างข้อมูลไม่ตรงกับที่คาดหวัง
		console.log('Unexpected data structure:', data);
		return {
			status: 200,
			cycle: data.responseObject || [],
		};
	} catch (error) {
		console.error('Error fetching course cycles:', error);
		return {
			status: 500,
			message: 'Server error while fetching cycles',
			cycle: [],
		};
	}
}
