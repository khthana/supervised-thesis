import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { validation } from '../common/validation';

extendZodWithOpenApi(z);

export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserRoleSchema = z
	.string()
	.refine((val) => ['ANNOUNCER', 'INSTRUCTOR', 'LEARNER'].includes(val), {
		message: 'Invalid user role',
	})
	.openapi({ description: 'Role of the user' });

export type User = z.infer<typeof UserSchema>;
export const UserSchema = z.object({
	user_id: z.string().uuid().openapi({
		description: 'Unique identifier of the user',
	}),
	email: z.string().email().max(120).openapi({ description: 'Email of the user' }),
	password_hash: validation.Argon2TokenSchema.openapi({ description: 'Hashed password of the user' }),
	firstname_th: z.union([validation.ThaiNameSchema, z.null()]).openapi({
		description: 'First name of the user in Thai',
	}),
	lastname_th: z.union([validation.ThaiNameSchema, z.null()]).openapi({
		description: 'Last name of the user in Thai',
	}),
	firstname_en: validation.EnglishNameSchema.openapi({
		description: 'First name of the user in English',
	}),
	lastname_en: validation.EnglishNameSchema.openapi({
		description: 'Last name of the user in English',
	}),
	user_role: UserRoleSchema.openapi({ description: 'Role of the user' }),
	is_verified: z.boolean().openapi({ description: 'Whether the user is verified or not' }),
	is_active: z.boolean().openapi({ description: 'Whether the user is active or not' }),
	created_at: z.string().datetime().openapi({ description: 'Date and time that the user was created' }),
	updated_at: z.string().datetime().openapi({ description: 'Date and time that the user was updated' }),
});

export const ParamUserSchema = {
	UserByIDSchema: z.object({
		user_id: z.string().uuid().openapi({
			description: 'ID of the user to retrieve',
		}),
	}),
};

export const BodyUserSchema = {
	UserUpdateSchema: UserSchema.omit({
		user_id: true,
		created_at: true,
		updated_at: true,
	})
		.partial()
		.openapi({
			description: 'Schema for updating an existing user',
		}),

	UserCreateSchema: UserSchema.omit({
		user_id: true,
		firstname_th: true,
		lastname_th: true,
		is_active: true,
		created_at: true,
		updated_at: true,
	}).openapi({
		description: 'Schema for creating a new user',
	}),
};

// the void of any type
// param: z.object({}),
// query: z.object({}),
// body: z.undefined(),

export const ValidateUserSchema = {
	GetUsersSchema: z.object({
		params: z.object({}),
		query: validation.commonQueryValidation,
		body: z.undefined(),
	}),

	GetUserByIDSchema: z.object({
		params: ParamUserSchema.UserByIDSchema,
		query: z.object({}),
		body: z.undefined(),
	}),

	GetUserByEmailSchema: z.object({
		params: z.object({}),
		query: z.object({}),
		body: z.object({
			email: z.string().email().openapi({ description: 'Email of the user' }),
		}),
	}),

	PutUserUpdateSchema: z.object({
		params: z.object({}),
		query: z.object({}),
		body: BodyUserSchema.UserUpdateSchema,
	}),
};
