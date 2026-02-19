import { prisma } from '@/common/utils/database.util';
import { env } from '@/common/utils/envConfig.util';
import { validateUUID } from '@/common/validation/string.validation';
import type { Prisma, PrismaClient, admins, media_files, users } from '@prisma/client';

class UserRepository {
	private database: PrismaClient;

	constructor() {
		this.database = prisma;
	}

	async findAllUsersWithAvatars(
		limit: number,
		offset: number,
		sortBy: keyof users = 'user_id',
		orderBy: 'asc' | 'desc' = 'asc',
		searchText?: string,
	): Promise<{
		success: boolean;
		data?: (users & { avatar: media_files | null })[];
		totalCount?: number;
		error?: string;
	}> {
		try {
			const where: Prisma.usersWhereInput = {};

			// Handle searchText if provided
			if (searchText && searchText.trim() !== '') {
				where.OR = [
					{ firstname_en: { contains: searchText, mode: 'insensitive' } },
					{ lastname_en: { contains: searchText, mode: 'insensitive' } },
					{ firstname_th: { contains: searchText, mode: 'insensitive' } },
					{ lastname_th: { contains: searchText, mode: 'insensitive' } },
					{ email: { contains: searchText, mode: 'insensitive' } },
				];
			} else if (searchText === '') {
				return { success: true, data: [], totalCount: 0 };
			}

			// Fetch users and total count in parallel
			const [data, totalCount] = await Promise.all([
				this.database.users.findMany({
					where,
					take: limit,
					skip: offset,
					orderBy: { [sortBy]: orderBy },
				}),
				this.database.users.count({ where }),
			]);

			if (!data) {
				return {
					success: false,
					data: [],
					totalCount,
					error: '[users repository] An error occurred while retrieving users',
				};
			}

			if (data.length === 0) {
				return {
					success: true,
					data: [],
					totalCount,
					error: 'No users found',
				};
			}

			const usersWithAvatars = await Promise.all(
				data.map(async (user) => {
					const avatar = await this.database.media_files.findFirst({
						where: {
							reference_id: user.user_id,
							reference_type: 'USER_AVATAR',
						},
					});

					const fullAvatarUrl = avatar ? `${env.MEDIA_SERVER_URL}/${avatar.url}` : '';

					return {
						...user,
						avatar: avatar ? { ...avatar, url: fullAvatarUrl } : null,
					};
				}),
			);

			return { success: true, data: usersWithAvatars, totalCount };
		} catch (error) {
			const headerMessage = '[users repository] findAll';
			// Log error and preserve stack trace
			if (error instanceof Error) {
				console.error(`${headerMessage}: ${error.message}`, error);
				return { success: false, error: error.message };
			}
			console.error(headerMessage, error); // Log unknown error
			return { success: false, error: 'An unexpected error occurred' };
		}
	}

	async findAllUsers(
		limit: number,
		offset: number,
		sortBy: keyof users = 'user_id',
		orderBy: 'asc' | 'desc' = 'asc',
		searchText?: string,
	): Promise<{
		success: boolean;
		data?: users[];
		totalCount?: number;
		error?: string;
	}> {
		try {
			const where: Prisma.usersWhereInput = {};

			// Handle searchText if provided
			if (searchText && searchText.trim() !== '') {
				where.OR = [
					{ firstname_en: { contains: searchText, mode: 'insensitive' } },
					{ lastname_en: { contains: searchText, mode: 'insensitive' } },
					{ firstname_th: { contains: searchText, mode: 'insensitive' } },
					{ lastname_th: { contains: searchText, mode: 'insensitive' } },
					{ email: { contains: searchText, mode: 'insensitive' } },
				];
			} else if (searchText === '') {
				return { success: true, data: [], totalCount: 0 };
			}

			// Fetch users and total count in parallel
			const [data, totalCount] = await Promise.all([
				this.database.users.findMany({
					where,
					take: limit,
					skip: offset,
					orderBy: { [sortBy]: orderBy },
				}),
				this.database.users.count({ where }),
			]);

			if (!data) {
				return {
					success: false,
					data: [],
					totalCount,
					error: '[users repository] An error occurred while retrieving users',
				};
			}

			if (data.length === 0) {
				return {
					success: true,
					data: [],
					totalCount,
					error: 'No users found',
				};
			}

			return { success: true, data, totalCount };
		} catch (error) {
			const headerMessage = '[users repository] findAll';
			// Log error and preserve stack trace
			if (error instanceof Error) {
				console.error(`${headerMessage}: ${error.message}`, error);
				return { success: false, error: error.message };
			}
			console.error(headerMessage, error); // Log unknown error
			return { success: false, error: 'An unexpected error occurred' };
		}
	}

