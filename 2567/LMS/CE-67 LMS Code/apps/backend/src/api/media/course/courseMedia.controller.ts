import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { courseMediaService } from '@/api/media/course/courseMedia.service';
import { userService } from '@/api/users/user/user.service';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { handleServiceResponse } from '@/common/utils/httpHandlers.util';
import { youtubeVideoSchema } from '@/common/validation/string.validation';
import { logger } from '@/server';

class CourseMediaController {
	public uploadCourseMedia: RequestHandler = async (req: Request, res: Response, _next: NextFunction) => {
		if (!req.user) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Invalid request data#1', null), res);
		}

		if (!req.course) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Invalid request data#2', null), res);
		}

		// TODO: Implement course media upload logic
	};

	public uploadCourseAvatar: RequestHandler = async (req: Request, res: Response, _next: NextFunction) => {
		if (!req.user) {
			return handleServiceResponse(ServiceResponse.failure('[uploadCourseAvatar] user is not authenticate', null), res);
		}
		if (!req.course) {
			return handleServiceResponse(
				ServiceResponse.failure('[uploadCourseAvatar] Invalid request please specifies course', null),
				res,
			);
		}

		if (!req.course.course_id) {
			return handleServiceResponse(ServiceResponse.failure('[uploadCourseAvatar] Invalid request course', null), res);
		}

		if (!req.user.user_id) {
			return handleServiceResponse(ServiceResponse.failure('[uploadCourseAvatar] Invalid request user', null), res);
		}

		const serviceResponse = await courseMediaService.uploadCourseAvatar(req);
		return handleServiceResponse(serviceResponse, res);
	};

	public uploadCourseVideo: RequestHandler = async (req: Request, res: Response, _next: NextFunction) => {
		if (!req.user) {
			return handleServiceResponse(ServiceResponse.failure('[uploadCourseVideo] Invalid request data#1', null), res);
		}
		if (!req.course) {
			return handleServiceResponse(ServiceResponse.failure('[uploadCourseVideo] Invalid request data#2', null), res);
		}
		if (!req.course.course_id) {
			return handleServiceResponse(ServiceResponse.failure('[uploadCourseVideo] Invalid request data#3', null), res);
		}
		if (!req.user.user_id) {
			return handleServiceResponse(ServiceResponse.failure('[uploadCourseVideo] Invalid request data#4', null), res);
		}

		const serviceResponse = await courseMediaService.uploadCourseIntroVideo(req);
		return handleServiceResponse(serviceResponse, res);
	};
}

export const courseMediaController = new CourseMediaController();
