import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { type Router } from 'express';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { userController } from '@/api/users/user/user.controller';
import { authenticate } from '@/common/middleware/auth';
import { validateRequest } from '@/common/utils/httpHandlers.util';
import { validateAuthHeader } from '@shared/types/common/headers';
import { UserSchema, ValidateUserSchema } from '@shared/types/users/user.model';

export const userRegistry = new OpenAPIRegistry();
export const userRouter: Router = express.Router();

userRegistry.register('User', UserSchema);

// dev only api
userRegistry.registerPath({
	method: 'post',
	path: '/api/users/email',
	tags: ['DEV ONLY'],
	request: {
		headers: validateAuthHeader.shape.headers,
		body: {
			description: 'User email request',
			required: true,
			content: {
				'application/json': {
					schema: ValidateUserSchema.GetUserByEmailSchema.shape.body,
				},
			},
		},
	},
	responses: createApiResponse(UserSchema, 'Success'),
});
userRouter.post(
	'/email',
	authenticate,
	validateRequest(ValidateUserSchema.GetUserByEmailSchema),
	userController.getUserByEmail,
);

userRegistry.registerPath({
	method: 'get',
	path: '/api/users/{user_id}',
	tags: ['User'],
	request: { params: ValidateUserSchema.GetUserByIDSchema.shape.params },
	responses: createApiResponse(UserSchema, 'Success'),
});
userRouter.get('/:user_id', validateRequest(ValidateUserSchema.GetUserByIDSchema), userController.getUserByID);

userRegistry.registerPath({
	method: 'put',
	path: '/api/users',
	tags: ['User'],
	request: {
		headers: validateAuthHeader.shape.headers,
		body: {
			description: 'User update request',
			required: true,
			content: {
				'application/json': {
					schema: ValidateUserSchema.PutUserUpdateSchema.shape.body,
				},
			},
		},
	},
	responses: createApiResponse(UserSchema, 'Success'),
});
userRouter.put('/', authenticate, validateRequest(ValidateUserSchema.PutUserUpdateSchema), userController.updateUser);

userRegistry.registerPath({
	method: 'get',
	path: '/api/users',
	tags: ['User'],
	request: { query: ValidateUserSchema.GetUsersSchema.shape.query },
	responses: createApiResponse(
		z.object({
			users: z.array(UserSchema),
			totalCount: z.number(),
		}),
		'Success',
	),
});
userRouter.get('/', validateRequest(ValidateUserSchema.GetUsersSchema), userController.getUsers);
