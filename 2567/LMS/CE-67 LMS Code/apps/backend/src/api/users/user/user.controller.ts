import type { NextFunction, Request, RequestHandler, Response } from 'express';

import { userMediaService } from '@/api/media/user/userMedia.service';
import { userService } from '@/api/users/user/user.service';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { handleServiceResponse } from '@/common/utils/httpHandlers.util';
import { logger } from '@/server';
import type { admins, users } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

class UserController {
	/**
	 * Retrieves all users from service layer and sends response
	 * @param req - The request object
	 * @param res - The response object
	 * @returns A response containing the users
	 */
	public getUsers = async (req: Request, res: Response) => {
		if (!req.validatedData || !req.validatedData.query) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Invalid request data', null), res);
		}

		const { query } = req.validatedData;
		const { limit, offset, sortBy, orderBy, searchText } = query;
		const serviceResponse = await userService.getAllUsers(limit, offset, sortBy as keyof users, orderBy, searchText);
		return handleServiceResponse(serviceResponse, res);
	};

	/**
	 * Retrieves a user by ID from service layer and sends response
	 * @param req - The request object
	 * @param res - The response object
	 * @returns A response containing the user
	 */
	public getUserByID: RequestHandler = async (req: Request, res: Response) => {
		const user_id = req.params.user_id;
		const serviceResponse = await userService.getUserByID(user_id);
		return handleServiceResponse(serviceResponse, res);
	};

	public updateUser: RequestHandler = async (req: Request, res: Response, _next: NextFunction) => {
		// ตรวจสอบความถูกต้องของ req.user และ user_id
		if (!req.user) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Invalid request data#1', null), res);
		}
		const userRequest = req.user;
		if (!userRequest.user_id) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Invalid request data#2', null), res);
		}

		const getUserResponse = await userService.getUserByID(userRequest.user_id);
		if (!getUserResponse.success || !getUserResponse.responseObject) {
			return handleServiceResponse(getUserResponse, res);
		}
		const user = getUserResponse.responseObject;

		if (!req.validatedData || !req.validatedData.body) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Invalid request data', null), res);
		}
		const { body } = req.validatedData;

		const { firstname_en, lastname_en, firstname_th, lastname_th, email } = body;
		if (!firstname_en || !lastname_en || !firstname_th || !lastname_th || !email) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Invalid request data#3', null), res);
		}

		// Check if email already exists
		const emailExistsResponse = await userService.getUserByEmail(email);
		if (emailExistsResponse.success && emailExistsResponse.responseObject) {
			const existingUser = emailExistsResponse.responseObject;
			if (existingUser.user_id !== user.user_id) {
				return handleServiceResponse(ServiceResponse.failure('Email already exists', null), res);
			}
		}

		// Update user information
		const updateUserData = {
			firstname_en,
			lastname_en,
			firstname_th,
			lastname_th,
			email,
		};

		const updateUserResponse = await userService.updateUser(user.user_id, updateUserData);
		if (!updateUserResponse.success) {
			return handleServiceResponse(updateUserResponse, res);
		}
	};

	// dev only api
	/**
	 * Retrieves a user by email from service layer and sends response
	 * @param req - The request object
	 * @param res - The response object
	 * @returns A response containing the user
	 */
	public getUserByEmail: RequestHandler = async (req: Request, res: Response) => {
		const email = req.body.email as string;
		const serviceResponse = await userService.getUserByEmail(email);
		return handleServiceResponse(serviceResponse, res);
	};
}

export const userController = new UserController();
