import { sign as pasetoSign, verify as pasetoVerify } from 'paseto-ts/v4';

import type { CreateAccessTokenPayload, CreateRefreshTokenPayload } from '@/common/validation/token.validation';
import { logger } from '@/server';
import type { AccessTokenPayload, RefreshTokenPayload } from '@shared/types/auth.model';

class TokenUtils {
	async signAccessToken(secret: string, payload: CreateAccessTokenPayload): Promise<string> {
		try {
			const customPayload = {
				...payload,
				iat: new Date(Date.now()).toISOString(), //new Date(Date.now() - 10000).toISOString(),
			};
			const accessToken = await pasetoSign(secret, customPayload, {
				addExp: false,
				addIat: true,
			});
			return accessToken;
		} catch (error) {
			throw new Error(`${error}`);
		}
	}

	async signRefreshToken(secret: string, payload: CreateRefreshTokenPayload): Promise<string> {
		try {
			const customPayload = {
				...payload,
				iat: new Date(Date.now()).toISOString(), //new Date(Date.now() - 10000).toISOString(),
			};
			const refreshToken = await pasetoSign(secret, customPayload, {
				addExp: false,
				addIat: true,
			});
			return refreshToken;
		} catch (error) {
			throw new Error(`${error}`);
		}
	}

	async verifyAccessToken(publicKey: string, token: string): Promise<AccessTokenPayload | null> {
		try {
			const { payload } = await pasetoVerify<AccessTokenPayload>(publicKey, token);
			return payload;
		} catch (error) {
			logger.error(`Error verifying access token: ${error}`);
			return null;
		}
	}

	async verifyRefreshToken(publicKey: string, token: string): Promise<RefreshTokenPayload | null> {
		try {
			const { payload } = await pasetoVerify<RefreshTokenPayload>(publicKey, token);
			return payload;
		} catch (error) {
			logger.error(`Error verifying refresh token: ${error}`);
			return null;
		}
	}

	async verifyEmailVerificationToken(publicKey: string, token: string): Promise<string | null> {
		try {
			const { payload } = await pasetoVerify(publicKey, token);
			return payload.email;
		} catch (error) {
			logger.warn(`Error verifying email token: ${error}`);
			return null;
		}
	}
}

export const tokenUtils = new TokenUtils();
