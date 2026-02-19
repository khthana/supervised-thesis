import type { Prisma, course_cycles, courses, cycle_access_emails, users } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { courseCycleRepository } from '@/api/courses/cycle/cycle.repository';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';

import {
	CourseCycle,
	CourseCycleSchema,
	CourseCycleTypeSchema,
	CycleAccessRoleSchema,
} from '@shared/types/courses/cycle.model';

import { validateEmail, validateUUID } from '@/common/validation/string.validation';
import type { CreateCourseCycle, UpdateCourseCycle } from '@shared/types/courses/cycle.model';

class CourseCycleService {
	private courseCycleRepository: typeof courseCycleRepository;

	constructor() {
		this.courseCycleRepository = courseCycleRepository;
	}

	async getCycleById(user: users, cycleId: string): Promise<ServiceResponse<course_cycles | null>> {
		if (!validateUUID(cycleId)) {
			return ServiceResponse.failure(
				'[CourseCycleService getCycleById] Invalid cycle ID',
				null,
				StatusCodes.BAD_REQUEST,
			);
		}

		try {
			const { success, data, error } = await this.courseCycleRepository.findCycleById(cycleId, user);
			if (!success) {
				return ServiceResponse.failure(
					error ?? '[CourseCycleService getCycleById] Something went wrong',
					null,
					StatusCodes.INTERNAL_SERVER_ERROR,
				);
			}
			if (!data) {
				return ServiceResponse.failure(
					'[CourseCycleService getCycleById] Course cycle not found',
					null,
					StatusCodes.NOT_FOUND,
				);
			}
			return ServiceResponse.success(
				'[CourseCycleService getCycleById] Course cycle retrieved successfully',
				data,
				StatusCodes.OK,
			);
		} catch (error) {
			logger.error('[CourseCycleService getCycleById] Error retrieving course cycle', error);
			return ServiceResponse.failure(
				'[CourseCycleService getCycleById] An error occurred while retrieving the course cycle',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async getAllCycle(user: users, courseId: string): Promise<ServiceResponse<course_cycles[]>> {
		if (!user || !user.user_id) {
			return ServiceResponse.failure('User not authenticated', [], StatusCodes.UNAUTHORIZED);
		}

		if (!validateUUID(user.user_id)) {
			return ServiceResponse.failure('[CourseCycleService getAllCycle] Invalid user ID', [], StatusCodes.BAD_REQUEST);
		}

		if (!validateEmail(user.email)) {
			return ServiceResponse.failure('[CourseCycleService getAllCycle] Invalid email', [], StatusCodes.BAD_REQUEST);
		}

		if (!validateUUID(courseId)) {
			return ServiceResponse.failure(
				'[CourseCycleService getAllCycle] Something went wrong',
				[],
				StatusCodes.BAD_REQUEST,
			);
		}

		try {
			const { success, data, error } = await this.courseCycleRepository.findAllCyclesByCourseId(user, courseId);
			if (!success) {
				return ServiceResponse.failure(
					error ?? '[CourseCycleService getAllCycle] Something went wrong',
					[],
					StatusCodes.INTERNAL_SERVER_ERROR,
				);
			}

			if (!data || data.length === 0) {
				return ServiceResponse.success('[CourseCycleService getAllCycle] No course cycles found', [], StatusCodes.OK);
			}

			return ServiceResponse.success(
				'[CourseCycleService getAllCycle] Course cycles retrieved successfully',
				data,
				StatusCodes.OK,
			);
		} catch (error) {
			logger.error('[CourseCycleService getAllCycle] Error retrieving course cycles', error);
			return ServiceResponse.failure(
				'[CourseCycleService getAllCycle] An error occurred while retrieving course cycles',
				[],
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async createCourseCycle(
		userMail: string,
		courseId: string,
		cycleData: UpdateCourseCycle,
	): Promise<ServiceResponse<course_cycles | null>> {
		if (!userMail || !courseId) {
			return ServiceResponse.failure(
				'[CourseCycleService createCourseCycle] User ID and Course ID are required',
				null,
				StatusCodes.BAD_REQUEST,
			);
		}

		if (!validateUUID(courseId)) {
			return ServiceResponse.failure(
				'[CourseCycleService createCourseCycle] Invalid course ID',
				null,
				StatusCodes.BAD_REQUEST,
			);
		}

		const PrismaCycleData: Prisma.course_cyclesCreateInput = {
			...cycleData,
			courses: {
				connect: {
					course_id: courseId,
				},
			},
		};

		try {
			const { success, data, error } = await this.courseCycleRepository.createCycle(
				userMail,
				courseId,
				PrismaCycleData,
			);
			if (!success) {
				return ServiceResponse.failure(
					error ?? '[CourseCycleService createCourseCycle] Something went wrong',
					null,
					StatusCodes.INTERNAL_SERVER_ERROR,
				);
			}

			return ServiceResponse.success(
				'[CourseCycleService createCourseCycle] Course cycle created successfully',
				data ?? null,
				StatusCodes.CREATED,
			);
		} catch (error) {
			logger.error('[CourseCycleService createCourseCycle] Error creating course cycle', error);
			return ServiceResponse.failure(
				'[CourseCycleService createCourseCycle] An error occurred while creating the course cycle',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async updateCourseCycle(
		cycleId: string,
		cycleData: UpdateCourseCycle,
	): Promise<ServiceResponse<course_cycles | null>> {
		if (!validateUUID(cycleId)) {
			return ServiceResponse.failure(
				'[CourseCycleService updateCourseCycle] Invalid cycle ID',
				null,
				StatusCodes.BAD_REQUEST,
			);
		}

		const PrismaCycleData: Prisma.course_cyclesUpdateInput = {
			...cycleData,
		};

		try {
			const { success, data, error } = await this.courseCycleRepository.updateCycle(cycleId, PrismaCycleData);
			if (!success) {
				return ServiceResponse.failure(
					error ?? '[CourseCycleService updateCourseCycle] Something went wrong',
					null,
					StatusCodes.INTERNAL_SERVER_ERROR,
				);
			}

			return ServiceResponse.success(
				'[CourseCycleService updateCourseCycle] Course cycle updated successfully',
				data ?? null,
				StatusCodes.OK,
			);
		} catch (error) {
			logger.error('[CourseCycleService updateCourseCycle] Error updating course cycle', error);
			return ServiceResponse.failure(
				'[CourseCycleService updateCourseCycle] An error occurred while updating the course cycle',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async deleteCourseCycle(userId: string, cycleId: string): Promise<ServiceResponse<course_cycles | null>> {
		if (!validateUUID(cycleId)) {
			return ServiceResponse.failure(
				'[CourseCycleService deleteCourseCycle] Invalid cycle ID',
				null,
				StatusCodes.BAD_REQUEST,
			);
		}

		if (!validateUUID(userId)) {
			return ServiceResponse.failure(
				'[CourseCycleService deleteCourseCycle] Invalid user ID',
				null,
				StatusCodes.BAD_REQUEST,
			);
		}

		try {
			const { success, data, error } = await this.courseCycleRepository.deleteCycle(cycleId, userId);
			if (!success) {
				return ServiceResponse.failure(
					error ?? '[CourseCycleService deleteCourseCycle] Something went wrong',
					null,
					StatusCodes.INTERNAL_SERVER_ERROR,
				);
			}

			return ServiceResponse.success(
				'[CourseCycleService deleteCourseCycle] Course cycle deleted successfully',
				data ?? null,
				StatusCodes.OK,
			);
		} catch (error) {
			logger.error('[CourseCycleService deleteCourseCycle] Error deleting course cycle', error);
			return ServiceResponse.failure(
				'[CourseCycleService deleteCourseCycle] An error occurred while deleting the course cycle',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}
}

export const courseCycleService = new CourseCycleService();
