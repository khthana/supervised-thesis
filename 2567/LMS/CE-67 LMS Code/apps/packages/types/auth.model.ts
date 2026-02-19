import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { string, z } from 'zod';

import { validation } from './common/validation';
import { UserSchema, UserRoleSchema } from './users/user.model';

extendZodWithOpenApi(z);

export type UserGoogleOAuth2 = z.infer<typeof DefaultAuthSchema.UserGoogleOAuth2Schema>;
export type AccessTokenPayload = z.infer<typeof DefaultAuthSchema.AccessTokenPayloadSchema>;
export type RefreshTokenPayload = z.infer<typeof DefaultAuthSchema.RefreshTokenPayloadSchema>;
export type UserCookie = z.infer<typeof DefaultAuthSchema.UserCookieSchema>;
export type UserLogin = z.infer<typeof ValidateAuthSchema.PostUserLoginSchema.shape.body>;
export type UserRegister = z.infer<typeof ValidateAuthSchema.PostUserRegisterSchema.shape.body>;

export const DefaultAuthSchema = {
	AccessTokenPayloadSchema: z.object({
		user_id: z.string().uuid(),
		email: z.string().email(),
		user_role: UserRoleSchema,
		is_verified: z.boolean(),
		iat: z.number(),
		exp: z.string(),
	}),

	RefreshTokenPayloadSchema: z.object({
		user_id: z.string().uuid(),
		iat: z.number(),
		exp: z.string(),
	}),

	UserGoogleOAuth2Schema: z.object({
		id: z.number(),
		email: z.string().email(),
		verified_email: z.boolean(),
		name: z.string(),
		given_name: z.string(),
		family_name: z.string(),
		picture: z.string(),
	}),

	UserCookieSchema: z.object({
		accessToken: validation.Argon2TokenSchema,
		refreshToken: validation.Argon2TokenSchema,
		user_id: z.string().uuid(),
		email: z.string().email(),
		user_role: UserRoleSchema,
		is_verified: z.boolean(),
	}),
};

export const ValidateAuthSchema = {
	PostUserLoginSchema: z.object({
		params: z.object({}),
		query: z.object({}),
		body: z.object({
			email: UserSchema.shape.email,
			password: z.string().openapi({ description: 'Password of the user' }),
		}),
	}),

	PostUserRegisterSchema: z.object({
		params: z.object({}),
		query: z.object({}),
		body: z.object({
			email: UserSchema.shape.email,
			password: validation.StrongPasswordSchema,
			firstname_en: UserSchema.shape.firstname_en,
			lastname_en: UserSchema.shape.lastname_en,
			user_role: UserSchema.shape.user_role,
		}),
	}),

	PostRenewAccessTokenSchema: z.object({
		params: z.object({}),
		query: z.object({}),
		body: z.object({
			refreshToken: string().openapi({
				description: 'Refresh token of the user',
			}),
		}),
	}),
};
