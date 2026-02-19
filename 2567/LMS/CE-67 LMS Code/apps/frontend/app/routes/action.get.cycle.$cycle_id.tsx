import { getPublicEnv } from '@/lib/env.server';
import { commitSession, getSession } from '@/server/sessions/learnify.server';
import type { ActionFunctionArgs } from 'react-router';

export async function action({ request, params }: ActionFunctionArgs) {
	const env = getPublicEnv();
	const { cycle_id } = params;

	if (!cycle_id) {
		return {
			status: 400,
			message: 'Cycle ID is required',
		};
	}

	const formData = await request.formData();

	const rawCycleData = {
		cycle_id: Number(cycle_id),
	};

	try {
		const cycleData = rawCycleData;

		const session = await getSession(request.headers.get('Cookie'));
		let accessToken = session.get('accessToken');
		const refreshToken = session.get('refreshToken');

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

		const deleteCycleResponse = await fetch(`${env.BACKEND_URL}/api/courses/cycles/${cycle_id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify(cycleData),
		});

		if (!deleteCycleResponse.ok) {
			return {
				status: deleteCycleResponse.status,
				message: deleteCycleResponse.statusText,
			};
		}

		return null;
	} catch (error) {
		console.error('Error deleting cycle:', error);
		return null;
	}
}
