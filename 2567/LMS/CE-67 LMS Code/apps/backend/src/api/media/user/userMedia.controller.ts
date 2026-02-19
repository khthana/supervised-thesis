import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { userMediaService } from '@/api/media/user/userMedia.service';
import { userService } from '@/api/users/user/user.service';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { handleServiceResponse } from '@/common/utils/httpHandlers.util';
import { logger } from '@/server';

class UserMediaController {
	public uploadUserAvatar: RequestHandler = async (req: Request, res: Response, _next: NextFunction) => {
		if (!req.user) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Invalid request data#1', null), res);
		}
		const userRequest = req.user;
		if (!userRequest.user_id) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Invalid request data#2', null), res);
		}
		const getUser = await userService.getUserByID(userRequest.user_id);
		if (!getUser.success || !getUser.responseObject) {
			return handleServiceResponse(getUser, res);
		}

		const user = getUser.responseObject;

		// Convert string dates to Date objects
		const userWithDateObjects = {
			...user,
			created_at: new Date(user.created_at),
			updated_at: new Date(user.updated_at),
		};

		// User does not have an avatar, create a new one
		const serviceResponse = await userMediaService.uploadUserAvatar(req, userWithDateObjects);
		return handleServiceResponse(serviceResponse, res);
	};

	public getUserAvatar: RequestHandler = async (req: Request, res: Response, _next: NextFunction) => {
		if (!req.user) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Invalid request data#1', null), res);
		}
		const userRequest = req.user;
		if (!userRequest.user_id) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Invalid request data#2', null), res);
		}
		const getUser = await userService.getUserByID(userRequest.user_id);
		if (!getUser.success || !getUser.responseObject) {
			return handleServiceResponse(getUser, res);
		}

		const user = getUser.responseObject;

		// Convert string dates to Date objects
		const userWithDateObjects = {
			...user,
			created_at: new Date(user.created_at),
			updated_at: new Date(user.updated_at),
		};

		const avatarResponse = await userMediaService.getUserAvatarMeta(userWithDateObjects);
		return handleServiceResponse(avatarResponse, res);
	};
}

export const userMediaController = new UserMediaController();
