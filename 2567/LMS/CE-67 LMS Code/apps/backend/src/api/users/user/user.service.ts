import type { Prisma, admins, users } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { userRepository } from '@/api/users/user/user.repository';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';
import type { UserRegister } from '@shared/types/auth.model';

import type { User } from '@shared/types/users/user.model';

class UserService {
	private userRepository: typeof userRepository;

	constructor() {
		this.userRepository = userRepository;
	}

	/**
	 * Retrieves all users from the database
	 * @param limit - The number of users to retrieve
	 * @param offset - The number of users to skip
	 * @param sortBy - The field to sort by
	 * @param orderBy - The order to sort by
	 * @param searchText - The text to search for
	 * @returns A ServiceResponse containing the users and total count eg. { data: users[], totalCount: number }
	 */
	async getAllUsers(
		limit: number,
		offset: number,
		sortBy: keyof users = 'user_id',
		orderBy: 'asc' | 'desc' = 'asc',
		searchText?: string,
	): Promise<ServiceResponse<{ users: users[]; totalCount: number }>> {
		try {
			const { success, data, totalCount, error } = await this.userRepository.findAllUsersWithAvatars(
				limit,
				offset,
				sortBy,
				orderBy,
				searchText,
			);
			if (!success) {
				if (error) {
					return ServiceResponse.failure(error, { users: [], totalCount: 0 }, StatusCodes.INTERNAL_SERVER_ERROR);
				}
				return ServiceResponse.failure(
					'Something went wrong',
					{ users: [], totalCount: 0 },
					StatusCodes.INTERNAL_SERVER_ERROR,
				);
			}

			if (!data || data.length === 0) {
				return ServiceResponse.success('No users found', {
					users: [],
					totalCount: totalCount ?? 0,
				});
			}

			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			// const usersData: User[] = data.map((user: any) => ({
			// 	...user,
			// 	created_at: user.created_at instanceof Date ? user.created_at.toISOString() : user.created_at,
			// 	updated_at: user.updated_at instanceof Date ? user.updated_at.toISOString() : user.updated_at,
			// 	avatar: user.avatar
			// 		? {
			// 				...user.avatar,
			// 				created_at:
			// 					user.avatar.created_at instanceof Date ? user.avatar.created_at.toISOString() : user.avatar.created_at,
			// 				updated_at:
			// 					user.avatar.updated_at instanceof Date ? user.avatar.updated_at.toISOString() : user.avatar.updated_at,
			// 			}
			// 		: null,
			// }));

			return ServiceResponse.success('Users found', {
				users: data,
				totalCount: totalCount ?? 0,
			});
		} catch (error) {
			const errorMessage = `Error finding all users: ${(error as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure(
				'An error occurred while retrieving users.',
				{ users: [], totalCount: 0 },
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	/**
	 * Retrieves a user from the database by ID
	 * @param user_id - The ID of the user to retrieve
	 * @returns A ServiceResponse containing the user eg. { data: users }
	 */
	async getUserByID(user_id: string): Promise<ServiceResponse<users | null>> {
		try {
			const { success, data, error } = await this.userRepository.findUserByID(user_id);
			if (!success) {
				if (error) {
					return ServiceResponse.failure(error, null, StatusCodes.INTERNAL_SERVER_ERROR);
				}
				return ServiceResponse.failure('Something went wrong', null, StatusCodes.INTERNAL_SERVER_ERROR);
			}

			if (!data) {
				return ServiceResponse.failure('No user found', null, StatusCodes.NOT_FOUND);
			}

			if (!data.is_active) {
				return ServiceResponse.failure('User is inactive', null, StatusCodes.FORBIDDEN);
			}

			// Create a copy of data with ISO string formatted dates
			// const userData = {
			// 	...data,
			// 	created_at: data.created_at instanceof Date ? data.created_at.toISOString() : data.created_at,
			// 	updated_at: data.updated_at instanceof Date ? data.updated_at.toISOString() : data.updated_at,
			// };

			return ServiceResponse.success('User found', data);
		} catch (error) {
			const errorMessage = `Error finding user by ID: ${(error as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure(
				'An error occurred while retrieving user.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	/**
	 * Retrieves a user from the database by email
	 * @param email - The email of the user to retrieve
	 * @returns A ServiceResponse containing the user e.g. { data: users }
	 */
	async getUserByEmail(email: string): Promise<ServiceResponse<User | null>> {
		try {
			const data = await this.userRepository.findUserByEmail(email);

			if (!data) {
				return ServiceResponse.failure('No user found', null, StatusCodes.NOT_FOUND);
			}

			if (!data.is_active) {
				return ServiceResponse.failure('User is inactive', null, StatusCodes.FORBIDDEN);
			}

			// Create a copy of data with ISO string formatted dates
			const userData = {
				...data,
				created_at: data.created_at instanceof Date ? data.created_at.toISOString() : data.created_at,
				updated_at: data.updated_at instanceof Date ? data.updated_at.toISOString() : data.updated_at,
			};

			return ServiceResponse.success('User found', userData);
		} catch (error) {
			const errorMessage = `Error finding user by email: ${(error as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure(
				'An error occurred while retrieving user.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async createUser(userRegisterInput: UserRegister): Promise<ServiceResponse<User | null>> {
		const isEmailExist = await this.userRepository.findUserByEmail(userRegisterInput.email);
		if (isEmailExist) {
			return ServiceResponse.failure('Email already exists', null, StatusCodes.CONFLICT);
		}

		try {
			const hashUserPassword = await Bun.password.hash(userRegisterInput.password, {
				algorithm: 'argon2id', // the algorithm to use
				memoryCost: 20 * 1024, // memory usage in kibibytes
				timeCost: 2, // the number of iterations
			});

			// convert userRegisterInput to Prisma.usersCreateInput
			const user: Prisma.usersCreateInput = {
				email: userRegisterInput.email,
				firstname_en: userRegisterInput.firstname_en,
				lastname_en: userRegisterInput.lastname_en,
				password_hash: hashUserPassword,
				user_role: userRegisterInput.user_role,
			};

			const { success, data, error } = await this.userRepository.createUser(user);
			if (!success) {
				if (error) {
					return ServiceResponse.failure(error, null, StatusCodes.INTERNAL_SERVER_ERROR);
				}
				return ServiceResponse.failure('Something went wrong', null, StatusCodes.INTERNAL_SERVER_ERROR);
			}

			if (!data) {
				return ServiceResponse.failure('User not registered', null, StatusCodes.INTERNAL_SERVER_ERROR);
			}

			// Create a copy of data with ISO string formatted dates
			const userData = {
				...data,
				created_at: data.created_at instanceof Date ? data.created_at.toISOString() : data.created_at,
				updated_at: data.updated_at instanceof Date ? data.updated_at.toISOString() : data.updated_at,
			};

			return ServiceResponse.success('User registered', userData);
		} catch (error) {
			const errorMessage = `Error registering user: ${(error as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure(
				'An error occurred while registering user.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async updateUser(user_id: string, user: Prisma.usersUpdateInput): Promise<ServiceResponse<User | null>> {
		try {
			const { success, data, error } = await this.userRepository.updateUser(user_id, user);
			if (!success) {
				if (error) {
					return ServiceResponse.failure(error, null, StatusCodes.INTERNAL_SERVER_ERROR);
				}
				return ServiceResponse.failure('Something went wrong', null, StatusCodes.INTERNAL_SERVER_ERROR);
			}

			if (!data) {
				return ServiceResponse.failure('User not found', null, StatusCodes.NOT_FOUND);
			}

			if (!data.is_active) {
				return ServiceResponse.failure('User is inactive', null, StatusCodes.FORBIDDEN);
			}

			// Create a copy of data with ISO string formatted dates
			const userData = {
				...data,
				created_at: data.created_at instanceof Date ? data.created_at.toISOString() : data.created_at,
				updated_at: data.updated_at instanceof Date ? data.updated_at.toISOString() : data.updated_at,
			};

			return ServiceResponse.success('User updated', userData);
		} catch (error) {
			const errorMessage = `Error updating user: ${(error as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure('An error occurred while updating user.', null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}
}

export const userService = new UserService();
