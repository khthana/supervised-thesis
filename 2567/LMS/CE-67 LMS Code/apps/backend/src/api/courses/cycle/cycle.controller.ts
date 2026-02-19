import { ServiceResponse } from '@/common/models/serviceResponse';
import { handleServiceResponse } from '@/common/utils/httpHandlers.util';
import { logger } from '@/server';
import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { courseCycleService } from '@/api/courses/cycle/cycle.service';
import { userService } from '@/api/users/user/user.service';
import { validateUUID } from '@/common/validation/string.validation';

import {
	type CreateCourseCycle,
	CreateCourseCycleSchema,
	type UpdateCourseCycle,
	UpdateCourseCycleSchema,
} from '@shared/types/courses/cycle.model';

class CourseCycleController {
	public getCourseCycleByID: RequestHandler = async (req: Request, res: Response) => {
		if (!req.user) {
			return handleServiceResponse(
				ServiceResponse.failure('[Controller] User not authenticated', null, StatusCodes.UNAUTHORIZED),
				res,
			);
		}

		const userRequest = req.user;

		const userServiceResponse = await userService.getUserByID(userRequest.user_id);
		if (!userServiceResponse.success) {
			return handleServiceResponse(userServiceResponse, res);
		}
		if (!userServiceResponse.responseObject) {
			return handleServiceResponse(
				ServiceResponse.failure('[Controller] User not found', null, StatusCodes.NOT_FOUND),
				res,
			);
		}
		const user = userServiceResponse.responseObject;
		if (!req.validatedData || !req.validatedData.params) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Invalid request data', null), res);
		}
		const { params } = req.validatedData;
		const { cycle_id } = params;
		if (!cycle_id) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Cycle ID is required', null), res);
		}
		if (!validateUUID(cycle_id)) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Invalid Cycle ID', null), res);
		}
		try {
			const serviceResponse = await courseCycleService.getCycleById(user, cycle_id);
			return handleServiceResponse(serviceResponse, res);
		} catch (error) {
			logger.error('[Controller] Error in getCourseCycleByID', error);
			return handleServiceResponse(
				ServiceResponse.failure('[Controller] Internal server error', null, StatusCodes.INTERNAL_SERVER_ERROR),
				res,
			);
		}
	};

	public getCourseCycles: RequestHandler = async (req: Request, res: Response) => {
		if (!req.user) {
			return handleServiceResponse(
				ServiceResponse.failure('[Controller] User not authenticated', null, StatusCodes.UNAUTHORIZED),
				res,
			);
		}

		const userRequest = req.user;

		const userResponse = await userService.getUserByID(userRequest.user_id);
		if (!userResponse.success) {
			return handleServiceResponse(userResponse, res);
		}

		if (!userResponse.responseObject) {
			return handleServiceResponse(
				ServiceResponse.failure('[Controller] User not found', null, StatusCodes.NOT_FOUND),
				res,
			);
		}

		const user = userResponse.responseObject;

		if (!req.validatedData || !req.validatedData.params) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Invalid request data', null), res);
		}

		const { params } = req.validatedData;
		const { course_id } = params;

		if (!course_id) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Course ID is required', null), res);
		}

		if (!validateUUID(course_id)) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Invalid Course ID', null), res);
		}

		try {
			const serviceResponse = await courseCycleService.getAllCycle(user, course_id);
			return handleServiceResponse(serviceResponse, res);
		} catch (error) {
			logger.error('[Controller] Error in getCourseCycles', error);
			return handleServiceResponse(
				ServiceResponse.failure('[Controller] Internal server error', null, StatusCodes.INTERNAL_SERVER_ERROR),
				res,
			);
		}
	};

	public createCourseCycle: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
		if (!req.user) {
			return handleServiceResponse(
				ServiceResponse.failure('[Controller] User not authenticated', null, StatusCodes.UNAUTHORIZED),
				res,
			);
		}

		const userRequest = req.user;

		const userResponse = await userService.getUserByID(userRequest.user_id);
		if (!userResponse.success) {
			return handleServiceResponse(userResponse, res);
		}

		if (!userResponse.responseObject) {
			return handleServiceResponse(
				ServiceResponse.failure('[Controller] User not found', null, StatusCodes.NOT_FOUND),
				res,
			);
		}

		const user = userResponse.responseObject;

		if (!req.validatedData || !req.validatedData.body || !req.validatedData.params) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Invalid request data', null), res);
		}

		const { params, body } = req.validatedData;
		const { course_id } = params;

		if (!course_id) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Course ID is required', null), res);
		}

		// if (
		// 	!body.name ||
		// 	!body.is_always_enroll ||
		// 	!body.is_always_open ||
		// 	!body.is_restrict_enroll ||
		// 	!body.max_enrollments ||
		// 	!body.course_type ||
		// 	!body.status ||
		// 	!body.enroll_start ||
		// 	!body.cycle_start
		// ) {
		// 	return handleServiceResponse(ServiceResponse.failure('[Controller] All fields are required', null), res);
		// }

		if (!validateUUID(course_id)) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Invalid Course ID', null), res);
		}

		const cycleData: CreateCourseCycle = {
			name: body.name,
			is_always_enroll: body.is_always_enroll,
			is_always_open: body.is_always_open,
			is_restrict_enroll: body.is_restrict_enroll,
			max_enrollments: body.max_enrollments,
			course_type: body.course_type,
			status: body.status,
			enroll_start: body.enroll_start,
			enroll_end: body.enroll_end,
			cycle_start: body.cycle_start,
			cycle_end: body.cycle_end,
		};

		const cycleDataValidation = CreateCourseCycleSchema.safeParse(cycleData);
		if (!cycleDataValidation.success) {
			return handleServiceResponse(
				ServiceResponse.failure('[Controller] Invalid cycle data', cycleDataValidation.error.errors),
				res,
			);
		}

		try {
			const serviceResponse = await courseCycleService.createCourseCycle(
				user.email,
				course_id,
				cycleDataValidation.data,
			);
			return handleServiceResponse(serviceResponse, res);
		} catch (error) {
			logger.error('[Controller] Error in createCourseCycle', error);
			return handleServiceResponse(
				ServiceResponse.failure('[Controller] Internal server error', null, StatusCodes.INTERNAL_SERVER_ERROR),
				res,
			);
		}
	};

	public updateCourseCycle: RequestHandler = async (req: Request, res: Response) => {
		if (!req.user) {
			return handleServiceResponse(
				ServiceResponse.failure('[Controller] User not authenticated', null, StatusCodes.UNAUTHORIZED),
				res,
			);
		}

		const userRequest = req.user;

		const userResponse = await userService.getUserByID(userRequest.user_id);
		if (!userResponse.success) {
			return handleServiceResponse(userResponse, res);
		}

		if (!userResponse.responseObject) {
			return handleServiceResponse(
				ServiceResponse.failure('[Controller] User not found', null, StatusCodes.NOT_FOUND),
				res,
			);
		}

		const user = userResponse.responseObject;
		if (!user) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] User not found', null), res);
		}
		if (!user.user_id) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] User ID not found', null), res);
		}

		// check if user is owner of the course
		if (!req.course) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Course not found', null), res);
		}

		if (user.user_id !== req.course.created_by) {
			return handleServiceResponse(
				ServiceResponse.failure('[Controller] User is not the owner of the course', null, StatusCodes.FORBIDDEN),
				res,
			);
		}

		if (!req.validatedData || !req.validatedData.params || !req.validatedData.body) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Invalid request data', null), res);
		}

		const { params, body } = req.validatedData;
		const { cycle_id } = params;

		if (!cycle_id) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Cycle ID is required', null), res);
		}

		if (
			!body.name ||
			!body.is_always_enroll ||
			!body.is_always_open ||
			!body.is_restrict_enroll ||
			!body.max_enrollments ||
			!body.course_type ||
			!body.status ||
			!body.enroll_start ||
			!body.cycle_start
		) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] All fields are required', null), res);
		}

		if (!validateUUID(cycle_id)) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Invalid Cycle ID', null), res);
		}

		const cycleData: UpdateCourseCycle = {
			name: body.name,
			is_always_enroll: body.is_always_enroll,
			is_always_open: body.is_always_open,
			is_restrict_enroll: body.is_restrict_enroll,
			max_enrollments: body.max_enrollments,
			course_type: body.course_type,
			status: body.status,
			enroll_start: body.enroll_start,
			enroll_end: body.enroll_end,
			cycle_start: body.cycle_start,
			cycle_end: body.cycle_end,
		};

		const cycleDataValidation = UpdateCourseCycleSchema.safeParse(cycleData);
		if (!cycleDataValidation.success) {
			return handleServiceResponse(
				ServiceResponse.failure('[Controller] Invalid cycle data', cycleDataValidation.error.errors),
				res,
			);
		}

		try {
			const serviceResponse = await courseCycleService.updateCourseCycle(cycle_id, cycleDataValidation.data);
			return handleServiceResponse(serviceResponse, res);
		} catch (error) {
			logger.error('[Controller] Error in updateCourseCycle', error);
			return handleServiceResponse(
				ServiceResponse.failure('[Controller] Internal server error', null, StatusCodes.INTERNAL_SERVER_ERROR),
				res,
			);
		}
	};

	public deleteCourseCycle: RequestHandler = async (req: Request, res: Response) => {
		if (!req.user) {
			return handleServiceResponse(
				ServiceResponse.failure('[Controller] User not authenticated', null, StatusCodes.UNAUTHORIZED),
				res,
			);
		}

		const userRequest = req.user;

		const userResponse = await userService.getUserByID(userRequest.user_id);
		if (!userResponse.success) {
			return handleServiceResponse(userResponse, res);
		}

		if (!userResponse.responseObject) {
			return handleServiceResponse(
				ServiceResponse.failure('[Controller] User not found', null, StatusCodes.NOT_FOUND),
				res,
			);
		}

		const user = userResponse.responseObject;
		if (!user) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] User not found', null), res);
		}
		if (!user.user_id) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] User ID not found', null), res);
		}

		if (!req.course) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Course not found', null), res);
		}

		if (user.user_id !== req.course.created_by) {
			return handleServiceResponse(
				ServiceResponse.failure('[Controller] User is not the owner of the course', null, StatusCodes.FORBIDDEN),
				res,
			);
		}

		if (!req.validatedData || !req.validatedData.params) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Invalid request data', null), res);
		}

		const { params } = req.validatedData;
		const { cycle_id } = params;

		if (!cycle_id) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Cycle ID is required', null), res);
		}

		if (!validateUUID(cycle_id)) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Invalid Cycle ID', null), res);
		}

		try {
			const serviceResponse = await courseCycleService.deleteCourseCycle(user.user_id, cycle_id);
			return handleServiceResponse(serviceResponse, res);
		} catch (error) {
			logger.error('[Controller] Error in deleteCourseCycle', error);
			return handleServiceResponse(
				ServiceResponse.failure('[Controller] Internal server error', null, StatusCodes.INTERNAL_SERVER_ERROR),
				res,
			);
		}
	};
}

export const courseCycleController = new CourseCycleController();
