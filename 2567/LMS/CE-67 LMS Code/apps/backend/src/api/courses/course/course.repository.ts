import type {
	Prisma,
	PrismaClient,
	course_categories,
	course_subcategories,
	courses,
	media_files,
	users,
} from '@prisma/client';

import { prisma } from '@/common/utils/database.util';
import { validateUUID } from '@/common/validation/string.validation';
import { logger } from '@/server';

class CourseRepository {
	private database: PrismaClient;

	constructor() {
		this.database = prisma;
	}

	async findAllCourses(
		limit: number,
		offset: number,
		sortBy: keyof courses = 'course_id',
		orderBy: 'asc' | 'desc' = 'asc',
		categoryId?: number,
		subCategoryId?: number,
		createdBy?: string,
		searchText?: string,
	): Promise<{
		success: boolean;
		data?: courses[];
		totalCount?: number;
		error?: string;
	}> {
		try {
			const where: Prisma.coursesWhereInput = {};

			if (searchText && searchText.trim() !== '') {
				where.OR = [
					{ name: { contains: searchText, mode: 'insensitive' } },
					{
						users: {
							OR: [
								{ firstname_en: { contains: searchText, mode: 'insensitive' } },
								{ lastname_en: { contains: searchText, mode: 'insensitive' } },
							],
						},
					},
				];
			} else if (searchText === '') {
				return { success: true, data: [], totalCount: 0 };
			}

			if (categoryId) {
				where.category_id = categoryId;
			}

			if (subCategoryId) {
				where.subcategory_id = subCategoryId;
			}

			// Add filter by creator if provided
			if (createdBy) {
				where.created_by = createdBy;
			}

			const [data, totalCount] = await Promise.all([
				this.database.courses.findMany({
					where,
					take: limit,
					skip: offset,
					orderBy: { [sortBy]: orderBy },
					include: {
						// Include user data to provide complete information
						users: {
							select: {
								user_id: true,
								firstname_en: true,
								lastname_en: true,
							},
						},
					},
				}),
				this.database.courses.count({ where }),
			]);

			if (!data) {
				return {
					success: false,
					data: [],
					totalCount,
					error: '[courses repository] An error occurred while retrieving courses',
				};
			}

			if (data.length === 0) {
				return {
					success: true,
					data: [],
					totalCount,
				};
			}

			const coursesWithAvatar = await Promise.all(
				data.map(async (course) => {
					const avatar = await this.database.media_files.findFirst({
						where: {
							reference_id: course.course_id,
							reference_type: 'COURSE_AVATAR',
						},
					});

					const fullAvatarUrl = avatar ? `${process.env.MEDIA_SERVER_URL}/${avatar.url}` : '';

					return {
						...course,
						avatar: avatar
							? {
									...avatar,
									url: fullAvatarUrl,
									// created_at: avatar.created_at instanceof Date ? avatar.created_at.toISOString() : avatar.created_at,
									// updated_at: avatar.updated_at instanceof Date ? avatar.updated_at.toISOString() : avatar.updated_at,
								}
							: null,
					};
				}),
			);

			return {
				success: true,
				data: coursesWithAvatar,
				totalCount,
			};
		} catch (error) {
			const headerMessage = '[courses repository] An error occurred while retrieving courses';

			if (error instanceof Error) {
				return { success: false, error: error.message };
			}

			return { success: false, error: `${headerMessage}` };
		}
	}

