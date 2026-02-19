import { getPublicEnv } from '@/lib/env.server';
import { commitSession, getSession } from '@/server/sessions/learnify.server';
import { CreateCourseCycleSchema } from '@shared/types/courses/cycle.model';
import type { ActionFunctionArgs } from 'react-router';
import { z } from 'zod';

export async function action({ request, params }: ActionFunctionArgs) {
	const env = getPublicEnv();
	const { course_id } = params;

	if (!course_id) {
		return {
			status: 400,
			message: 'Course ID is required',
		};
	}

	const formData = await request.formData();

	// แปลงชื่อฟิลด์และค่าให้ตรงกับ Schema
	const rawCycleData = {
		name: formData.get('name') as string,
		is_always_enroll: formData.get('is_always_enroll') === 'true',
		is_always_open: formData.get('is_always_open') === 'true',
		is_restrict_enroll: formData.get('is_restrict') === 'true',
		max_enrollments: Number(formData.get('max_learner') || '0'),
		course_type: formData.get('course_type') === 'self-paced' ? 'PUBLIC' : 'PRIVATE',
		status: formData.get('status') === 'published' ? 'ACTIVE' : 'INACTIVE',
		enroll_start: formData.get('enroll_start') as string,
		enroll_end: formData.get('is_always_enroll') === 'true' ? null : (formData.get('enroll_end') as string),
		cycle_start: formData.get('cycle_start') as string,
		cycle_end: formData.get('is_always_open') === 'true' ? null : (formData.get('cycle_end') as string),
	};

	// ตรวจสอบความถูกต้องของข้อมูลด้วย Zod Schema
	try {
		// จำกัดจำนวนผู้เรียนสูงสุด
		const MAX_ALLOWED_LEARNERS = 1000;
		if (rawCycleData.max_enrollments > MAX_ALLOWED_LEARNERS) {
			rawCycleData.max_enrollments = MAX_ALLOWED_LEARNERS;
		}

		// ตรวจสอบความถูกต้องตาม Schema
		const cycleData = CreateCourseCycleSchema.parse(rawCycleData);

		const session = await getSession(request.headers.get('Cookie'));
		let accessToken = session.get('accessToken');
		const refreshToken = session.get('refreshToken');

		// ถ้าไม่มี accessToken ให้ลองใช้ refreshToken
		if (!accessToken && refreshToken) {
			try {
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
					return {
						status: 401,
						message: 'Authentication required',
					};
				}

				const newTokenData = await renew.json();
				accessToken = newTokenData.accessToken;
				session.set('accessToken', accessToken);
				await commitSession(session);
			} catch (error) {
				return {
					status: 401,
					message: 'Authentication failed',
				};
			}
		}

		if (!accessToken) {
			return {
				status: 401,
				message: 'No authentication token available',
			};
		}

		// console.log('Cycle data:', cycleData);

		try {
			// ส่งข้อมูลสร้าง cycle ไปยัง API
			const res = await fetch(`${env.BACKEND_URL}/api/courses/${course_id}/cycles`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify(cycleData),
			});

			if (!res.ok) {
				return {
					status: res.status,
					message: `API error: ${res.status} ${res.statusText}`,
				};
			}

			const data = await res.json();

			return {
				status: 200,
				message: 'Cycle created successfully',
				cycle: data.responseObject,
			};
		} catch (error) {
			return {
				status: 500,
				message: 'Server error while creating cycle',
			};
		}
	} catch (error) {
		// กรณีข้อมูลไม่ผ่านการตรวจสอบด้วย Zod Schema
		if (error instanceof z.ZodError) {
			const errorMessages = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
			return {
				status: 400,
				message: `Invalid data: ${errorMessages}`,
			};
		}

		return {
			status: 500,
			message: 'An unexpected error occurred',
		};
	}
}
