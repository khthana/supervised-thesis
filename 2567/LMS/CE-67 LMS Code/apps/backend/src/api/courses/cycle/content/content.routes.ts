import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { type Router } from 'express';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { cycleContentController } from '@/api/courses/cycle/content/content.controller';
import {
	authenticate,
	authorizeAdmin,
	authorizeCourseEditor,
	authorizeCycleEditor,
	authorizeRole,
} from '@/common/middleware/auth';
import { validateRequest } from '@/common/utils/httpHandlers.util';
import { validateAuthHeader } from '@shared/types/common/headers';
import { validation } from '@shared/types/common/validation';
import {
	ContentStatus,
	ContentType,
	type CreateLesson,
	CreateLessonContent,
	CreateLessonContentSchema,
	CreateLessonSchema,
	Lesson,
	LessonContent,
	LessonContentSchema,
	LessonSchema,
	UpdateLesson,
	UpdateLessonContent,
	UpdateLessonContentSchema,
	UpdateLessonSchema,
} from '@shared/types/courses/lesson.model';

export const contentRegistry = new OpenAPIRegistry();
export const contentRouter: Router = express.Router({ mergeParams: true });

contentRouter.use(authenticate);

contentRegistry.registerPath({
	method: 'delete',
	path: '/api/courses/cycles/lessons/contents/{content_id}',
	tags: ['Course Lessons'],
	security: [{ bearerAuth: [] }],
	request: {
		headers: validateAuthHeader.shape.headers,
		params: z.object({
			content_id: z.string().uuid('Invalid content ID'),
		}),
	},
	responses: createApiResponse(LessonContentSchema, 'Lesson content deleted successfully'),
});
contentRouter.delete(
	'/contents/:content_id',
	validateRequest(
		z.object({
			params: z.object({
				content_id: validation.PositiveStrOrIntSchema,
			}),
		}),
	),
	// authorizeCycleEditor,
	cycleContentController.deleteLessonContent,
);

contentRegistry.registerPath({
	method: 'put',
	path: '/api/courses/cycles/lessons/contents/{content_id}',
	tags: ['Course Lessons'],
	security: [{ bearerAuth: [] }],
	request: {
		headers: validateAuthHeader.shape.headers,
		params: z.object({
			content_id: validation.PositiveStrOrIntSchema,
		}),
		body: {
			required: true,
			content: {
				'application/json': {
					schema: z.object({
						body: UpdateLessonContentSchema,
					}),
				},
			},
		},
	},
	responses: createApiResponse(LessonContentSchema, 'Lesson content updated successfully'),
});
contentRouter.put(
	'/contents/:content_id',
	validateRequest(
		z.object({
			params: z.object({
				content_id: validation.PositiveStrOrIntSchema,
			}),
			body: UpdateLessonContentSchema,
		}),
	),
	// authorizeCycleEditor,
	cycleContentController.updateLessonContent,
);

contentRegistry.registerPath({
	method: 'get',
	path: '/api/courses/cycles/lessons/contents/{content_id}',
	tags: ['Course Lessons'],
	security: [{ bearerAuth: [] }],
	request: {
		headers: validateAuthHeader.shape.headers,
		params: z.object({
			content_id: validation.PositiveStrOrIntSchema,
		}),
	},
	responses: createApiResponse(LessonContentSchema, 'Lesson content retrieved successfully'),
});
contentRouter.get(
	'/contents/:content_id',
	validateRequest(
		z.object({
			params: z.object({
				content_id: validation.PositiveStrOrIntSchema,
			}),
		}),
	),
	cycleContentController.getLessonContent,
);