	async findCourseByID(courseId: string): Promise<{
		success: boolean;
		data?: courses | null;
		error?: string;
	}> {
		logger.info(`[courses repository] Finding course by ID: ${courseId}`);
		if (!validateUUID(courseId)) {
			return {
				success: false,
				data: null,
				error: '[courses repository] Invalid course ID',
			};
		}

		try {
			const [course, mediaFiles] = await Promise.all([
				this.database.courses.findUnique({
					where: { course_id: courseId },
					include: {
						users: {
							select: {
								user_id: true,
								firstname_en: true,
								lastname_en: true,
							},
						},
					},
				}),
				this.database.media_files.findMany({
					where: {
						reference_id: courseId,
						reference_type: {
							in: ['COURSE_AVATAR', 'COURSE_INTRO_VIDEO'],
						},
					},
				}),
			]);

			if (!course) {
				return {
					success: false,
					data: null,
					error: '[courses repository] Course not found',
				};
			}

			let avatar = null;
			let introVideo = null;

			for (const file of mediaFiles) {
				const isYoutubeLink =
					typeof file.url === 'string' && /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(file.url);

				const fileWithFullUrl = {
					...file,
					url: isYoutubeLink ? file.url : `${process.env.MEDIA_SERVER_URL}/${file.url}`,
					// created_at: file.created_at instanceof Date ? file.created_at.toISOString() : file.created_at,
					// updated_at: file.updated_at instanceof Date ? file.updated_at.toISOString() : file.updated_at,
				};

				if (file.reference_type === 'COURSE_AVATAR') avatar = fileWithFullUrl;
				if (file.reference_type === 'COURSE_INTRO_VIDEO') introVideo = fileWithFullUrl;
			}

			const modifiedCourse = {
				...course,
				avatar,
				intro_video: introVideo,
			};

			return { success: true, data: modifiedCourse };
		} catch (error) {
			const headerMessage = '[courses repository] An error occurred while retrieving course';
			if (error instanceof Error) {
				return { success: false, error: error.message };
			}
			return { success: false, error: `${headerMessage}` };
		}
	}

	// async createCourse(
	// 	courseData: Prisma.coursesCreateInput
	// )

	async findCourseByCategoryName(category: string): Promise<{
		success: boolean;
		data?: courses[];
		error?: string;
	}> {
		try {
			const data = await this.database.courses.findMany({
				where: {
					course_categories: {
						name: category,
					},
				},
				include: {
					users: {
						select: {
							user_id: true,
							firstname_en: true,
							lastname_en: true,
						},
					},
				},
			});
			if (!data) {
				return {
					success: false,
					data: [],
					error: '[courses repository] Courses not found',
				};
			}

			return { success: true, data };
		} catch (error) {
			const headerMessage = '[courses repository] An error occurred while retrieving courses';

			if (error instanceof Error) {
				return { success: false, error: error.message };
			}

			return { success: false, error: `${headerMessage}` };
		}
	}

	async findCourseByCategoryID(categoryId: number): Promise<{
		success: boolean;
		data?: courses[];
		error?: string;
	}> {
		try {
			const data = await this.database.courses.findMany({
				where: {
					category_id: categoryId,
				},
				include: {
					users: {
						select: {
							user_id: true,
							firstname_en: true,
							lastname_en: true,
						},
					},
				},
			});
			if (!data) {
				return {
					success: false,
					data: [],
					error: '[courses repository] Courses not found',
				};
			}

			return { success: true, data };
		} catch (error) {
			const headerMessage = '[courses repository] An error occurred while retrieving courses';

			if (error instanceof Error) {
				return { success: false, error: error.message };
			}

			return { success: false, error: `${headerMessage}` };
		}
	}

	async findCourseBySubCategoryName(subCategory: string): Promise<{
		success: boolean;
		data?: courses[];
		error?: string;
	}> {
		try {
			const data = await this.database.courses.findMany({
				where: {
					course_subcategories: {
						name: subCategory,
					},
				},
				include: {
					users: {
						select: {
							user_id: true,
							firstname_en: true,
							lastname_en: true,
						},
					},
				},
			});
			if (!data) {
				return {
					success: false,
					data: [],
					error: '[courses repository] Courses not found',
				};
			}

			return { success: true, data };
		} catch (error) {
			const headerMessage = '[courses repository] An error occurred while retrieving courses';

			if (error instanceof Error) {
				return { success: false, error: error.message };
			}

			return { success: false, error: `${headerMessage}` };
		}
	}

