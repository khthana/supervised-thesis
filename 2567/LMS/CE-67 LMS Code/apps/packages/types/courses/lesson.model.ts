import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { validation } from '../common/validation';

extendZodWithOpenApi(z);

export type Lesson = z.infer<typeof LessonSchema>;
export type LessonContent = z.infer<typeof LessonContentSchema>;
export type CreateLesson = z.infer<typeof CreateLessonSchema>;
export type UpdateLesson = z.infer<typeof UpdateLessonSchema>;
export type CreateLessonContent = z.infer<typeof CreateLessonContentSchema>;
export type UpdateLessonContent = z.infer<typeof UpdateLessonContentSchema>;
export type ContentType = z.infer<typeof ContentTypeSchema>;
export type ContentStatus = z.infer<typeof ContentStatusSchema>;

export const LessonSchema = z.object({
	lesson_id: validation.PositiveStrOrIntSchema,
	cycle_id: z.string().uuid('Invalid cycle ID').openapi({
		description: 'The ID of the cycle to which the lesson belongs',
	}),
	name: z.string().min(1).max(70).openapi({
		description: 'The name of the lesson, which should be between 1 and 70 characters long',
	}),
	sequence: validation.PositiveStrOrIntSchema,
	requires_previous_lesson: z.boolean().openapi({
		description: 'Indicates if the lesson requires completion of a previous lesson',
	}),
	created_at: z.string().datetime('Invalid date format').openapi({
		description: 'The date and time when the lesson was created',
	}),
	updated_at: z.string().datetime('Invalid date format').openapi({
		description: 'The date and time when the lesson was last updated',
	}),
});

export const ContentTypeSchema = z
	.string()
	.refine((val) => ['BLOG', 'VIDEO', 'QUIZ', 'ASSIGN_SHEET', 'ASSIGN_CODE'].includes(val), {
		message: 'Invalid content type',
	})
	.openapi({ description: 'The type of content in the lesson' });

export const ContentStatusSchema = z.string().refine((val) => ['PUBLISH', 'ARCHIVED'].includes(val), {
	message: 'Invalid content status',
});

export const LessonContentSchema = z.object({
	content_id: validation.PositiveStrOrIntSchema,
	lesson_id: validation.PositiveStrOrIntSchema,
	name: z.string().min(1).max(70).openapi({
		description: 'The name of the lesson content, which should be between 1 and 70 characters long',
	}),
	content: z.string().optional().openapi({
		description: 'The content of the lesson, which can be in various formats such as text, HTML, etc.',
	}),
	sequence: validation.PositiveStrOrIntSchema,
	content_type: ContentTypeSchema,
	content_status: ContentStatusSchema,
	total_points: validation.PositiveStrOrIntSchema.optional().openapi({
		description: 'The total points for the lesson content, applicable for quiz or assignment types',
	}),
});

export const CreateLessonSchema = LessonSchema.omit({
	cycle_id: true,
	lesson_id: true,
	created_at: true,
	updated_at: true,
}).openapi({
	description: 'Schema for creating a new lesson',
});

export const UpdateLessonSchema = LessonSchema.omit({
	lesson_id: true,
	created_at: true,
	updated_at: true,
	cycle_id: true,
}).openapi({
	description: 'Schema for updating an existing lesson',
});

export const CreateLessonContentSchema = LessonContentSchema.omit({
	content_id: true,
}).openapi({
	description: 'Schema for creating a new lesson content',
});

export const UpdateLessonContentSchema = LessonContentSchema.partial().openapi({
	description: 'Schema for updating an existing lesson content',
});