contentRegistry.registerPath({
	method: 'post',
	path: '/api/courses/cycles/lessons/{lesson_id}/contents',
	tags: ['Course Lessons'],
	security: [{ bearerAuth: [] }],
	request: {
		headers: validateAuthHeader.shape.headers,
		params: z.object({
			lesson_id: validation.PositiveStrOrIntSchema,
		}),
		body: {
			required: true,
			content: {
				'application/json': {
					schema: z.object({
						body: CreateLessonContentSchema,
					}),
				},
			},
		},
	},
	responses: createApiResponse(LessonContentSchema, 'Lesson content created successfully'),
});
contentRouter.post(
	'/:lesson_id/contents',
	validateRequest(
		z.object({
			params: z.object({
				lesson_id: validation.PositiveStrOrIntSchema,
			}),
			body: CreateLessonContentSchema,
		}),
	),
	// authorizeCycleEditor,
	cycleContentController.createLessonContent,
);

contentRegistry.registerPath({
	method: 'delete',
	path: '/api/courses/cycles/lessons/{lesson_id}',
	tags: ['Course Lessons'],
	security: [{ bearerAuth: [] }],
	request: {
		headers: validateAuthHeader.shape.headers,
		params: z.object({
			lesson_id: validation.PositiveStrOrIntSchema,
		}),
	},
	responses: createApiResponse(LessonSchema, 'Lesson deleted successfully'),
});
contentRouter.delete(
	'/:lesson_id',
	validateRequest(
		z.object({
			params: z.object({
				lesson_id: validation.PositiveStrOrIntSchema,
			}),
		}),
	),
	// authorizeCycleEditor,
	cycleContentController.deleteLesson,
);

contentRegistry.registerPath({
	method: 'put',
	path: '/courses/cycles/{cycle_id}/lessons',
	tags: ['Course Lessons'],
	security: [{ bearerAuth: [] }],
	request: {
		headers: validateAuthHeader.shape.headers,
		params: z.object({
			cycle_id: z.string().uuid('Invalid cycle ID'),
		}),
		body: {
			required: true,
			content: {
				'application/json': {
					schema: z.object({
						body: UpdateLessonSchema,
					}),
				},
			},
		},
	},
	responses: createApiResponse(LessonSchema, 'Lesson retrieved successfully'),
});
contentRouter.put(
	'/',
	validateRequest(
		z.object({
			params: z.object({
				cycle_id: z.string().uuid('Invalid cycle ID'),
			}),
			body: UpdateLessonSchema,
		}),
	),
	// authorizeCycleEditor,
	cycleContentController.updateLesson,
);

contentRegistry.registerPath({
	method: 'post',
	path: '/api/courses/cycles/{cycle_id}/lessons',
	tags: ['Course Lessons'],
	security: [{ bearerAuth: [] }],
	request: {
		headers: validateAuthHeader.shape.headers,
		params: z.object({
			cycle_id: z.string().uuid('Invalid cycle ID'),
		}),
		body: {
			required: true,
			content: {
				'application/json': {
					schema: z.object({
						body: CreateLessonSchema,
					}),
				},
			},
		},
	},
	responses: createApiResponse(LessonSchema, 'Lesson created successfully'),
});
contentRouter.post(
	'/',
	validateRequest(
		z.object({
			params: z.object({
				cycle_id: z.string().uuid('Invalid cycle ID'),
			}),
			body: CreateLessonSchema,
		}),
	),
	// authorizeCycleEditor,
	cycleContentController.createLesson,
);

contentRegistry.registerPath({
	method: 'get',
	path: '/api/courses/cycles/{cycle_id}/lessons',
	tags: ['Course Lessons'],
	security: [{ bearerAuth: [] }],
	request: {
		headers: validateAuthHeader.shape.headers,
		params: z.object({
			cycle_id: z.string().uuid('Invalid cycle ID'),
		}),
	},
	responses: createApiResponse(z.array(LessonSchema), 'Lessons retrieved successfully'),
});
contentRouter.get(
	'/',
	validateRequest(
		z.object({
			params: z.object({
				cycle_id: z.string().uuid('Invalid cycle ID'),
			}),
		}),
	),
	// authorizeCycleEditor,
	cycleContentController.getLessonAndContents,
);
