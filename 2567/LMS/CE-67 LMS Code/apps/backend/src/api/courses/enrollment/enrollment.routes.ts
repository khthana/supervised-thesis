import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { type Router } from 'express';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { courseController } from '@/api/courses/course/course.controller';
import { authenticate } from '@/common/middleware/auth';
import { validateRequest } from '@/common/utils/httpHandlers.util';
import { validateAuthHeader } from '@shared/types/common/headers';

import {
	CourseCategorySchema,
	CourseSchema,
	CourseSubCategorySchema,
	ValidateCourseSchema,
} from '@shared/types/courses/course.model';

import { CourseEnrollmentSchema, CourseEnrollmentStatusSchema } from '@shared/types/courses/courseEnrollment.model';

export const enrollmentRegistry = new OpenAPIRegistry();
export const enrollmentRouter: Router = express.Router();

enrollmentRegistry.registerPath({
	method: 'get',
	path: '/api/courses/enrollment',
	tags: ['Course Enrollments'],
	responses: createApiResponse(
		z.object({
			courses: z.array(CourseSchema),
			totalCount: z.number(),
		}),
		'Success',
	),
});
enrollmentRouter.get('/', validateRequest(ValidateCourseSchema.GetAllCourseSchema), courseController.notImplemented);
