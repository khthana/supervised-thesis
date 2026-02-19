import type { ApiResponse } from '@/interfaces/sharetype';
import { getPublicEnv } from '@/lib/env.server';
import authService from '@/server/api/auth.server';
import { getAccessToken } from '@/server/token.server';
import type { UserAvatar } from '@shared/types/mediafile.model';
import type { LoaderFunctionArgs } from 'react-router';

export async function loader({ request }: LoaderFunctionArgs) {
	console.log('Fetching user avatar');
	const env = getPublicEnv();

	try {
		// Get access token
		const tokenResult = await getAccessToken(request);
		// console.log('Token result:', tokenResult.accessToken);
		const validatedToken = await authService.verifyAccessToken(tokenResult.accessToken);
		// console.log('Validated token:', validatedToken);

		// Check if access token exists
		if (!tokenResult || !tokenResult.accessToken) {
			console.log('No access token available');
			return {
				status: 401,
				message: 'Authentication required',
				avatar: null,
			};
		}

		const { accessToken } = tokenResult;

		// Make API request with proper logging
		const response = await fetch(`${env.BACKEND_URL}/api/media/users/avatar`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				Accept: 'application/json',
			},
		});

		if (!response.ok) {
			const status = response.status;
			console.error(`Avatar fetch failed with status: ${status}`);

			if (status === 401) {
				console.log('Refreshing access token');
				const newTokenResult = await getAccessToken(request);
				console.log('New token result:', newTokenResult.accessToken);
				if (newTokenResult.accessToken) {
					const newResponse = await fetch(`${env.BACKEND_URL}/api/media/users/avatar`, {
						method: 'GET',
						headers: {
							authorization: `Bearer ${newTokenResult.accessToken}`,
							Accept: 'application/json',
						},
					});

					if (!newResponse.ok) {
						console.error('Failed to fetch user avatar:', newResponse.status);
						return {
							status: 500,
							message: 'Failed to fetch user avatar',
							avatar: null,
						};
					}

					if (newResponse.ok) {
						const data = (await newResponse.json()) as ApiResponse<UserAvatar>;
						console.log('Avatar fetched successfully');

						return {
							status: 200,
							message: 'User avatar fetched successfully',
							avatar: data.responseObject,
						};
					}
				}

				throw new Error(`Failed to fetch user avatar: ${status}`);
			}
		}

		const data = (await response.json()) as ApiResponse<UserAvatar>;
		console.log('Avatar fetched successfully');

		return {
			status: 200,
			message: 'User avatar fetched successfully',
			avatar: data.responseObject,
		};
	} catch (error) {
		console.error('Error fetching user avatar:', error);
		return {
			status: 500,
			message: 'Failed to fetch user avatar',
			avatar: null,
		};
	}
}

interface AvatarDataResponse {
	status: number;
	message: string;
	avatar: UserAvatar | null;
}

export async function getAvatarDataForLoader(request: Request): Promise<AvatarDataResponse | null> {
	const response = await fetch(new URL('/action/users/avatar', request.url), {
		headers: {
			Cookie: request.headers.get('Cookie') || '',
		},
	});

	if (!response.ok) return null;
	return response.json() as Promise<AvatarDataResponse>;
}