	async findCourseBySubCategoryID(subCategoryId: number): Promise<{
		success: boolean;
		data?: courses[];
		error?: string;
	}> {
		try {
			const data = await this.database.courses.findMany({
				where: {
					subcategory_id: subCategoryId,
				},
				include: {
					users: {
						select: {
							user_id: true,
							firstname_en: true,
							lastname_en: true,
						},
					},
				},
			});
			if (!data) {
				return {
					success: false,
					data: [],
					error: '[courses repository] Courses not found',
				};
			}

			return { success: true, data };
		} catch (error) {
			const headerMessage = '[courses repository] An error occurred while retrieving courses';

			if (error instanceof Error) {
				return { success: false, error: error.message };
			}

			return { success: false, error: `${headerMessage}` };
		}
	}

	async findCategoryByName(category: string): Promise<{
		success: boolean;
		data?: course_categories | null;
		error?: string;
	}> {
		try {
			const data = await this.database.course_categories.findUnique({
				where: { name: category },
			});
			if (!data) {
				return {
					success: false,
					data: null,
					error: '[courses repository] Category not found',
				};
			}

			return { success: true, data };
		} catch (error) {
			const headerMessage = '[courses repository] An error occurred while retrieving category';

			if (error instanceof Error) {
				return { success: false, error: error.message };
			}

			return { success: false, error: `${headerMessage}` };
		}
	}

	async findCategoryByID(categoryId: number): Promise<{
		success: boolean;
		data?: course_categories | null;
		error?: string;
	}> {
		try {
			const data = await this.database.course_categories.findUnique({
				where: { category_id: categoryId },
				include: {
					course_subcategories: true,
				},
			});
			if (!data) {
				return {
					success: false,
					data: null,
					error: '[courses repository] Category not found',
				};
			}

			return { success: true, data };
		} catch (error) {
			const headerMessage = '[courses repository] An error occurred while retrieving category';

			if (error instanceof Error) {
				return { success: false, error: error.message };
			}

			return { success: false, error: `${headerMessage}` };
		}
	}

	async findSubCategoryByID(subCategoryId: number): Promise<{
		success: boolean;
		data?: course_subcategories | null;
		error?: string;
	}> {
		try {
			const data = await this.database.course_subcategories.findUnique({
				where: { subcategory_id: subCategoryId },
			});
			if (!data) {
				return {
					success: false,
					data: null,
					error: '[courses repository] Subcategory not found',
				};
			}
			return { success: true, data };
		} catch (error) {
			const headerMessage = '[courses repository] An error occurred while retrieving subcategory';
			if (error instanceof Error) {
				return { success: false, error: error.message };
			}
			return { success: false, error: `${headerMessage}` };
		}
	}

	async findAllCategories(): Promise<{
		success: boolean;
		data?: {
			categories: Array<
				course_categories & {
					course_subcategories: course_subcategories[];
				}
			>;
		};
		error?: string;
	}> {
		try {
			const categories = await this.database.course_categories.findMany({
				include: {
					course_subcategories: true,
				},
			});

			if (!categories) {
				return {
					success: false,
					error: '[courses repository] Categories not found',
				};
			}

			return { success: true, data: { categories } };
		} catch (error) {
			const headerMessage = '[courses repository] An error occurred while retrieving categories';

			if (error instanceof Error) {
				return { success: false, error: error.message };
			}

			return { success: false, error: `${headerMessage}` };
		}
	}

	async findAllMainCategories(): Promise<{
		success: boolean;
		data?: course_categories[];
		error?: string;
	}> {
		try {
			const data = await this.database.course_categories.findMany();
			if (!data) {
				return {
					success: false,
					data: [],
					error: '[courses repository] Categories not found',
				};
			}

			return { success: true, data };
		} catch (error) {
			const headerMessage = '[courses repository] An error occurred while retrieving categories';

			if (error instanceof Error) {
				return { success: false, error: error.message };
			}

			return { success: false, error: `${headerMessage}` };
		}
	}