	async findUserByID(
		user_id: string,
	): Promise<{ success: boolean; data?: users & { avatar: media_files | null }; error?: string }> {
		try {
			// Validate input with zod
			if (!validateUUID(user_id)) {
				return { success: false, error: 'Invalid user ID provided' };
			}

			// Query user
			const user = await this.database.users.findUnique({ where: { user_id } });

			// Check if user is found
			if (!user) {
				return { success: true, data: undefined, error: 'User not found' };
			}

			// Get avatar for the user
			const avatar = await this.database.media_files.findFirst({
				where: {
					reference_id: user.user_id,
					reference_type: 'USER_AVATAR',
				},
			});

			const fullAvatarUrl = avatar ? `${env.MEDIA_SERVER_URL}/${avatar.url}` : '';

			// Return user with avatar
			return {
				success: true,
				data: {
					...user,
					avatar: avatar ? { ...avatar, url: fullAvatarUrl } : null,
				},
			};
		} catch (error) {
			const headerMessage = '[users repository] findById';
			// Log error and preserve stack trace
			if (error instanceof Error) {
				console.error(`${headerMessage}: ${error.message}`, error);
				return { success: false, error: error.message };
			}
			console.error(headerMessage, error); // Log unknown error
			return { success: false, error: 'An unexpected error occurred' };
		}
	}

	async findUserByEmail(email: string): Promise<users | null> {
		try {
			return await this.database.users.findUnique({ where: { email } });
		} catch (error) {
			const headerMessage = '[users repository] findByEmail';
			if (error instanceof Error) {
				throw new Error(`${headerMessage}: ${error.message}`);
			}
			throw new Error(`${headerMessage}`);
		}
	}

	async createUser(userData: Prisma.usersCreateInput): Promise<{ success: boolean; data?: users; error?: string }> {
		try {
			// Optional: Validate userData before proceeding
			// if (!userData || !userData.email || !userData.name) {
			// 	return { success: false, error: 'Invalid user data provided' };
			// }

			const user = await this.database.users.create({ data: userData });
			return { success: true, data: user };
		} catch (error) {
			const headerMessage = '[users repository] create';
			// Preserve stack trace for better debugging
			if (error instanceof Error) {
				console.error(`${headerMessage}: ${error.message}`, error); // Log error
				return { success: false, error: error.message };
			}
			console.error(headerMessage, error); // Log unknown errors
			return { success: false, error: 'An unexpected error occurred' };
		}
	}

	async updateUser(
		user_id: string,
		userData: Prisma.usersUpdateInput,
	): Promise<{ success: boolean; data?: users; error?: string }> {
		try {
			// Validate input

			const user = await this.database.users.update({
				where: { user_id },
				data: userData,
			});

			if (!user) {
				return { success: false, error: 'User not found' };
			}
			return { success: true, data: user };
		} catch (error) {
			const headerMessage = '[users repository] update';
			if (error instanceof Error) {
				console.error(`${headerMessage}: ${error.message}`, error); // Log error
				return { success: false, error: error.message };
			}
			console.error(headerMessage, error); // Log unknown errors
			return { success: false, error: 'An unexpected error occurred' };
		}
	}

	async deleteUser(user_id: string): Promise<{ success: boolean; error?: string }> {
		try {
			// Validate input
			if (!validateUUID(user_id)) {
				return { success: false, error: 'Invalid user ID provided' };
			}

			const user = await this.database.users.delete({ where: { user_id } });

			if (!user) {
				return { success: false, error: 'User not found' };
			}
			return { success: true };
		} catch (error) {
			const headerMessage = '[users repository] delete';
			if (error instanceof Error) {
				console.error(`${headerMessage}: ${error.message}`, error); // Log error
				return { success: false, error: error.message };
			}
			console.error(headerMessage, error); // Log unknown errors
			return { success: false, error: 'An unexpected error occurred' };
		}
	}

	async deactivateUser(user_id: string): Promise<{ success: boolean; error?: string }> {
		try {
			// Validate input
			if (!validateUUID(user_id)) {
				return { success: false, error: 'Invalid user ID provided' };
			}

			const user = await this.database.users.update({
				where: { user_id },
				data: { is_active: false },
			});

			if (!user) {
				return { success: false, error: 'User not found' };
			}
			return { success: true };
		} catch (error) {
			const headerMessage = '[users repository] deactivate';
			if (error instanceof Error) {
				console.error(`${headerMessage}: ${error.message}`, error); // Log error
				return { success: false, error: error.message };
			}
			console.error(headerMessage, error); // Log unknown errors
			return { success: false, error: 'An unexpected error occurred' };
		}
	}
}

export const userRepository = new UserRepository();
