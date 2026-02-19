import type { ApiResponse, UserTypes } from '@/interfaces/sharetype';
import { getPublicEnv } from '@/lib/env.server';
import authService from '@/server/api/auth.server';
import { dateInput } from '@heroui/react';
import type { AccessTokenPayload } from '@shared/types/auth.model';

const env = getPublicEnv();

class UserService {
	async getAll(accessToken: string): Promise<UserTypes[]> {
		try {
			const accessTokenPayload = await authService.verifyAccessToken(accessToken);
			if (accessTokenPayload) {
				const usersResponse = await fetch(`${env.BACKEND_URL}/api/users`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${accessToken}`,
					},
				});

				const users = await usersResponse.json();
				return users;
			}
			return [];
		} catch (error) {
			console.error(`Error getting users: ${error}`);
			return [];
		}
	}

	async getAllByRole(accessToken: string, role: string): Promise<UserTypes[]> {
		try {
			const accessTokenPayload = await authService.verifyAccessToken(accessToken);

			const usersResponse = await fetch(`${env.BACKEND_URL}/api/users/?role=${role}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`,
				},
			});

			const users = await usersResponse.json();
			return users;
		} catch (error) {
			console.error(`Error getting users by role: ${error}`);
			return [];
		}
	}

	async getInfo(accessToken: string): Promise<UserTypes | null> {
		try {
			const accessTokenPayload = await authService.verifyAccessToken(accessToken);
			// console.log('accessTokenPayload', accessTokenPayload);
			if (accessTokenPayload?.user_id) {
				// console.log('accessTokenPayload.id', accessTokenPayload.user_id);
				const userDataResponse = await fetch(`${env.BACKEND_URL}/api/users/${accessTokenPayload?.user_id}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${accessToken}`,
					},
				});

				const userData: ApiResponse<UserTypes> = await userDataResponse.json();
				return userData.responseObject;
			}
			return null;
		} catch (error) {
			console.error(`Error getting user info: ${error}`);
			return null;
		}
	}

	async getLocalInfo(accessToken: string): Promise<AccessTokenPayload | null> {
		try {
			const accessTokenPayload = await authService.verifyAccessToken(accessToken);
			if (accessTokenPayload?.user_id) {
				// console.log('accessTokenPayload', accessTokenPayload);
				console.log(new Date(Date.now()).toISOString());
				return accessTokenPayload;
			}
			return null;
		} catch (error) {
			console.error(`Error getting user Local info: ${error}`);
			// console.error(`Error getting user info: ${error}`);
			return null;
		}
	}

	async getId(accessToken: string) {
		try {
			const accessTokenPayload = await authService.verifyAccessToken(accessToken);
			if (accessTokenPayload?.user_id) {
				return accessTokenPayload.user_id;
			}
		} catch (error) {
			console.error(`Error getting user id: ${error}`);
			return null;
		}
	}

	async getRoles(accessToken: string) {
		try {
			const accessTokenPayload = await authService.verifyAccessToken(accessToken);
			if (accessTokenPayload?.user_role) {
				return accessTokenPayload.user_role;
			}
		} catch (error) {
			console.error(`Error getting user roles: ${error}`);
			return null;
		}
	}
}

const userService = new UserService();
export default userService;
export function getInfo(accessToken: string) {
	throw new Error('Function not implemented.');
}
