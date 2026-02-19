import { z } from 'zod';

export const CourseCreateSchema = z.object({
	name: z.string().min(1, 'Course name is required'),
	subject_id: z.string().optional(),
	description: z.any(),
	course_language: z.string().default('th'),
	category_id: z.union([z.string().transform((val) => Number(val)), z.number()]).optional(),
	subcategory_id: z.union([z.string().transform((val) => Number(val)), z.number()]).optional(),
});

export type CourseCreateType = z.infer<typeof CourseCreateSchema>;
