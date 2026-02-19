import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { validation } from '../common/validation';

extendZodWithOpenApi(z);

export type Course = z.infer<typeof CourseSchema>;
export type CourseCategory = z.infer<typeof CourseCategorySchema>;
export type CourseSubCategory = z.infer<typeof CourseSubCategorySchema>;

export const CourseSchema = z.object({
	course_id: z.string().uuid().openapi({
		description: 'Unique identifier of the course',
	}),
	subject_id: z.string().max(30).optional().openapi({
		description: 'Unique identifier of the subject',
	}),
	name: z.string().max(120).openapi({ description: 'Name of the course' }),
	description: z.string().optional().openapi({ description: 'Description of the course' }),
	category_id: validation.PositiveStrOrIntSchema.openapi({ description: 'ID of the category of the course' }),
	subcategory_id: validation.PositiveStrOrIntSchema.openapi({ description: 'ID of the subcategory of the course' }),
	course_language: z.string().toUpperCase().max(2).openapi({ description: 'Language of the course' }),
	created_by: z.string().uuid().openapi({ description: 'User ID of the creator of the course' }),
	created_at: z.string().datetime().openapi({ description: 'Date and time that the user was created' }),
	updated_at: z.string().datetime().openapi({ description: 'Date and time that the user was updated' }),
});

export const CourseCategorySchema = z.object({
	category_id: validation.PositiveStrOrIntSchema.openapi({ description: 'Unique identifier of the category' }),
	name: z.string().max(70).openapi({ description: 'Name of the category' }),
	created_at: z.string().datetime().openapi({ description: 'Date and time that the category was created' }),
	updated_at: z.string().datetime().openapi({ description: 'Date and time that the category was updated' }),
});

export const CourseSubCategorySchema = z.object({
	subcategory_id: validation.PositiveStrOrIntSchema.openapi({ description: 'Unique identifier of the subcategory' }),
	name: z.string().max(70).openapi({ description: 'Name of the subcategory' }),
	category_id: validation.PositiveStrOrIntSchema.openapi({ description: 'ID of the category of the subcategory' }),
	created_at: z.string().datetime().openapi({ description: 'Date and time that the subcategory was created' }),
	updated_at: z.string().datetime().openapi({ description: 'Date and time that the subcategory was updated' }),
});

export type CreateCategory = z.infer<typeof CreateCategorySchema>;
export const CreateCategorySchema = CourseCategorySchema.omit({
	category_id: true,
	created_at: true,
	updated_at: true,
});

export type CreateSubCategory = z.infer<typeof CreateSubCategorySchema>;
export const CreateSubCategorySchema = CourseSubCategorySchema.omit({
	subcategory_id: true,
	created_at: true,
	updated_at: true,
});

export const ValidateCourseSchema = {
	GetAllCategorySchema: z.object({
		params: z.object({}),
		query: z.object({}),
		body: z.undefined(),
	}),

	GetAllCourseCategorySchema: z.object({
		params: z.object({}),
		query: z.object({}),
		body: z.undefined(),
	}),

	GetCourseCategoryByIdSchema: z.object({
		params: z.object({
			category_id: validation.PositiveStr2IntSchema,
		}),
		query: z.object({}),
		body: z.undefined(),
	}),

	GetAllSubCategoryByCategoryIdSchema: z.object({
		params: z.object({
			category_id: validation.PositiveStr2IntSchema,
		}),
		query: z.object({}),
		body: z.undefined(),
	}),

	GetSubCategoryById: z.object({
		params: z.object({
			subcategory_id: validation.PositiveStr2IntSchema,
		}),
		query: z.object({}),
		body: z.undefined(),
	}),

	GetAllCourseSchema: z.object({
		params: z.object({}),
		query: validation.commonQueryValidation.extend({
			categoryId: validation.PositiveStrOrIntSchema.optional(),
			subCategoryId: validation.PositiveStrOrIntSchema.optional(),
			createdBy: z.string().uuid().optional(),
		}),
		body: z.undefined(),
	}),

	GetCourseByIdSchema: z.object({
		params: z.object({
			course_id: z.string().uuid().openapi({ description: 'Unique identifier of the course' }),
		}),
		query: z.object({}),
		body: z.undefined(),
	}),

	PostCreateCourseSchema: z.object({
		params: z.object({}),
		query: z.object({}),
		body: CourseSchema.omit({
			created_by: true,
			course_id: true,
			created_at: true,
			updated_at: true,
		}),
	}),

	PostCreateCategorySchema: z.object({
		params: z.object({}),
		query: z.object({}),
		body: CreateCategorySchema,
	}),

	PostCreateSubCategorySchema: z.object({
		params: z.object({}),
		query: z.object({}),
		body: CreateSubCategorySchema,
	}),

	PutUpdateCourseSchema: z.object({
		params: z.object({
			course_id: z.string().uuid().openapi({
				description: 'Unique identifier of the course',
			}),
		}),
		query: z.object({}),
		body: CourseSchema.omit({
			created_by: true,
			course_id: true,
			created_at: true,
			updated_at: true,
		}),
	}),

	PutUpdateCategorySchema: z.object({
		params: z.object({
			category_id: validation.PositiveStr2IntSchema,
		}),
		query: z.object({}),
		body: CreateCategorySchema,
	}),

	PutUpdateSubCategorySchema: z.object({
		params: z.object({
			subcategory_id: validation.PositiveStr2IntSchema,
		}),
		query: z.object({}),
		body: CourseSubCategorySchema.omit({
			subcategory_id: true,
			created_at: true,
			updated_at: true,
		}),
	}),

	DeleteCategorySchema: z.object({
		params: z.object({
			category_id: validation.PositiveStr2IntSchema,
		}),
		query: z.object({}),
		body: z.undefined(),
	}),

	DeleteSubCategorySchema: z.object({
		params: z.object({
			subcategory_id: validation.PositiveStr2IntSchema,
		}),
		query: z.object({}),
		body: z.undefined(),
	}),
};
