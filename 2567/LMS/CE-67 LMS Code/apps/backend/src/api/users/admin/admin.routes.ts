import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { type Router } from 'express';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { adminController } from '@/api/users/admin/admin.controller';
import { authenticate, authorizeAdmin } from '@/common/middleware/auth';
import { validateRequest } from '@/common/utils/httpHandlers.util';
import { validateAuthHeader } from '@shared/types/common/headers';

import { validation } from '@shared/types/common/validation';

export const adminRegistry = new OpenAPIRegistry();
export const adminRouter: Router = express.Router();

// adminRegistry.register('Admin', AdminSchema);

adminRegistry.registerPath({
	method: 'get',
	path: '/api/users/admins',
	tags: ['Admin'],
	// request: { query: ValidateUserSchema.GetUsersSchema.shape.query },
	responses: createApiResponse(
		z.object({
			admins: z.array(
				z.object({
					id: z.number(),
					email: z.string(),
					firstName: z.string(),
					lastName: z.string(),
					role: z.string(),
					createdAt: z.string(),
					updatedAt: z.string(),
				}),
			),
			totalCount: z.number(),
		}),
		'Success',
	),
});
adminRouter.get(
	'/',
	// authenticate,
	// authorizeAdmin,
	validateRequest(
		z.object({
			query: validation.commonQueryValidation,
		}),
	),
	adminController.getAdmins,
);

adminRegistry.registerPath({
	method: 'get',
	path: '/api/users/admins/{id}',
	tags: ['Admin'],
	request: { params: z.object({ id: z.string() }) },
	responses: createApiResponse(
		z.object({
			user_id: z.number(),
			email: z.string(),
			firstName: z.string(),
			lastName: z.string(),
			user_role: z.string(),
			createdAt: z.string(),
			updatedAt: z.string(),
		}),
		'Success',
	),
});
adminRouter.get(
	'/:id',
	// authenticate,
	// authorizeAdmin,
	adminController.getAdminByID,
);
