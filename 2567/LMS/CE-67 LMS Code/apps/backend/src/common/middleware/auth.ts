import { ServiceResponse } from '@/common/models/serviceResponse';
import { env } from '@/common/utils/envConfig.util';
import { handleServiceResponse } from '@/common/utils/httpHandlers.util';
import { tokenUtils } from '@/common/utils/token.util';
import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { courseService } from '@/api/courses/course/course.service';
import { courseCycleService } from '@/api/courses/cycle/cycle.service';
import { adminService } from '@/api/users/admin/admin.service';
import { validateUUID } from '@/common/validation/string.validation';

import { z } from 'zod';

import { userService } from '@/api/users/user/user.service';
import { logger } from '@/server';
import type { AccessTokenPayload } from '@shared/types/auth.model';

const _accessTokenSecret = env.ACCESS_TOKEN_SECRET;
const accessTokenPublic = env.ACCESS_TOKEN_PUBLIC;
const _accessTokenEXP = env.ACCESS_TOKEN_EXP;
const _refreshTokenPublic = env.REFRESH_TOKEN_PUBLIC;

export const authenticate: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
	const accessToken = req.headers.authorization?.replace('Bearer ', '');
	if (!accessToken) {
		return handleServiceResponse(
			ServiceResponse.failure('Access token is missing', null, StatusCodes.UNAUTHORIZED),
			res,
		);
	}

	try {
		const decoded = await tokenUtils.verifyAccessToken(accessTokenPublic, accessToken);
		if (!decoded) {
			return handleServiceResponse(
				ServiceResponse.failure('Invalid access token', null, StatusCodes.UNAUTHORIZED),
				res,
			);
		}
		req.user = decoded as AccessTokenPayload;
		return next();
	} catch (_error) {
		const refreshToken = req.cookies.refreshToken;
		if (!refreshToken) {
			return handleServiceResponse(
				ServiceResponse.failure('Refresh token is missing', null, StatusCodes.UNAUTHORIZED),
				res,
			);
		}

		//TODO: Implement refresh token logic

		return handleServiceResponse(
			ServiceResponse.failure('[Authenticate] Internal Server Error', null, StatusCodes.INTERNAL_SERVER_ERROR),
			res,
		);
	}
};

export const authorizeAdmin = (cannotBypass = true) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const user = req.user;
		if (!user) {
			return handleServiceResponse(
				ServiceResponse.failure(
					'[AuthorizeAdmin] Please use the authenticate middleware before this',
					null,
					StatusCodes.UNAUTHORIZED,
				),
				res,
			);
		}

		const isAdmin = await adminService.getAdminById(user.user_id);

		if (!isAdmin || !isAdmin.responseObject?.is_active) {
			if (!cannotBypass) {
				req.isAdmin = false;
				return next();
			}
			return handleServiceResponse(
				ServiceResponse.failure('[AuthorizeAdmin] Unauthorized', null, StatusCodes.FORBIDDEN),
				res,
			);
		}

		req.isAdmin = true;
		return next();
	};
};

export const authorizeRole = (roles: string[]) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const user = req.user;
		if (!user) {
			return handleServiceResponse(
				ServiceResponse.failure(
					'[AuthorizeRole] Please use the authenticate middleware before this',
					null,
					StatusCodes.UNAUTHORIZED,
				),
				res,
			);
		}

		if (!roles.includes(user.user_role) && !req.isAdmin) {
			return handleServiceResponse(ServiceResponse.failure('Unauthorized', null, StatusCodes.FORBIDDEN), res);
		}

		return next();
	};
};

export const authorizeCourseEditor = async (req: Request, res: Response, next: NextFunction) => {
	const user = req.user;
	if (!user) {
		return handleServiceResponse(
			ServiceResponse.failure('[AuthorizeCourseEditor] User is not authenticated', null, StatusCodes.UNAUTHORIZED),
			res,
		);
	}

	if (!req.validatedData || !req.validatedData.params) {
		logger.error('[AuthorizeCourseEditor] Invalid request data or put middleware before validate request');
		return handleServiceResponse(
			ServiceResponse.failure('[AuthorizeCourseEditor] Invalid request data', null, StatusCodes.BAD_REQUEST),
			res,
		);
	}

	const { params } = req.validatedData;
	if (!params || !params.course_id) {
		return handleServiceResponse(
			ServiceResponse.failure('[AuthorizeCourseEditor] Course ID is required', null, StatusCodes.BAD_REQUEST),
			res,
		);
	}

	const { course_id } = params;
	//check course_id is uuid
	const courseIdSchema = z.string().uuid();
	const courseIdValidation = courseIdSchema.safeParse(course_id);
	if (!courseIdValidation.success) {
		return handleServiceResponse(
			ServiceResponse.failure('[AuthorizeCourseEditor] course_id must be UUID', null, StatusCodes.BAD_REQUEST),
			res,
		);
	}

	const courseResp = await courseService.getCourseByID(course_id);
	const { success, statusCode, responseObject } = courseResp;
	if (!success || !responseObject) {
		return handleServiceResponse(
			ServiceResponse.failure('[AuthorizeCourseEditor] Course not found', null, StatusCodes.NOT_FOUND),
			res,
		);
	}

	const course = responseObject;
	if (user.user_id !== course.created_by && !req.isAdmin) {
		return handleServiceResponse(
			ServiceResponse.failure('[AuthorizeCourseEditor] Unauthorized', null, StatusCodes.FORBIDDEN),
			res,
		);
	}

	req.course = {
		...course,
		subject_id: course.subject_id || undefined,
		description: course.description || undefined,
		created_at: course.created_at.toISOString(),
		updated_at: course.updated_at.toISOString(),
	};
	return next();
};

export const authorizeCycleEditor = async (req: Request, res: Response, next: NextFunction) => {
	const user = req.user;
	if (!user) {
		return handleServiceResponse(
			ServiceResponse.failure('[AuthorizeCycleEditor] User is not authenticated', null, StatusCodes.UNAUTHORIZED),
			res,
		);
	}

	if (!req.validatedData || !req.validatedData.params) {
		logger.error('[AuthorizeCycleEditor] Invalid request data or put middleware before validate request');
		return handleServiceResponse(
			ServiceResponse.failure('[AuthorizeCycleEditor] Invalid request data', null, StatusCodes.BAD_REQUEST),
			res,
		);
	}

	const { params } = req.validatedData;
	if (!params || !params.cycle_id) {
		return handleServiceResponse(
			ServiceResponse.failure('[AuthorizeCycleEditor] Cycle ID is required', null, StatusCodes.BAD_REQUEST),
			res,
		);
	}

	const { cycle_id } = params;

	if (!validateUUID(cycle_id)) {
		return handleServiceResponse(
			ServiceResponse.failure('[AuthorizeCycleEditor] cycle_id must be UUID', null, StatusCodes.BAD_REQUEST),
			res,
		);
	}

	// get cycle access email from cycle_id
	const userResponse = await userService.getUserByID(user.user_id);

	const userData = userResponse.responseObject;
	if (!userData) {
		return handleServiceResponse(
			ServiceResponse.failure('[AuthorizeCycleEditor] User not found', null, StatusCodes.NOT_FOUND),
			res,
		);
	}

	const cycleAccess = await courseCycleService.getCycleById(userData, cycle_id);

	if (!cycleAccess.success) {
		return handleServiceResponse(cycleAccess, res);
	}

	return next();
};
