import type { NextFunction, Request, RequestHandler, Response } from 'express';

import { authService } from '@/api/auth/auth.service';
import { userService } from '@/api/users/user/user.service';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { handleServiceResponse } from '@/common/utils/httpHandlers.util';

import type { UserRegister } from '@shared/types/auth.model';
import { StatusCodes } from 'http-status-codes';

import { env } from '@/common/utils/envConfig.util';

class AuthController {
	public googleOAuth: RequestHandler = async (_req: Request, res: Response, _next: NextFunction) => {
		const redirectUrl = await authService.getGoogleProfileUrl();
		res.redirect(redirectUrl);
	};

	public googleOAuthCallback: RequestHandler = async (req: Request, res: Response, _next: NextFunction) => {
		const code = req.query.code as string;
		const googleProfilServiceResponse = await authService.getUserGoogleProfile(code);
		if (!googleProfilServiceResponse.success || !googleProfilServiceResponse.responseObject) {
			return handleServiceResponse(googleProfilServiceResponse, res);
		}

		const googleProfile = googleProfilServiceResponse.responseObject;
		const findUserEmail = googleProfile.email;

		const userServiceResponse = await userService.getUserByEmail(findUserEmail);
		if (!userServiceResponse.success || !userServiceResponse.responseObject) {
			return handleServiceResponse(userServiceResponse, res);
		}

		const foundUser = userServiceResponse.responseObject;

		const userTokenResponse = await authService.giveUserToken(foundUser);
		return handleServiceResponse(userTokenResponse, res);
	};

	public login: RequestHandler = async (req: Request, res: Response, _next: NextFunction) => {
		const { email, password } = req.body;
		const userServiceResponse = await userService.getUserByEmail(email);
		if (!userServiceResponse.success || !userServiceResponse.responseObject) {
			return handleServiceResponse(userServiceResponse, res);
		}

		const inputPassword = password;
		const foundUser = userServiceResponse.responseObject;
		const userLoginResponse = await authService.userLogin(foundUser, inputPassword);

		return handleServiceResponse(userLoginResponse, res);
	};

	public register: RequestHandler = async (req: Request, res: Response, _next: NextFunction) => {
		const { email, password, firstname_en, lastname_en, user_role } = req.body;
		const userRegister: UserRegister = {
			email,
			password,
			firstname_en,
			lastname_en,
			user_role,
		};

		const createUserResponse = await userService.createUser(userRegister);
		if (!createUserResponse.success) {
			return handleServiceResponse(createUserResponse, res);
		}

		const foundUser = createUserResponse.responseObject;
		if (!foundUser) {
			return handleServiceResponse(createUserResponse, res);
		}

		const userTokenResponse = await authService.giveUserToken(foundUser);
		return handleServiceResponse(userTokenResponse, res);
	};

	public refreshAccessToken: RequestHandler = async (req: Request, res: Response, _next: NextFunction) => {
		const { refreshToken } = req.body;
		const accessTokenResponse = await authService.userRequestNewToken(refreshToken);
		return handleServiceResponse(accessTokenResponse, res);
	};

	public verifyMediaServerToken: RequestHandler = async (req: Request, res: Response, _next: NextFunction) => {
		//TODO: implement authorization token check (bearer token)
		if (!req.user) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Invalid request data', null), res);
		}
		// const userRequest = req.user;
		// if (!userRequest.user_id) {
		// 	return handleServiceResponse(ServiceResponse.failure('[Controller] Invalid request data', null), res);
		// }
		// const checkUserServiceResponse = await userService.getUserByID(userRequest.user_id);
		// if (!checkUserServiceResponse.success || !checkUserServiceResponse.responseObject) {
		// 	return handleServiceResponse(checkUserServiceResponse, res);
		// }

		// signature check
		// if (!req.validatedData || !req.validatedData.query) {
		// 	return handleServiceResponse(ServiceResponse.failure('[Controller] Invalid request data', null), res);
		// }
		// const { query } = req.validatedData;
		// const { expires, signature } = query;
		// if (!expires || !signature) {
		// 	return handleServiceResponse(ServiceResponse.failure('[Controller] Invalid request data', null), res);
		// }
		// const currentTimestamp = Math.floor(Date.now() / 1000);
		// if (expires < currentTimestamp) {
		// 	return handleServiceResponse(ServiceResponse.failure('[Controller] Invalid request data', null), res);
		// }

		const user = {
			user_id: 2,
		};
		// const expectedSignature = new Bun.CryptoHasher('sha256').update(`${user.user_id}:${expires}`).digest('hex');

		// if (signature !== expectedSignature) {
		// 	return handleServiceResponse(ServiceResponse.failure('[Controller] Invalid request data', null, StatusCodes.FORBIDDEN), res);
		// }

		return handleServiceResponse(ServiceResponse.success('Token is valid', user), res);
	};
}

export const authController = new AuthController();
