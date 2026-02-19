import { serverEnv as env } from '@/lib/env.server';
import type { AccessTokenPayload, RefreshTokenPayload } from '@shared/types/auth.model';
import { sign as pasetoSign, verify as pasetoVerify, decrypt as pasetodecrypt } from 'paseto-ts/v4';

class AuthService {
	private static instance: AuthService;

	private constructor() {}

	public static getInstance(): AuthService {
		if (!AuthService.instance) {
			AuthService.instance = new AuthService();
		}
		return AuthService.instance;
	}

	public async verifyAccessToken(token: string): Promise<AccessTokenPayload | null> {
		try {
			// console.log('token', token);
			const options = {
				validatePayload: false,
			};
			const { payload } = pasetoVerify<AccessTokenPayload>(env.ACCESS_TOKEN_PUBLIC, token, options);
			return payload;
		} catch (error) {
			console.error('Error verifying access token:', error);
			return null;
		}
	}

	public async verifyRefreshToken(token: string): Promise<RefreshTokenPayload | null> {
		try {
			// Use the correct option format for paseto-ts
			const options = {
				validatePayload: false,
			};

			const { payload } = pasetoVerify<RefreshTokenPayload>(env.REFRESH_TOKEN_PUBLIC, token, options);
			return payload;
		} catch (error) {
			console.error('Error verifying refresh token:', error);
			return null;
		}
	}

	public async fetchNewAccessToken(refreshToken: string): Promise<string | null> {
		try {
			const response = await fetch(`${env.BACKEND_URL}/api/auth/token/renew`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ refreshToken }),
			});

			if (!response.ok) {
				throw new Error(`Error getting access token: ${response.statusText}`);
			}

			const { access_token } = await response.json();
			if (!access_token) {
				console.error('No access token received');
				return null;
			}
			return access_token;
		} catch (error) {
			console.error('Error getting access token:', error);
			return null;
		}
	}
}

const authService = AuthService.getInstance();
export default authService;

export function verifyAccessToken(accessToken: string) {
	throw new Error('Function not implemented.');
}
