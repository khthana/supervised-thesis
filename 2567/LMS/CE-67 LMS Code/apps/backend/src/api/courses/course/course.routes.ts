import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { type Router } from 'express';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { courseController } from '@/api/courses/course/course.controller';
import { authenticate, authorizeAdmin, authorizeCourseEditor, authorizeRole } from '@/common/middleware/auth';
import { validateRequest } from '@/common/utils/httpHandlers.util';
import { validateAuthHeader } from '@shared/types/common/headers';

import {
	CourseCategorySchema,
	CourseSchema,
	CourseSubCategorySchema,
	ValidateCourseSchema,
} from '@shared/types/courses/course.model';

export const courseRegistry = new OpenAPIRegistry();
export const courseRouter: Router = express.Router();

courseRegistry.register('Course', CourseSchema);
courseRegistry.register('CourseCategory', CourseCategorySchema);
courseRegistry.register('CourseCategory', CourseSubCategorySchema);

courseRegistry.registerPath({
	method: 'delete',
	path: '/api/courses/categories/main/{category_id}',
	tags: ['CourseCategory'],
	responses: createApiResponse(z.string(), 'Success'),
	request: {
		headers: validateAuthHeader.shape.headers,
		params: ValidateCourseSchema.DeleteCategorySchema.shape.params,
	},
});
courseRouter.delete(
	'/categories/main/:category_id',
	authenticate,
	authorizeAdmin(true),
	validateRequest(ValidateCourseSchema.DeleteCategorySchema),
	courseController.deleteCategory,
);

courseRegistry.registerPath({
	method: 'put',
	path: '/api/courses/categories/main/{category_id}',
	tags: ['CourseCategory'],
	responses: createApiResponse(CourseCategorySchema, 'Success'),
	request: {
		headers: validateAuthHeader.shape.headers,
		params: ValidateCourseSchema.PutUpdateCategorySchema.shape.params,
		body: {
			description: 'Update a category',
			content: {
				'application/json': {
					schema: ValidateCourseSchema.PutUpdateCategorySchema.shape.body,
				},
			},
			required: true,
		},
	},
});
courseRouter.put(
	'/categories/main/:category_id',
	authenticate,
	authorizeAdmin(true),
	validateRequest(ValidateCourseSchema.PutUpdateCategorySchema),
	courseController.updateCategory,
);

courseRegistry.registerPath({
	method: 'post',
	path: '/api/courses/categories/main',
	tags: ['CourseCategory'],
	request: {
		body: {
			description: 'Create a main category',
			content: {
				'application/json': {
					schema: ValidateCourseSchema.PostCreateCategorySchema.shape.body,
				},
			},
			required: true,
		},
	},
	responses: createApiResponse(CourseCategorySchema, 'Success'),
});
courseRouter.post(
	'/categories/main',
	validateRequest(ValidateCourseSchema.PostCreateCategorySchema),
	courseController.createCategory,
);

courseRegistry.registerPath({
	method: 'get',
	path: '/api/courses/categories/main',
	tags: ['CourseCategory'],
	responses: createApiResponse(z.array(CourseCategorySchema), 'Success'),
});
courseRouter.get(
	'/categories/main',
	validateRequest(ValidateCourseSchema.GetAllCategorySchema),
	courseController.getAllMainCategories,
);

courseRegistry.registerPath({
	method: 'delete',
	path: '/api/courses/categories/sub/{subcategory_id}',
	tags: ['CourseCategory'],
	responses: createApiResponse(z.string(), 'Success'),
	request: {
		headers: validateAuthHeader.shape.headers,
		params: ValidateCourseSchema.DeleteSubCategorySchema.shape.params,
	},
});
courseRouter.delete(
	'/categories/sub/:subcategory_id',
	authenticate,
	authorizeAdmin(true),
	validateRequest(ValidateCourseSchema.DeleteSubCategorySchema),
	courseController.deleteSubCategory,
);

courseRegistry.registerPath({
	method: 'put',
	path: '/api/courses/categories/sub/{subcategory_id}',
	tags: ['CourseCategory'],
	responses: createApiResponse(CourseSubCategorySchema, 'Success'),
	request: {
		headers: validateAuthHeader.shape.headers,
		params: ValidateCourseSchema.PutUpdateSubCategorySchema.shape.params,
		body: {
			description: 'Update a sub category',
			content: {
				'application/json': {
					schema: ValidateCourseSchema.PutUpdateSubCategorySchema.shape.body,
				},
			},
			required: true,
		},
	},
});
courseRouter.put(
	'/categories/sub/:subcategory_id',
	authenticate,
	authorizeAdmin(true),
	validateRequest(ValidateCourseSchema.PutUpdateSubCategorySchema),
	authorizeCourseEditor,
	courseController.updateSubCategory,
);

