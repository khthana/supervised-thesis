import { StatusCodes } from 'http-status-codes';

import { userRepository } from '@/api/users/user/user.repository';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { env } from '@/common/utils/envConfig.util';
import { tokenUtils } from '@/common/utils/token.util';
import type { CreateAccessTokenPayload, CreateRefreshTokenPayload } from '@/common/validation/token.validation';
import type { UserGoogleOAuth2 } from '@shared/types/auth.model';
import type { User } from '@shared/types/users/user.model';

class AuthService {
	private userRepository: typeof userRepository;

	private accessTokenSecret: string;
	private accessTokenPublic: string;
	private accessTokenExpire: string;
	private refreshTokenSecret: string;
	private refreshTokenExpire: string;
	private refreshTokenPublic: string;
	private emailVerifyTokenSecret: string;
	private emailVerifyTokenPublic: string;

	constructor() {
		this.userRepository = userRepository;

		this.accessTokenSecret = env.ACCESS_TOKEN_SECRET;
		this.refreshTokenSecret = env.REFRESH_TOKEN_SECRET;
		this.accessTokenExpire = env.ACCESS_TOKEN_EXP;
		this.refreshTokenExpire = env.REFRESH_TOKEN_EXP;
		this.accessTokenPublic = env.ACCESS_TOKEN_PUBLIC;
		this.refreshTokenPublic = env.REFRESH_TOKEN_PUBLIC;
		this.emailVerifyTokenSecret = env.VERIFY_TOKEN_SECRET;
		this.emailVerifyTokenPublic = env.VERIFY_TOKEN_PUBLIC;
	}

	async getGoogleProfileUrl(): Promise<string> {
		const clientId = env.OAUTH2_GOOGLE_CLIENT_ID;
		const redirectUri = `${env.FRONTEND_URL}/login/google/callback`;
		const scope = ['email', 'profile'];

		const params = new URLSearchParams({
			client_id: clientId,
			redirect_uri: redirectUri,
			scope: scope.join(' '),
			response_type: 'code',
			access_type: 'online',
			prompt: 'consent',
		});
		return `${env.OAUTH2_GOOGLE_AUTH_URL}?${params.toString()}`;
	}

	async __exchangeCodeForGoogleOAuth2Token(code: string): Promise<string | { error: string }> {
		const clientId = env.OAUTH2_GOOGLE_CLIENT_ID;
		const clientSecret = env.OAUTH2_GOOGLE_CLIENT_SECRET;
		const tokenUrl = env.OAUTH2_GOOGLE_TOKEN_URL;
		const redirectUri = `${env.FRONTEND_URL}/login/google/callback`;

		const params = new URLSearchParams({
			client_id: clientId,
			client_secret: clientSecret,
			code: code,
			grant_type: 'authorization_code',
			redirect_uri: redirectUri,
		});

		const response = await fetch(tokenUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: params.toString(),
		});
		if (!response.ok) {
			const error = await response.json();
			return { error: error.error_description };
		}

		const data = await response.json();
		return data.access_token;
	}

	async getUserGoogleProfile(code: string): Promise<ServiceResponse<UserGoogleOAuth2 | null>> {
		const accessToken = await this.__exchangeCodeForGoogleOAuth2Token(code);
		if (typeof accessToken === 'object') {
			return ServiceResponse.failure(accessToken.error, null);
		}

		const userInfoResponse = await fetch(env.OAUTH2_GOOGLE_TOKENINFO_URL, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		const userInfo = await userInfoResponse.json();
		if (userInfo.error) {
			return ServiceResponse.failure(userInfo.error_description, null);
		}

		const user: UserGoogleOAuth2 = {
			id: userInfo.id,
			email: userInfo.email,
			verified_email: Boolean(userInfo.verified_email),
			name: userInfo.name,
			given_name: userInfo.given_name,
			family_name: userInfo.family_name,
			picture: userInfo.picture,
		};

		return ServiceResponse.success('User found', user);
	}

	async giveUserToken(user: User): Promise<
		ServiceResponse<{
			accessToken: string;
			refreshToken: string;
		} | null>
	> {
		const accessTokenPayload: CreateAccessTokenPayload = {
			user_id: user.user_id,
			email: user.email,
			user_role: user.user_role,
			is_verified: user.is_verified,
			exp: env.ACCESS_TOKEN_EXP,
		};

		const refreshTokenPayload: CreateRefreshTokenPayload = {
			user_id: user.user_id,
			exp: env.REFRESH_TOKEN_EXP,
		};

		const accessToken = await tokenUtils.signAccessToken(this.accessTokenSecret, accessTokenPayload);
		const refreshToken = await tokenUtils.signRefreshToken(this.refreshTokenSecret, refreshTokenPayload);

		const testPayload = await tokenUtils.verifyAccessToken(this.accessTokenPublic, accessToken);
		console.log('testToken', accessToken);
		console.log('testPayload', testPayload);

		if (!accessToken || !refreshToken) {
			return ServiceResponse.failure('Token generation failed', null, StatusCodes.INTERNAL_SERVER_ERROR);
		}

		return ServiceResponse.success('Token generation successful', {
			accessToken,
			refreshToken,
		});
	}

	async userLogin(
		user: User,
		inputPassword: string,
	): Promise<ServiceResponse<{ accessToken: string; refreshToken: string } | null>> {
		const isValid = await Bun.password.verify(inputPassword, user.password_hash);
		if (!isValid) {
			return ServiceResponse.failure('Invalid email or password', null, StatusCodes.UNAUTHORIZED);
		}

		const tokenResult = await this.giveUserToken(user);
		return tokenResult;
	}

	async userRequestNewToken(refreshToken: string): Promise<ServiceResponse<{ accessToken: string } | null>> {
		// validate user input refresh token
		if (!refreshToken) {
			return ServiceResponse.failure('Refresh token is required', null, StatusCodes.BAD_REQUEST);
		}

		const refreshTokenPayload = await tokenUtils.verifyRefreshToken(this.refreshTokenPublic, refreshToken);
		if (!refreshTokenPayload) {
			return ServiceResponse.failure('Invalid refresh token', null, StatusCodes.UNAUTHORIZED);
		}

		// get user from database [by id]
		const { success, data, error } = await this.userRepository.findUserByID(refreshTokenPayload.user_id);
		if (!success) {
			if (error) {
				return ServiceResponse.failure(error, null, StatusCodes.INTERNAL_SERVER_ERROR);
			}
			return ServiceResponse.failure('Something went wrong', null, StatusCodes.INTERNAL_SERVER_ERROR);
		}

		if (!data) {
			return ServiceResponse.success('No user found', null, StatusCodes.NOT_FOUND);
		}

		if (!data.is_active) {
			return ServiceResponse.failure('User is inactive', null, StatusCodes.FORBIDDEN);
		}

		// generate new access token
		const user: User = {
			...data,
			created_at: data.created_at.toISOString(),
			updated_at: data.updated_at.toISOString(),
		};
		const tokensResponse = await this.giveUserToken(user);
		if (!tokensResponse.success || !tokensResponse.responseObject) {
			return ServiceResponse.failure('Token generation failed', null, StatusCodes.INTERNAL_SERVER_ERROR);
		}

		const { accessToken } = tokensResponse.responseObject;
		return ServiceResponse.success('Token renewed successfully', {
			accessToken,
		});
	}
}

export const authService = new AuthService();
