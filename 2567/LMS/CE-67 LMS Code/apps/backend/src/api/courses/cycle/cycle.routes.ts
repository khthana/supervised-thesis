import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { type Router } from 'express';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { courseCycleController } from '@/api/courses/cycle/cycle.controller';
import { authenticate, authorizeAdmin, authorizeCourseEditor, authorizeRole } from '@/common/middleware/auth';
import { validateRequest } from '@/common/utils/httpHandlers.util';
import { validateAuthHeader } from '@shared/types/common/headers';

import {
	CourseCycleSchema,
	CourseCycleTypeSchema,
	CreateCourseCycleSchema,
	UpdateCourseCycleSchema,
} from '@shared/types/courses/cycle.model';

import { contentRouter } from '@/api/courses/cycle/content/content.routes';

export const cycleRegistry = new OpenAPIRegistry();
export const cycleRouter: Router = express.Router({ mergeParams: true });

cycleRouter.use('/:cycle_id/lessons', contentRouter);
cycleRouter.use('/lessons', contentRouter);

cycleRegistry.registerPath({
	method: 'delete',
	path: '/api/courses/cycles/{cycle_id}',
	tags: ['Course Cycle'],
	security: [{ bearerAuth: [] }],
	request: {
		headers: validateAuthHeader.shape.headers,
		params: z.object({
			params: z.object({
				cycle_id: z.string().uuid('Invalid cycle ID'),
			}),
		}),
	},
	responses: {
		'204': {
			description: 'No Content',
		},
	},
});
cycleRouter.delete(
	'/:cycle_id',
	authenticate,
	authorizeAdmin(false),
	validateRequest(
		z.object({
			params: z.object({
				cycle_id: z.string().uuid('Invalid cycle ID'),
			}),
		}),
	),
	authorizeCourseEditor,
	courseCycleController.deleteCourseCycle,
);

cycleRegistry.registerPath({
	method: 'put',
	path: '/api/courses/cycles/{cycle_id}',
	tags: ['Course Cycle'],
	security: [{ bearerAuth: [] }],
	request: {
		headers: validateAuthHeader.shape.headers,
		params: z.object({
			params: z.object({
				cycle_id: z.string().uuid('Invalid cycle ID'),
			}),
		}),
		body: {
			required: true,
			content: {
				'application/json': {
					schema: CourseCycleTypeSchema,
				},
			},
		},
	},
	responses: createApiResponse(CourseCycleSchema, 'Success'),
});
cycleRouter.put(
	'/:cycle_id',
	authenticate,
	authorizeAdmin(false),
	validateRequest(
		z.object({
			params: z.object({
				cycle_id: z.string().uuid('Invalid cycle ID'),
			}),
			body: CourseCycleTypeSchema,
		}),
	),
	validateRequest(
		z.object({
			params: z.object({
				cycle_id: z.string().uuid('Invalid cycle ID'),
			}),
			body: UpdateCourseCycleSchema,
		}),
	),
	authorizeCourseEditor,
	validateRequest(
		z.object({
			params: z.object({
				course_id: z.string().uuid('Invalid course ID'),
			}),
			body: UpdateCourseCycleSchema,
		}),
	),
	courseCycleController.updateCourseCycle,
);

cycleRegistry.registerPath({
	method: 'get',
	path: '/api/courses/cycles/{cycle_id}',
	tags: ['Course Cycle'],
	security: [{ bearerAuth: [] }],
	request: {
		headers: validateAuthHeader.shape.headers,
		params: z.object({
			params: z.object({
				cycle_id: z.string().uuid('Invalid cycle ID'),
			}),
		}),
	},
	responses: createApiResponse(CourseCycleSchema, 'Success'),
});
cycleRouter.get(
	'/:cycle_id',
	authenticate,
	authorizeAdmin(false),
	validateRequest(
		z.object({
			params: z.object({
				cycle_id: z.string().uuid('Invalid cycle ID'),
			}),
		}),
	),
	courseCycleController.getCourseCycleByID,
);

cycleRegistry.registerPath({
	method: 'post',
	path: '/api/courses/{course_id}/cycles',
	tags: ['Course Cycle'],
	security: [{ bearerAuth: [] }],
	request: {
		headers: validateAuthHeader.shape.headers,
		params: z.object({
			params: z.object({
				course_id: z.string().uuid('Invalid course ID'),
			}),
		}),
		body: {
			required: true,
			content: {
				'application/json': {
					schema: CreateCourseCycleSchema,
				},
			},
		},
	},
	responses: createApiResponse(CourseCycleSchema, 'Success'),
});
cycleRouter.post(
	'/',
	authenticate,
	authorizeAdmin(false),
	validateRequest(
		z.object({
			params: z.object({
				course_id: z.string().uuid('Invalid course ID'),
			}),
			body: CreateCourseCycleSchema,
		}),
	),
	authorizeCourseEditor,
	courseCycleController.createCourseCycle,
);

cycleRegistry.registerPath({
	method: 'get',
	path: '/api/courses/{course_id}/cycles',
	tags: ['Course Cycle'],
	security: [{ bearerAuth: [] }],
	request: {
		headers: validateAuthHeader.shape.headers,
		params: z.object({
			params: z.object({
				course_id: z.string().uuid('Invalid course ID'),
			}),
		}),
	},
	responses: createApiResponse(z.array(CourseCycleSchema), 'Success'),
});
cycleRouter.get(
	'/',
	authenticate,
	validateRequest(
		z.object({
			params: z.object({
				course_id: z.string().uuid('Invalid course ID'),
			}),
		}),
	),
	courseCycleController.getCourseCycles,
);