	async findAllSubCategories(): Promise<{
		success: boolean;
		data?: course_subcategories[];
		error?: string;
	}> {
		try {
			const data = await this.database.course_subcategories.findMany();
			if (!data) {
				return {
					success: false,
					data: [],
					error: '[courses repository] Subcategories not found',
				};
			}

			return { success: true, data };
		} catch (error) {
			const headerMessage = '[courses repository] An error occurred while retrieving subcategories';

			if (error instanceof Error) {
				return { success: false, error: error.message };
			}

			return { success: false, error: `${headerMessage}` };
		}
	}

	async findAllSubCategoriesByCategoryID(categoryId: number): Promise<{
		success: boolean;
		data?: course_subcategories[];
		error?: string;
	}> {
		try {
			const data = await this.database.course_subcategories.findMany({
				where: { category_id: categoryId },
			});
			if (!data) {
				return {
					success: false,
					data: [],
					error: '[courses repository] Subcategories not found',
				};
			}

			return { success: true, data };
		} catch (error) {
			const headerMessage = '[courses repository] An error occurred while retrieving subcategories';

			if (error instanceof Error) {
				return { success: false, error: error.message };
			}

			return { success: false, error: `${headerMessage}` };
		}
	}

	async createCategory(categoryData: Prisma.course_categoriesCreateInput): Promise<{
		success: boolean;
		data?: course_categories;
		error?: string;
	}> {
		try {
			const data = await this.database.course_categories.create({ data: categoryData });
			if (!data) {
				return {
					success: false,
					data: undefined,
					error: '[courses repository] An error occurred while creating category',
				};
			}

			return { success: true, data };
		} catch (error) {
			const headerMessage = '[courses repository] An error occurred while creating category';

			if (error instanceof Error) {
				return { success: false, error: error.message };
			}

			return { success: false, error: `${headerMessage}` };
		}
	}

	async createSubCategory(subCategoryData: { name: string; category_id: number }): Promise<{
		success: boolean;
		data?: course_subcategories;
		error?: string;
	}> {
		try {
			const data = await this.database.course_subcategories.create({
				data: {
					name: subCategoryData.name,
					course_categories: {
						connect: { category_id: subCategoryData.category_id },
					},
				},
			});

			return { success: true, data };
		} catch (error) {
			const headerMessage = '[courses repository] An error occurred while creating subcategory';

			if (error instanceof Error) {
				return { success: false, error: error.message };
			}

			return { success: false, error: `${headerMessage}` };
		}
	}

	async createCourse(courseData: Prisma.coursesCreateInput): Promise<{
		success: boolean;
		data?: courses;
		error?: string;
	}> {
		try {
			const data = await this.database.courses.create({ data: courseData });
			if (!data) {
				return {
					success: false,
					data: undefined,
					error: '[courses repository] An error occurred while creating course',
				};
			}

			return { success: true, data };
		} catch (error) {
			const headerMessage = '[courses repository] An error occurred while creating course';

			if (error instanceof Error) {
				return { success: false, error: error.message };
			}

			return { success: false, error: `${headerMessage}` };
		}
	}

	async updateCourse(
		courseId: string,
		courseData: Prisma.coursesUpdateInput,
	): Promise<{
		success: boolean;
		data?: courses | null;
		error?: string;
	}> {
		if (!validateUUID(courseId)) {
			return {
				success: false,
				data: null,
				error: '[courses repository] Invalid course ID',
			};
		}

		try {
			const data = await this.database.courses.update({
				where: { course_id: courseId },
				data: courseData,
			});

			if (!data) {
				return {
					success: false,
					data: null,
					error: '[courses repository] Course not found',
				};
			}

			return { success: true, data };
		} catch (error) {
			const headerMessage = '[courses repository] An error occurred while updating course';

			if (error instanceof Error) {
				return { success: false, error: error.message };
			}

			return { success: false, error: `${headerMessage}` };
		}
	}

