import authService from '@/server/api/auth.server';
import { commitSession, getSession } from '@/server/sessions/learnify.server';
import type { LoaderFunctionArgs } from 'react-router';

interface AccessTokenResponse {
	accessToken: string;
	status: number;
}

export async function getAccessToken(request: LoaderFunctionArgs['request']): Promise<AccessTokenResponse> {
	const session = await getSession(request.headers.get('Cookie'));
	const accessToken = session.get('accessToken');
	const refreshToken = session.get('refreshToken');

	if (!refreshToken) {
		return {
			accessToken: '',
			status: 401,
		};
	}

	const verifiedRefresh = await authService.verifyRefreshToken(refreshToken);
	if (!verifiedRefresh) {
		return {
			accessToken: '',
			status: 403,
		};
	}

	if (!accessToken) {
		try {
			const newAccessToken = await authService.fetchNewAccessToken(refreshToken);
			if (!newAccessToken) {
				return {
					accessToken: '',
					status: 500,
				};
			}

			session.set('accessToken', newAccessToken);
			await commitSession(session);

			return {
				accessToken: newAccessToken,
				status: 200,
			};
		} catch (error) {
			console.error(`Error fetching new access token: ${error}`);
			return {
				accessToken: '',
				status: 500,
			};
		}
	}

	const verifiedAccess = await authService.verifyAccessToken(accessToken);
	if (!verifiedAccess) {
		try {
			const newAccessToken = await authService.fetchNewAccessToken(refreshToken);
			console.log('Refresh token result:', newAccessToken ? 'success' : 'failed');

			if (!newAccessToken) {
				return {
					accessToken: '',
					status: 500,
				};
			}

			session.set('accessToken', newAccessToken);
			await commitSession(session);

			return {
				accessToken: newAccessToken,
				status: 200,
			};
		} catch (error) {
			console.error(`Error fetching new access token: ${error}`);
			return {
				accessToken: '',
				status: 500,
			};
		}
	}

	return {
		accessToken,
		status: 200,
	};
}
