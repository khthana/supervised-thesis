import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { type Router } from 'express';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { authController } from '@/api/auth/auth.controller';
import { authenticate } from '@/common/middleware/auth';
import { validateRequest } from '@/common/utils/httpHandlers.util';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { DefaultAuthSchema, ValidateAuthSchema } from '@shared/types/auth.model';
import { validateAuthHeader } from '@shared/types/common/headers';
import { validation } from '@shared/types/common/validation';

extendZodWithOpenApi(z);

export const authRegistry = new OpenAPIRegistry();
export const authRouter: Router = express.Router();

authRegistry.register('UserGoogleOAuth2', DefaultAuthSchema.UserGoogleOAuth2Schema);

authRegistry.registerPath({
	method: 'get',
	path: '/api/auth/google',
	tags: ['OAuth2', 'Auth'],
	responses: createApiResponse(z.null(), 'Redirect to Google OAuth2 login page'),
});
authRouter.get('/google', authController.googleOAuth);

authRegistry.registerPath({
	method: 'post',
	path: '/api/auth/google/callback',
	tags: ['OAuth2', 'Auth'],
	responses: createApiResponse(
		z.object({
			accessToken: validation.Argon2TokenSchema,
			refreshToken: validation.Argon2TokenSchema,
		}),
		'Success',
	),
});
authRouter.post('/google/callback', authController.googleOAuthCallback);

authRegistry.registerPath({
	method: 'post',
	path: '/api/auth/login',
	tags: ['Auth'],
	request: {
		body: {
			description: 'User login request',
			content: {
				'application/json': {
					schema: ValidateAuthSchema.PostUserLoginSchema.shape.body,
				},
			},
			required: true,
		},
	},
	responses: createApiResponse(
		z.object({
			accessToken: validation.Argon2TokenSchema,
			refreshToken: validation.Argon2TokenSchema,
		}),
		'Login successful',
	),
});
authRouter.post('/login', validateRequest(ValidateAuthSchema.PostUserLoginSchema), authController.login);

authRegistry.registerPath({
	method: 'post',
	path: '/api/auth/register',
	tags: ['Auth'],
	request: {
		body: {
			description: 'User registration request',
			content: {
				'application/json': {
					schema: ValidateAuthSchema.PostUserRegisterSchema.shape.body,
				},
			},
			required: true,
		},
	},
	responses: createApiResponse(
		z.object({
			accessToken: validation.Argon2TokenSchema,
			refreshToken: validation.Argon2TokenSchema,
		}),
		'Registration successful',
	),
});
authRouter.post('/register', validateRequest(ValidateAuthSchema.PostUserRegisterSchema), authController.register);

authRegistry.registerPath({
	method: 'post',
	path: '/api/auth/token/renew',
	tags: ['Auth'],
	request: {
		body: {
			description: 'Refresh token request',
			content: {
				'application/json': {
					schema: ValidateAuthSchema.PostRenewAccessTokenSchema.shape.body,
				},
			},
			required: true,
		},
	},
	responses: createApiResponse(
		z.object({
			accessToken: validation.Argon2TokenSchema,
		}),
		'Token renewed successfully',
	),
});
authRouter.post(
	'/token/renew',
	validateRequest(ValidateAuthSchema.PostRenewAccessTokenSchema),
	authController.refreshAccessToken,
);

authRegistry.registerPath({
	method: 'get',
	path: '/api/auth/verify',
	tags: ['Auth'],
	responses: createApiResponse(z.object({ valid: z.boolean() }), 'Token verification result'),
});
authRouter.get(
	'/verify',
	// authenticate,
	validateRequest(
		z.object({
			params: z.object({}),
			query: z.object({}),
			body: z.undefined(),
		}),
	),
	authController.verifyMediaServerToken,
);