	async updateCategory(
		categoryId: number,
		categoryData: Prisma.course_categoriesUpdateInput,
	): Promise<{
		success: boolean;
		data?: course_categories | null;
		error?: string;
	}> {
		if (!categoryId) {
			return {
				success: false,
				data: null,
				error: '[courses repository] Invalid category ID',
			};
		}

		try {
			const data = await this.database.course_categories.update({
				where: { category_id: categoryId },
				data: categoryData,
			});

			if (!data) {
				return {
					success: false,
					data: null,
					error: '[courses repository] Category not found',
				};
			}

			return { success: true, data };
		} catch (error) {
			const headerMessage = '[courses repository] An error occurred while updating category';

			if (error instanceof Error) {
				return { success: false, error: error.message };
			}

			return { success: false, error: `${headerMessage}` };
		}
	}

	async updateSubCategory(
		subCategoryId: number,
		subCategoryData: Prisma.course_subcategoriesUpdateInput,
	): Promise<{
		success: boolean;
		data?: course_subcategories | null;
		error?: string;
	}> {
		if (!subCategoryId) {
			return {
				success: false,
				data: null,
				error: '[courses repository] Invalid subcategory ID',
			};
		}

		try {
			const data = await this.database.course_subcategories.update({
				where: { subcategory_id: subCategoryId },
				data: subCategoryData,
			});

			if (!data) {
				return {
					success: false,
					data: null,
					error: '[courses repository] Subcategory not found',
				};
			}

			return { success: true, data };
		} catch (error) {
			const headerMessage = '[courses repository] An error occurred while updating subcategory';

			if (error instanceof Error) {
				return { success: false, error: error.message };
			}

			return { success: false, error: `${headerMessage}` };
		}
	}

	async deleteCategory(categoryId: number): Promise<{
		success: boolean;
		data?: null;
		error?: string;
	}> {
		if (!categoryId) {
			return {
				success: false,
				data: null,
				error: '[courses repository] Invalid category ID',
			};
		}

		try {
			// delete category only if it has no linked subcategories
			// and no courses linked to it
			const result = await this.database.course_categories.deleteMany({
				where: {
					category_id: categoryId,
					course_subcategories: {
						none: {},
					},
					courses: {
						none: {},
					},
				},
			});

			if (result.count === 0) {
				return {
					success: false,
					data: null,
					error: '[courses repository] Category not found or has linked (course_subcategories or courses)',
				};
			}

			return { success: true, data: null };
		} catch (error) {
			const headerMessage = '[courses repository] An error occurred while deleting category';

			if (error instanceof Error) {
				return { success: false, error: error.message };
			}
			return { success: false, error: `${headerMessage}` };
		}
	}

	async deleteSubCategory(subCategoryId: number): Promise<{
		success: boolean;
		data?: null;
		error?: string;
	}> {
		if (!subCategoryId) {
			return {
				success: false,
				data: null,
				error: '[courses repository] Invalid subcategory ID',
			};
		}

		try {
			// delete subcategory only if it has no linked courses
			const result = await this.database.course_subcategories.deleteMany({
				where: {
					subcategory_id: subCategoryId,
					courses: {
						none: {},
					},
				},
			});

			if (result.count === 0) {
				return {
					success: false,
					data: null,
					error: '[courses repository] Subcategory not found or has linked courses',
				};
			}

			return { success: true, data: null };
		} catch (error) {
			const headerMessage = '[courses repository] An error occurred while deleting subcategory';

			if (error instanceof Error) {
				return { success: false, error: error.message };
			}

			return { success: false, error: `${headerMessage}` };
		}
	}
}

export const courseRepository = new CourseRepository();
