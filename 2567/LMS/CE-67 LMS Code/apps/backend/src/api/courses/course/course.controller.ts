import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { courseService } from '@/api/courses/course/course.service';
import { userService } from '@/api/users/user/user.service';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { handleServiceResponse } from '@/common/utils/httpHandlers.util';
import { logger } from '@/server';

import type { Prisma, courses } from '@prisma/client';

import type { CreateCategory, CreateSubCategory } from '@shared/types/courses/course.model';

class CourseController {
	public notImplemented: RequestHandler = async (_req: Request, res: Response) => {
		logger.warn('[Controller] Not implemented');
		return handleServiceResponse(
			ServiceResponse.failure('[Controller] Not implemented.', null, StatusCodes.NOT_IMPLEMENTED),
			res,
		);
	};

	public getCourses: RequestHandler = async (req: Request, res: Response) => {
		if (!req.validatedData || !req.validatedData.query) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Invalid request data', null), res);
		}

		const { query } = req.validatedData;

		logger.info(`[Controller] getCourses: ${JSON.stringify(req.validatedData)}`);

		const { limit, offset, sortBy, orderBy, categoryId, subCategoryId, createdBy, searchText } = query;
		const serviceResponse = await courseService.getAllCourses(
			limit,
			offset,
			sortBy as keyof courses,
			orderBy,
			categoryId,
			subCategoryId,
			createdBy,
			searchText,
		);
		return handleServiceResponse(serviceResponse, res);
	};

	public getCourseByID: RequestHandler = async (req: Request, res: Response) => {
		const course_id = req.params.course_id;
		const serviceResponse = await courseService.getCourseByID(course_id);
		return handleServiceResponse(serviceResponse, res);
	};

	public getCourseByCategoryID: RequestHandler = async (req: Request, res: Response) => {
		const id = Number.parseInt(req.params.id as string, 10);
		const serviceResponse = await courseService.getCourseByCategoryID(id);
		return handleServiceResponse(serviceResponse, res);
	};

	public getCoursedBySubCategoryID: RequestHandler = async (req: Request, res: Response) => {
		const id = Number.parseInt(req.params.id as string, 10);
		const serviceResponse = await courseService.getCourseBySubCategoryID(id);
		return handleServiceResponse(serviceResponse, res);
	};

	public getAllCategories: RequestHandler = async (_req: Request, res: Response) => {
		const serviceResponse = await courseService.getAllCategories();
		return handleServiceResponse(serviceResponse, res);
	};

	public getAllMainCategories: RequestHandler = async (_req: Request, res: Response) => {
		const serviceResponse = await courseService.getAllMainCategories();
		return handleServiceResponse(serviceResponse, res);
	};

	public getAllSubCategories: RequestHandler = async (_req: Request, res: Response) => {
		const serviceResponse = await courseService.getAllSubCategories();
		return handleServiceResponse(serviceResponse, res);
	};

	public createCategory: RequestHandler = async (req: Request, res: Response) => {
		if (!req.validatedData || !req.validatedData.body) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Invalid request data', null), res);
		}
		const { body } = req.validatedData;

		if (!body.name) {
			return handleServiceResponse(
				ServiceResponse.failure('Category name is required', null, StatusCodes.BAD_REQUEST),
				res,
			);
		}
		const { name } = body;

		const categoryInput: CreateCategory = {
			name,
		};

		const serviceResponse = await courseService.createMainCategory(categoryInput);
		return handleServiceResponse(serviceResponse, res);
	};

	public createSubCategory: RequestHandler = async (req: Request, res: Response) => {
		if (!req.validatedData || !req.validatedData.body) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Invalid request data', null), res);
		}
		const { body } = req.validatedData;

		if (!body.name || !body.category_id) {
			return handleServiceResponse(
				ServiceResponse.failure('Category name and category ID is required', null, StatusCodes.BAD_REQUEST),
				res,
			);
		}
		const { name, category_id } = body;

		const subCategoryInput: CreateSubCategory = {
			name,
			category_id,
		};

		const serviceResponse = await courseService.createSubCategory(subCategoryInput);
		return handleServiceResponse(serviceResponse, res);
	};

	public createCourse: RequestHandler = async (req: Request, res: Response, _next: NextFunction) => {
		if (!req.user) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Invalid request data', null), res);
		}
		const userRequest = req.user;

		// validate user
		if (!userRequest.user_id) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Invalid request data', null), res);
		}

		if (userRequest.user_role !== 'INSTRUCTOR' && !req.isAdmin) {
			return handleServiceResponse(
				ServiceResponse.failure('[Controller] User is not an Instructor or Admin', null, StatusCodes.FORBIDDEN),
				res,
			);
		}

		const checkUserServiceResponse = await userService.getUserByID(userRequest.user_id);
		if (!checkUserServiceResponse.success || !checkUserServiceResponse.responseObject) {
			return handleServiceResponse(checkUserServiceResponse, res);
		}

		// validate request
		if (!req.validatedData || !req.validatedData.body) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Invalid request data', null), res);
		}
		const { body } = req.validatedData;
		const { name, description, subject_id, category_id, subcategory_id, course_language } = body;

		if (!name || !description || !category_id || !subcategory_id || !course_language) {
			return handleServiceResponse(
				ServiceResponse.failure('All fields are required', null, StatusCodes.BAD_REQUEST),
				res,
			);
		}

		// validate category_id and subcategory_id if exists on database
		const categoryServiceResponse = await courseService.getMainCategoryByID(category_id);
		if (!categoryServiceResponse.success || !categoryServiceResponse.responseObject) {
			return handleServiceResponse(categoryServiceResponse, res);
		}
		const subCategoryServiceResponse = await courseService.getSubCategoryByID(subcategory_id);
		if (!subCategoryServiceResponse.success || !subCategoryServiceResponse.responseObject) {
			return handleServiceResponse(subCategoryServiceResponse, res);
		}

		const prismaCoursesInput: Prisma.coursesCreateInput = {
			name,
			description,
			subject_id,
			course_language,
			course_categories: {
				connect: {
					category_id: category_id,
				},
			},
			course_subcategories: {
				connect: {
					subcategory_id: subcategory_id,
				},
			},
			users: {
				connect: {
					user_id: userRequest.user_id,
				},
			},
		};

		const serviceResponse = await courseService.createCourse(prismaCoursesInput);
		console.log('serviceResponse', serviceResponse);
		return handleServiceResponse(serviceResponse, res);
	};

	public updateCourse: RequestHandler = async (req: Request, res: Response) => {
		if (!req.validatedData || !req.validatedData.body || !req.validatedData.params) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Invalid request data', null), res);
		}

		const { body, params } = req.validatedData;

		if (!params.course_id) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Invalid course ID', null), res);
		}

		const { course_id } = params;

		if (!body.name || !body.description || !body.category_id || !body.course_language) {
			return handleServiceResponse(
				ServiceResponse.failure('All fields are required', null, StatusCodes.BAD_REQUEST),
				res,
			);
		}

		if (req.course?.subject_id) {
			if (req.course.subject_id !== body.subject_id) {
				return handleServiceResponse(
					ServiceResponse.failure('Subject ID cannot be changed', null, StatusCodes.BAD_REQUEST),
					res,
				);
			}
		}

		if (req.course?.course_id) {
			if (req.course.course_id !== course_id) {
				return handleServiceResponse(
					ServiceResponse.failure('Course ID cannot be changed', null, StatusCodes.BAD_REQUEST),
					res,
				);
			}
		}

		const { name, description, subject_id, category_id, subcategory_id, course_language } = body;
		const prismaCoursesInput: Prisma.coursesUpdateInput = {
			name,
			description,
			subject_id,
			course_language,
			course_categories: {
				connect: {
					category_id: category_id,
				},
			},
			course_subcategories: {
				connect: {
					subcategory_id: subcategory_id,
				},
			},
		};

		const serviceResponse = await courseService.updateCourse(course_id, prismaCoursesInput);

		return handleServiceResponse(serviceResponse, res);
	};

	public updateCategory: RequestHandler = async (req: Request, res: Response) => {
		if (!req.validatedData || !req.validatedData.body || !req.validatedData.params) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Invalid request data', null), res);
		}

		const { body, params } = req.validatedData;

		if (!params.category_id) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Invalid category ID', null), res);
		}

		const { category_id } = params;

		if (!body.name) {
			return handleServiceResponse(ServiceResponse.failure('Category name is required', null), res);
		}

		const { name } = body;

		const serviceResponse = await courseService.updateCategory(category_id, name);

		return handleServiceResponse(serviceResponse, res);
	};

	public updateSubCategory: RequestHandler = async (req: Request, res: Response) => {
		if (!req.validatedData || !req.validatedData.body || !req.validatedData.params) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Invalid request data', null), res);
		}

		const { body, params } = req.validatedData;

		if (!params.subcategory_id) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Invalid subcategory ID', null), res);
		}

		const { subcategory_id } = params;

		if (!body.name || !body.category_id) {
			return handleServiceResponse(ServiceResponse.failure('Category name and category ID is required', null), res);
		}

		const { name, category_id } = body;

		const serviceResponse = await courseService.updateSubCategory(subcategory_id, name, category_id);

		return handleServiceResponse(serviceResponse, res);
	};

	public deleteCategory: RequestHandler = async (req: Request, res: Response) => {
		if (!req.validatedData || !req.validatedData.params) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Invalid request data', null), res);
		}

		const { params } = req.validatedData;

		if (!params.category_id) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Invalid category ID', null), res);
		}

		const { category_id } = params;

		const serviceResponse = await courseService.deleteCourseCategory(category_id);

		return handleServiceResponse(serviceResponse, res);
	};

	public deleteSubCategory: RequestHandler = async (req: Request, res: Response) => {
		if (!req.validatedData || !req.validatedData.params) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Invalid request data', null), res);
		}

		const { params } = req.validatedData;

		if (!params.subcategory_id) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Invalid subcategory ID', null), res);
		}

		const { subcategory_id } = params;

		const serviceResponse = await courseService.deleteCourseSubCategory(subcategory_id);

		return handleServiceResponse(serviceResponse, res);
	};
}

export const courseController = new CourseController();
