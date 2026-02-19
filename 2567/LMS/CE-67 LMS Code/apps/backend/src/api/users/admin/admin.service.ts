import type { Prisma, admins, users } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { adminRepository } from '@/api/users/admin/admin.repository';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';

class AdminService {
	private adminRepository: typeof adminRepository;

	constructor() {
		this.adminRepository = adminRepository;
	}

	async getAdmins(
		limit: number,
		offset: number,
		sortBy: keyof admins = 'user_id',
		orderBy: 'asc' | 'desc' = 'asc',
		searchText?: string,
	): Promise<ServiceResponse<{ admins: admins[]; totalCount: number }>> {
		try {
			const { success, data, error, totalCount } = await this.adminRepository.findAllAdmins(
				limit,
				offset,
				sortBy,
				orderBy,
				searchText,
			);

			if (!success) {
				if (error) {
					return ServiceResponse.failure(error, { admins: [], totalCount: 0 }, StatusCodes.INTERNAL_SERVER_ERROR);
				}
				return ServiceResponse.failure(
					'Something went wrong',
					{ admins: [], totalCount: 0 },
					StatusCodes.INTERNAL_SERVER_ERROR,
				);
			}

			if (!data || data.length === 0) {
				return ServiceResponse.success('No admins found', { admins: [], totalCount: 0 }, StatusCodes.NOT_FOUND);
			}

			// Transform data to match the expected format
			const transformedData = data.map((admin) => ({
				...admin,
			}));

			// Return only the admin data without the users
			return ServiceResponse.success('Admins found', { admins: data, totalCount: totalCount ?? 0 });
		} catch (error) {
			const errorMessage = `Error finding admins: ${(error as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure(
				'An error occurred while retrieving admins.',
				{ admins: [], totalCount: 0 },
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async getAdminById(user_id: string): Promise<ServiceResponse<admins | null>> {
		try {
			const { success, data, error } = await this.adminRepository.findAdminByUserID(user_id);
			if (!success) {
				if (error) {
					return ServiceResponse.failure(error, null, StatusCodes.INTERNAL_SERVER_ERROR);
				}
				return ServiceResponse.failure('Something went wrong', null, StatusCodes.INTERNAL_SERVER_ERROR);
			}

			if (!data) {
				return ServiceResponse.success('No admin found', null, StatusCodes.NOT_FOUND);
			}

			return ServiceResponse.success('Admin found', data);
		} catch (error) {
			const errorMessage = `Error finding admin by ID: ${(error as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure(
				'An error occurred while retrieving admin.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}
}

export const adminService = new AdminService();
