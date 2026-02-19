import type { Prisma, course_categories, course_subcategories, courses } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { courseRepository } from '@/api/courses/course/course.repository';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';

import { validateUUID } from '@/common/validation/string.validation';
import { type CreateCategory, type CreateSubCategory, ValidateCourseSchema } from '@shared/types/courses/course.model';
import type { Course, CourseCategory, CourseSubCategory } from '@shared/types/courses/course.model';

class CourseService {
	private courseRepository: typeof courseRepository;

	constructor() {
		this.courseRepository = courseRepository;
	}

	async getAllCourses(
		limit: number,
		offset: number,
		sortBy: keyof courses = 'course_id',
		orderBy: 'asc' | 'desc' = 'asc',
		categoryId?: number,
		subCategoryId?: number,
		createdBy?: string,
		searchText?: string,
	): Promise<ServiceResponse<{ courses: courses[]; totalCount: number }>> {
		try {
			logger.info(`service createdBy: ${createdBy}`);

			const { success, data, totalCount, error } = await this.courseRepository.findAllCourses(
				limit,
				offset,
				sortBy,
				orderBy,
				categoryId,
				subCategoryId,
				createdBy,
				searchText,
			);
			if (!success) {
				if (error) {
					return ServiceResponse.failure(error, { courses: [], totalCount: 0 }, StatusCodes.INTERNAL_SERVER_ERROR);
				}
				return ServiceResponse.failure(
					'Something went wrong',
					{ courses: [], totalCount: 0 },
					StatusCodes.INTERNAL_SERVER_ERROR,
				);
			}

			if (!data || data.length === 0) {
				return ServiceResponse.success('No courses found', {
					courses: [],
					totalCount: totalCount ?? 0,
				});
			}

			// const transformedCourses = data.map((course) => ({
			// 	...course,
			// 	created_at: course.created_at ? course.created_at.toISOString() : '',
			// 	updated_at: course.updated_at ? course.updated_at.toISOString() : '',
			// 	subject_id: course.subject_id || undefined,
			// 	description: course.description || undefined,
			// }));

			return ServiceResponse.success('Courses found', {
				courses: data,
				totalCount: totalCount ?? 0,
			});
		} catch (error) {
			logger.error('Error in course service:findAll', error);
			return ServiceResponse.failure(
				'Something went wrong',
				{ courses: [], totalCount: 0 },
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async getCourseByID(courseId: string): Promise<ServiceResponse<courses | null>> {
		try {
			logger.info('Course ID:', courseId);
			const { success, data, error } = await this.courseRepository.findCourseByID(courseId);
			if (!success) {
				if (error) {
					return ServiceResponse.failure(error, null, StatusCodes.INTERNAL_SERVER_ERROR);
				}
				return ServiceResponse.failure('Something went wrong', null, StatusCodes.INTERNAL_SERVER_ERROR);
			}

			if (!data) {
				return ServiceResponse.success('Course not found', null);
			}

			// const transformedCourse = {
			// 	...data,
			// 	created_at: data.created_at ? data.created_at.toISOString() : '',
			// 	updated_at: data.updated_at ? data.updated_at.toISOString() : '',
			// 	subject_id: data.subject_id || undefined,
			// 	description: data.description || undefined,
			// };

			return ServiceResponse.success('Course found', data);
		} catch (error) {
			logger.error('Error in course service:findById', error);
			return ServiceResponse.failure('Something went wrong', null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async getCourseByCategoryID(categoryId: number): Promise<ServiceResponse<courses[]>> {
		try {
			const { success, data, error } = await this.courseRepository.findCourseByCategoryID(categoryId);
			if (!success) {
				if (error) {
					return ServiceResponse.failure(error, [], StatusCodes.INTERNAL_SERVER_ERROR);
				}
				return ServiceResponse.failure('Something went wrong', [], StatusCodes.INTERNAL_SERVER_ERROR);
			}

			if (!data || data.length === 0) {
				return ServiceResponse.success('No courses found', []);
			}

			// const transformedCourses = data.map((course) => ({
			// 	...course,
			// 	created_at: course.created_at ? course.created_at.toISOString() : '',
			// 	updated_at: course.updated_at ? course.updated_at.toISOString() : '',
			// 	subject_id: course.subject_id || undefined,
			// 	description: course.description || undefined,
			// }));

			return ServiceResponse.success('Courses found', data);
		} catch (error) {
			logger.error('Error in course service:findByCategoryID', error);
			return ServiceResponse.failure('Something went wrong', [], StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async getCourseBySubCategoryID(subCategoryId: number): Promise<ServiceResponse<courses[]>> {
		try {
			const { success, data, error } = await this.courseRepository.findCourseBySubCategoryID(subCategoryId);
			if (!success) {
				if (error) {
					return ServiceResponse.failure(error, [], StatusCodes.INTERNAL_SERVER_ERROR);
				}
				return ServiceResponse.failure('Something went wrong', [], StatusCodes.INTERNAL_SERVER_ERROR);
			}

			if (!data || data.length === 0) {
				return ServiceResponse.success('No courses found', []);
			}

			// const transformedCourses = data.map((course) => ({
			// 	...course,
			// 	created_at: course.created_at ? course.created_at.toISOString() : '',
			// 	updated_at: course.updated_at ? course.updated_at.toISOString() : '',
			// 	subject_id: course.subject_id || undefined,
			// 	description: course.description || undefined,
			// }));

			return ServiceResponse.success('Courses found', data);
		} catch (error) {
			logger.error('Error in course service:findBySubCategoryID', error);
			return ServiceResponse.failure('Something went wrong', [], StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	// async getCourseByName(name: string): Promise<ServiceResponse<courses | null>> {
	// 	try {
	// 		const { success, data, error } = await this.courseRepository.findCourseByName(name);
	// 		if (!success) {
	// 			if (error) {
	// 				return ServiceResponse.failure(error, null, StatusCodes.INTERNAL_SERVER_ERROR);
	// 			}
	// 			return ServiceResponse.failure('Something went wrong', null, StatusCodes.INTERNAL_SERVER_ERROR);
	// 		}
	// 		if (!data) {
	// 			return ServiceResponse.success('Course not found', null);
	// 		}
	// 		return ServiceResponse.success('Course found', data);
	// 	} catch (error) {
	// 		logger.error('Error in course service:findByName', error);
	// 		return ServiceResponse.failure('Something went wrong', null, StatusCodes.INTERNAL_SERVER_ERROR);
	// 	}
	// }

	async getAllCategories(): Promise<
		ServiceResponse<
			// Array<
			// 	CourseCategory & {
			// 		course_subcategories: CourseSubCategory[];
			// 	}
			// >
			Array<
				course_categories & {
					course_subcategories: course_subcategories[];
				}
			>
		>
	> {
		try {
			const { success, data, error } = await this.courseRepository.findAllCategories();
			if (!success) {
				if (error) {
					return ServiceResponse.failure(error, [], StatusCodes.INTERNAL_SERVER_ERROR);
				}
				return ServiceResponse.failure('Something went wrong', [], StatusCodes.INTERNAL_SERVER_ERROR);
			}

			if (!data || data.categories.length === 0) {
				return ServiceResponse.success('No categories found', []);
			}

			// const transformedCategories = data.categories.map((category) => ({
			// 	...category,
			// 	created_at: category.created_at instanceof Date ? category.created_at.toISOString() : '',
			// 	updated_at: category.updated_at instanceof Date ? category.updated_at.toISOString() : '',
			// 	course_subcategories: category.course_subcategories.map((subCategory) => ({
			// 		...subCategory,
			// 		created_at: subCategory.created_at instanceof Date ? subCategory.created_at.toISOString() : '',
			// 		updated_at: subCategory.updated_at instanceof Date ? subCategory.updated_at.toISOString() : '',
			// 	})),
			// }));

			return ServiceResponse.success('Categories found', data.categories);
		} catch (error) {
			logger.error('Error in course service:findAllCategories', error);
			return ServiceResponse.failure('Something went wrong', [], StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async getAllMainCategories(): Promise<ServiceResponse<course_categories[]>> {
		try {
			const { success, data, error } = await this.courseRepository.findAllMainCategories();
			if (!success) {
				if (error) {
					return ServiceResponse.failure(error, [], StatusCodes.INTERNAL_SERVER_ERROR);
				}
				return ServiceResponse.failure('Something went wrong', [], StatusCodes.INTERNAL_SERVER_ERROR);
			}

			if (!data || data.length === 0) {
				return ServiceResponse.success('No categories found', []);
			}

			// const transformedCategories = data.map((category) => ({
			// 	...category,
			// 	created_at: category.created_at ? category.created_at.toISOString() : '',
			// 	updated_at: category.updated_at ? category.updated_at.toISOString() : '',
			// }));

			return ServiceResponse.success('Categories found', data);
		} catch (error) {
			logger.error('Error in course service:findAllMainCategories', error);
			return ServiceResponse.failure('Something went wrong', [], StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async getAllSubCategories(): Promise<ServiceResponse<course_subcategories[]>> {
		try {
			const { success, data, error } = await this.courseRepository.findAllSubCategories();
			if (!success) {
				if (error) {
					return ServiceResponse.failure(error, [], StatusCodes.INTERNAL_SERVER_ERROR);
				}
				return ServiceResponse.failure('Something went wrong', [], StatusCodes.INTERNAL_SERVER_ERROR);
			}

			if (!data || data.length === 0) {
				return ServiceResponse.success('No subcategories found', []);
			}

			// const transformedSubCategories = data.map((subCategory) => ({
			// 	...subCategory,
			// 	created_at: subCategory.created_at ? subCategory.created_at.toISOString() : '',
			// 	updated_at: subCategory.updated_at ? subCategory.updated_at.toISOString() : '',
			// }));

			return ServiceResponse.success('Subcategories found', data);
		} catch (error) {
			logger.error('Error in course service:findAllSubCategories', error);
			return ServiceResponse.failure('Something went wrong', [], StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async getMainCategoryByID(categoryId: number): Promise<ServiceResponse<course_categories | null>> {
		try {
			const { success, data, error } = await this.courseRepository.findCategoryByID(categoryId);
			if (!success) {
				if (error) {
					return ServiceResponse.failure(error, null, StatusCodes.INTERNAL_SERVER_ERROR);
				}
				return ServiceResponse.failure('Something went wrong', null, StatusCodes.INTERNAL_SERVER_ERROR);
			}

			if (!data) {
				return ServiceResponse.failure('No category found', null, StatusCodes.NOT_FOUND);
			}

			// const transformedCategory = {
			// 	...data,
			// 	created_at: data.created_at ? data.created_at.toISOString() : '',
			// 	updated_at: data.updated_at ? data.updated_at.toISOString() : '',
			// };

			return ServiceResponse.success('Category found', data);
		} catch (error) {
			logger.error('Error in course service:findCategoryByID', error);
			return ServiceResponse.failure('Something went wrong', null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async getSubCategoryByID(subCategory: number): Promise<ServiceResponse<course_subcategories | null>> {
		try {
			const { success, data, error } = await this.courseRepository.findSubCategoryByID(subCategory);
			if (!success) {
				if (error) {
					return ServiceResponse.failure(error, null, StatusCodes.INTERNAL_SERVER_ERROR);
				}
				return ServiceResponse.failure('Something went wrong', null, StatusCodes.INTERNAL_SERVER_ERROR);
			}

			if (!data) {
				return ServiceResponse.failure('No subcategory found', null, StatusCodes.NOT_FOUND);
			}

			// const transformedSubCategory = {
			// 	...data,
			// 	created_at: data.created_at ? data.created_at.toISOString() : '',
			// 	updated_at: data.updated_at ? data.updated_at.toISOString() : '',
			// };
			return ServiceResponse.success('Subcategory found', data);
		} catch (error) {
			logger.error('Error in course service:findSubCategoryByID', error);
			return ServiceResponse.failure('Something went wrong', null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async createMainCategory(category: CreateCategory): Promise<ServiceResponse<course_categories | null>> {
		try {
			const categories = await this.courseRepository.findCategoryByName(category.name);
			const isCategoryExists = categories.success;
			if (isCategoryExists) {
				return ServiceResponse.failure('Category already exists', null, StatusCodes.CONFLICT);
			}

			const { success, data, error } = await this.courseRepository.createCategory(category);
			if (!success) {
				if (error) {
					return ServiceResponse.failure(error, null, StatusCodes.INTERNAL_SERVER_ERROR);
				}
				return ServiceResponse.failure('Something went wrong', null, StatusCodes.INTERNAL_SERVER_ERROR);
			}

			if (!data) {
				return ServiceResponse.failure('Category not created', null, StatusCodes.INTERNAL_SERVER_ERROR);
			}

			// const transformedCategory = {
			// 	...data,
			// 	created_at: data.created_at ? data.created_at.toISOString() : '',
			// 	updated_at: data.updated_at ? data.updated_at.toISOString() : '',
			// };

			return ServiceResponse.success('Category created', data);
		} catch (error) {
			logger.error('Error in course service:createMainCategory', error);
			return ServiceResponse.failure('Something went wrong', null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async createSubCategory(subCategory: CreateSubCategory): Promise<ServiceResponse<course_subcategories | null>> {
		try {
			const allSubCategory = await this.courseRepository.findAllSubCategoriesByCategoryID(subCategory.category_id);

			if (!allSubCategory) {
				return ServiceResponse.failure('Category not found', null, StatusCodes.NOT_FOUND);
			}

			const isSubCategoryNameExists = allSubCategory.data?.find((subCat) => subCat.name === subCategory.name);
			if (isSubCategoryNameExists) {
				return ServiceResponse.failure('Subcategory already exists', null, StatusCodes.CONFLICT);
			}

			const { success, data, error } = await this.courseRepository.createSubCategory(subCategory);

			if (!success) {
				if (error) {
					return ServiceResponse.failure(error, null, StatusCodes.INTERNAL_SERVER_ERROR);
				}
				return ServiceResponse.failure('Something went wrong', null, StatusCodes.INTERNAL_SERVER_ERROR);
			}

			if (!data) {
				return ServiceResponse.failure('Subcategory not created', null, StatusCodes.INTERNAL_SERVER_ERROR);
			}

			// const transformedSubCategory = {
			// 	...data,
			// 	created_at: data.created_at ? data.created_at.toISOString() : '',
			// 	updated_at: data.updated_at ? data.updated_at.toISOString() : '',
			// };

			return ServiceResponse.success('Subcategory created', data);
		} catch (error) {
			logger.error('Error in course service:createSubCategory', error);
			return ServiceResponse.failure('Something went wrong', null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async createCourse(course: Prisma.coursesCreateInput): Promise<ServiceResponse<courses | null>> {
		try {
			const { success, data, error } = await this.courseRepository.createCourse(course);
			if (!success) {
				if (error) {
					return ServiceResponse.failure(error, null, StatusCodes.INTERNAL_SERVER_ERROR);
				}
				return ServiceResponse.failure('Something went wrong', null, StatusCodes.INTERNAL_SERVER_ERROR);
			}

			if (!data) {
				return ServiceResponse.failure('Course not created', null, StatusCodes.INTERNAL_SERVER_ERROR);
			}

			// const transformedCourse = {
			// 	...data,
			// 	created_at: data.created_at ? data.created_at.toISOString() : '',
			// 	updated_at: data.updated_at ? data.updated_at.toISOString() : '',
			// 	subject_id: data.subject_id || undefined,
			// 	description: data.description || undefined,
			// };

			return ServiceResponse.success('Course created', data);
		} catch (error) {
			logger.error('Error in course service:createCourse', error);
			return ServiceResponse.failure('Something went wrong', null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async updateCourse(courseId: string, course: Prisma.coursesUpdateInput): Promise<ServiceResponse<courses | null>> {
		if (!validateUUID(courseId)) {
			return Promise.resolve(ServiceResponse.failure('Invalid course ID', null, StatusCodes.BAD_REQUEST));
		}

		return this.courseRepository.updateCourse(courseId, course).then(({ success, data, error }) => {
			if (!success) {
				if (error) {
					return ServiceResponse.failure(error, null, StatusCodes.INTERNAL_SERVER_ERROR);
				}
				return ServiceResponse.failure('Something went wrong', null, StatusCodes.INTERNAL_SERVER_ERROR);
			}

			if (!data) {
				return ServiceResponse.failure('Course not updated', null, StatusCodes.INTERNAL_SERVER_ERROR);
			}

			return ServiceResponse.success('Course updated', data);
		});
	}

	async updateCategory(categoryId: number, name: string): Promise<ServiceResponse<course_categories | null>> {
		if (!categoryId) {
			return Promise.resolve(ServiceResponse.failure('Invalid category ID', null, StatusCodes.BAD_REQUEST));
		}
		if (!name) {
			return Promise.resolve(ServiceResponse.failure('Category name is required', null, StatusCodes.BAD_REQUEST));
		}

		const categoryData: Prisma.course_categoriesUpdateInput = {
			name,
		};

		return this.courseRepository.updateCategory(categoryId, categoryData).then(({ success, data, error }) => {
			if (!success) {
				if (error) {
					return ServiceResponse.failure(error, null, StatusCodes.INTERNAL_SERVER_ERROR);
				}
				return ServiceResponse.failure('Something went wrong', null, StatusCodes.INTERNAL_SERVER_ERROR);
			}

			if (!data) {
				return ServiceResponse.failure('Category not updated', null, StatusCodes.INTERNAL_SERVER_ERROR);
			}

			return ServiceResponse.success('Category updated', data);
		});
	}

	async updateSubCategory(
		subCategoryId: number,
		name: string,
		categoryId: number,
	): Promise<ServiceResponse<course_subcategories | null>> {
		if (!subCategoryId) {
			return ServiceResponse.failure('Invalid subcategory ID', null, StatusCodes.BAD_REQUEST);
		}
		if (!name) {
			return ServiceResponse.failure('Subcategory name is required', null, StatusCodes.BAD_REQUEST);
		}

		const subCategoryData: Prisma.course_subcategoriesUpdateInput = {
			name,
			course_categories: {
				connect: {
					category_id: categoryId,
				},
			},
		};

		return this.courseRepository.updateSubCategory(subCategoryId, subCategoryData).then(({ success, data, error }) => {
			if (!success) {
				if (error) {
					return ServiceResponse.failure(error, null, StatusCodes.INTERNAL_SERVER_ERROR);
				}
				return ServiceResponse.failure('Something went wrong', null, StatusCodes.INTERNAL_SERVER_ERROR);
			}

			if (!data) {
				return ServiceResponse.failure('Subcategory not updated', null, StatusCodes.INTERNAL_SERVER_ERROR);
			}

			return ServiceResponse.success('Subcategory updated', data);
		});
	}

	async deleteCourseCategory(categoryId: number): Promise<ServiceResponse<null>> {
		try {
			const { success, data, error } = await this.courseRepository.deleteCategory(categoryId);
			if (!success) {
				if (error) {
					return ServiceResponse.failure(error, null, StatusCodes.INTERNAL_SERVER_ERROR);
				}
				return ServiceResponse.failure('Something went wrong', null, StatusCodes.INTERNAL_SERVER_ERROR);
			}

			return ServiceResponse.success('Category deleted', null, StatusCodes.NO_CONTENT);
		} catch (error) {
			logger.error('Error in course service:deleteCourseCategory', error);
			return ServiceResponse.failure('Something went wrong', null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async deleteCourseSubCategory(subCategoryId: number): Promise<ServiceResponse<null>> {
		try {
			const { success, data, error } = await this.courseRepository.deleteSubCategory(subCategoryId);
			if (!success) {
				if (error) {
					return ServiceResponse.failure(error, null, StatusCodes.INTERNAL_SERVER_ERROR);
				}
				return ServiceResponse.failure('Something went wrong', null, StatusCodes.INTERNAL_SERVER_ERROR);
			}

			return ServiceResponse.success('Subcategory deleted', null, StatusCodes.NO_CONTENT);
		} catch (error) {
			logger.error('Error in course service:deleteCourseSubCategory', error);
			return ServiceResponse.failure('Something went wrong', null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}
}

export const courseService = new CourseService();
