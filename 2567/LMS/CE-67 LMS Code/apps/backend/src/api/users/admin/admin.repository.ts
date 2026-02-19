import { prisma } from '@/common/utils/database.util';
import type { Prisma, PrismaClient, admins, users } from '@prisma/client';

import { UserSchema } from '@shared/types/users/user.model';

class AdminRepository {
	private database: PrismaClient;

	constructor() {
		this.database = prisma;
	}

	async findAdminByUserID(user_id: string): Promise<{ success: boolean; data?: admins | null; error?: string }> {
		try {
			// Validate input
			const parsedUserId = UserSchema.shape.user_id.safeParse(user_id);
			if (!parsedUserId.success) {
				return { success: false, error: 'Invalid user ID provided' };
			}

			// Query admin with related user data
			const admin = await this.database.admins.findUnique({
				where: { user_id },
				include: {
					users: true,
				},
			});

			// Check if admin is found
			if (!admin) {
				return { success: true, data: null, error: 'Admin not found' };
			}

			return {
				success: true,
				data: admin,
			};
		} catch (error) {
			const headerMessage = '[users repository] findAdminByUserID';
			// Log error and preserve stack trace
			if (error instanceof Error) {
				console.error(`${headerMessage}: ${error.message}`, error);
				return { success: false, error: error.message };
			}
			console.error(headerMessage, error); // Log unknown error
			return { success: false, error: 'An unexpected error occurred' };
		}
	}

	async findAllAdmins(
		limit: number,
		offset: number,
		sortBy: keyof admins = 'user_id',
		orderBy: 'asc' | 'desc' = 'asc',
		searchText?: string,
	): Promise<{
		success: boolean;
		data?: admins[];
		totalCount?: number;
		error?: string;
	}> {
		try {
			const where: Prisma.adminsWhereInput = {};

			// Handle searchText if provided (search in related user fields)
			if (searchText && searchText.trim() !== '') {
				where.users = {
					OR: [
						{ firstname_en: { contains: searchText, mode: 'insensitive' } },
						{ lastname_en: { contains: searchText, mode: 'insensitive' } },
						{ firstname_th: { contains: searchText, mode: 'insensitive' } },
						{ lastname_th: { contains: searchText, mode: 'insensitive' } },
						{ email: { contains: searchText, mode: 'insensitive' } },
					],
				};
			} else if (searchText === '') {
				return { success: true, data: [], totalCount: 0 };
			}
			// Fetch admins with their related user data and total count in parallel
			const [adminsData, totalCount] = await Promise.all([
				this.database.admins.findMany({
					where,
					take: limit,
					skip: offset,
					orderBy: {
						[sortBy]: orderBy,
					},
					include: {
						users: true,
					},
				}),
				this.database.admins.count({ where }),
			]);

			if (!adminsData) {
				return {
					success: false,
					data: [],
					totalCount,
					error: '[users repository] An error occurred while retrieving admins',
				};
			}

			if (adminsData.length === 0) {
				return {
					success: true,
					data: [],
					totalCount,
					error: 'No admins found',
				};
			}

			return { success: true, data: adminsData, totalCount };
		} catch (error) {
			const headerMessage = '[users repository] findAllAdmins';
			// Log error and preserve stack trace
			if (error instanceof Error) {
				console.error(`${headerMessage}: ${error.message}`, error);
				return { success: false, error: error.message };
			}
			console.error(headerMessage, error); // Log unknown error
			return { success: false, error: 'An unexpected error occurred' };
		}
	}
}

export const adminRepository = new AdminRepository();
