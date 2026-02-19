import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { type Router } from 'express';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { courseMediaController } from '@/api/media/course/courseMedia.controller';
import { authenticate, authorizeAdmin, authorizeCourseEditor, authorizeRole } from '@/common/middleware/auth';
import requestLogger from '@/common/middleware/requestLogger';
import { uploadCourseAvatar, uploadCourseIntrovideo } from '@/common/middleware/upload';
import { validateRequest } from '@/common/utils/httpHandlers.util';
import { youtubeVideoSchema } from '@/common/validation/string.validation';
import { validateAuthHeader } from '@shared/types/common/headers';
import { MediaFileSchema, ValidateMediaFileSchema } from '@shared/types/mediafile.model';

export const courseMediaRegistry = new OpenAPIRegistry();
export const courseMediaRouter: Router = express.Router();

courseMediaRegistry.registerPath({
	method: 'post',
	path: '/api/media/courses/avatar/{course_id}',
	tags: ['Media'],
	request: {
		headers: validateAuthHeader.shape.headers,
		params: z.object({
			course_id: z.string().uuid(),
		}),
	},
	responses: createApiResponse(MediaFileSchema, 'Success'),
});
courseMediaRouter.post(
	'/avatar/:course_id',
	authenticate,
	authorizeAdmin(false),
	validateRequest(
		z.object({
			params: z.object({
				course_id: z.string().uuid(),
			}),
		}),
	),
	authorizeCourseEditor,
	uploadCourseAvatar,
	courseMediaController.uploadCourseAvatar,
);

courseMediaRegistry.registerPath({
	method: 'post',
	path: '/api/media/courses/intro-video/{course_id}',
	tags: ['Media'],
	request: {
		headers: validateAuthHeader.shape.headers,
		params: z.object({
			course_id: z.string().uuid(),
		}),
		body: {
			description: 'External video URL',
			required: false,
			content: {
				'application/json': {
					schema: youtubeVideoSchema,
				},
			},
		},
	},
	responses: createApiResponse(MediaFileSchema, 'Success'),
});
courseMediaRouter.post(
	'/intro-video/:course_id',
	authenticate,
	authorizeAdmin(false),
	validateRequest(
		z.object({
			params: z.object({
				course_id: z.string().uuid(),
			}),
			body: z
				.object({
					external_video: youtubeVideoSchema,
				})
				.optional(),
		}),
	),
	authorizeCourseEditor,
	uploadCourseIntrovideo,
	requestLogger,
	courseMediaController.uploadCourseVideo,
);