courseRegistry.registerPath({
	method: 'post',
	path: '/api/courses/categories/sub',
	tags: ['CourseCategory'],
	request: {
		body: {
			description: 'Create a main category',
			content: {
				'application/json': {
					schema: ValidateCourseSchema.PostCreateSubCategorySchema.shape.body,
				},
			},
			required: true,
		},
	},
	responses: createApiResponse(CourseSubCategorySchema, 'Success'),
});
courseRouter.post(
	'/categories/sub',
	// authenticate,
	// authorizeAdmin,
	validateRequest(ValidateCourseSchema.PostCreateSubCategorySchema),
	courseController.createSubCategory,
);

courseRegistry.registerPath({
	method: 'get',
	path: '/api/courses/categories/sub',
	tags: ['CourseCategory'],
	responses: createApiResponse(CourseSubCategorySchema, 'Success'),
});
courseRouter.get(
	'/categories/sub',
	validateRequest(ValidateCourseSchema.GetAllCategorySchema),
	courseController.getAllSubCategories,
);

courseRegistry.registerPath({
	method: 'get',
	path: '/api/courses/categories',
	tags: ['CourseCategory'],
	responses: createApiResponse(
		z.array(
			CourseCategorySchema.extend({
				course_subcategories: z.array(CourseSubCategorySchema),
			}),
		),
		'Success',
	),
});
courseRouter.get(
	'/categories',
	validateRequest(ValidateCourseSchema.GetAllCategorySchema),
	courseController.getAllCategories,
);

courseRegistry.registerPath({
	method: 'post',
	path: '/api/courses',
	tags: ['Course'],
	security: [{ bearerAuth: [] }],
	request: {
		headers: validateAuthHeader.shape.headers,
		body: {
			description: 'Create a course',
			content: {
				'application/json': {
					schema: ValidateCourseSchema.PostCreateCourseSchema.shape.body,
				},
			},
			required: true,
		},
	},
	responses: createApiResponse(CourseSchema, 'Success'),
});
courseRouter.post(
	'/',
	authenticate,
	authorizeAdmin(false),
	authorizeRole(['INSTRUCTOR']),
	validateRequest(ValidateCourseSchema.PostCreateCourseSchema),
	courseController.createCourse,
);

courseRegistry.registerPath({
	method: 'put',
	path: '/api/courses/{course_id}',
	tags: ['Course'],
	security: [{ bearerAuth: [] }],
	request: {
		headers: validateAuthHeader.shape.headers,
		params: ValidateCourseSchema.PutUpdateCourseSchema.shape.params,
		body: {
			description: 'Update a course',
			content: {
				'application/json': {
					schema: ValidateCourseSchema.PutUpdateCourseSchema.shape.body,
				},
			},
			required: true,
		},
	},
	responses: createApiResponse(CourseSchema, 'Success'),
});
courseRouter.put(
	'/:course_id',
	authenticate,
	authorizeAdmin(false),
	validateRequest(ValidateCourseSchema.PutUpdateCourseSchema),
	authorizeCourseEditor,
	courseController.updateCourse,
);

courseRegistry.registerPath({
	method: 'get',
	path: '/api/courses',
	tags: ['Course'],
	request: { query: ValidateCourseSchema.GetAllCourseSchema.shape.query },
	responses: createApiResponse(
		z.object({
			courses: z.array(CourseSchema),
			totalCount: z.number(),
		}),
		'Success',
	),
});
courseRouter.get('/', validateRequest(ValidateCourseSchema.GetAllCourseSchema), courseController.getCourses);

courseRegistry.registerPath({
	method: 'get',
	path: '/api/courses/{course_id}',
	tags: ['Course'],
	request: { params: ValidateCourseSchema.GetCourseByIdSchema.shape.params },
	responses: createApiResponse(CourseSchema, 'Success'),
});
courseRouter.get(
	'/:course_id',
	validateRequest(ValidateCourseSchema.GetCourseByIdSchema),
	courseController.getCourseByID,
);
