import type { UserTypes } from '@/interfaces/sharetype';
import { getPublicEnv } from '@/lib/env.client';

export async function fetchUsers(): Promise<UserTypes[]> {
	try {
		const env = getPublicEnv();
		const response = await fetch(`${env.BACKEND_URL}/api/users`);

		console.log('API Response status:', response.status);

		if (!response.ok) {
			throw new Error(`Error fetching users: ${response.statusText}`);
		}

		const data = await response.json();
		console.log('Raw API data:', data);

		if (data?.responseObject?.users && Array.isArray(data.responseObject.users)) {
			return data.responseObject.users;
		}

		console.error('Invalid data structure:', data);
		return [];
	} catch (error) {
		console.error('Failed to fetch users:', error);
		throw error;
	}
}

/**
 * Update a single user in the API
 */
// export async function updateUser(user: UserTypes): Promise<ApiResponse<UserTypes>> {
//   try {
//     const response = await fetch(`${API_URL}/${user.user_id}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(user),
//     });

//     if (!response.ok) {
//       throw new Error(`Error updating user: ${response.statusText}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error(`Failed to update user ID ${user.user_id}:`, error);
//     throw error;
//   }
// }

/**
 * Update multiple users in the API (bulk update)
 */
// export async function updateUsers(users: UserTypes[]): Promise<ApiResponse<UserTypes[]>> {
//   try {
//     const response = await fetch(`${API_URL}/bulk`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ users }),
//     });

//     if (!response.ok) {
//       throw new Error(`Error updating users: ${response.statusText}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error('Failed to update users:', error);
//     throw error;
//   }
// }

/**
 * Delete a user from the API
 */
// export async function deleteUser(userId: number): Promise<ApiResponse<null>> {
//   try {
//     const response = await fetch(`${API_URL}/${userId}`, {
//       method: 'DELETE',
//     });

//     if (!response.ok) {
//       throw new Error(`Error deleting user: ${response.statusText}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error(`Failed to delete user ID ${userId}:`, error);
//     throw error;
//   }
// }
