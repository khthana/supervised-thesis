import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { validation } from './common/validation';

extendZodWithOpenApi(z);

export type UserAvatar = z.infer<typeof UserAvatarSchema>;
export type CourseCoverImage = z.infer<typeof CourseCoverImageSchema>;
export type CourseContentImage = z.infer<typeof CourseContentImageSchema>;
export type MediaFile = z.infer<typeof MediaFileSchema>;

export const MediaFileSchema = z.object({
	reference_id: validation.PositiveStrOrIntSchema.openapi({
		description: 'Unique identifier of the media file',
	}),
	reference_type: z.string().toUpperCase().min(2).openapi({
		description: 'Type of the reference',
		example: 'USER_AVATAR',
	}),
	reference_sequence: validation.PositiveStrOrIntSchema.openapi({
		description: 'Sequence of the reference',
	}),
	reference_settings: z.object({}).optional().openapi({
		description: 'Settings of the reference',
		example: {},
	}),
	url: z.string().url().openapi({
		description: 'URL of the media file',
		example: 'https://example.com/media/file.jpg',
	}),
	mime_type: z.string().openapi({
		description: 'MIME type of the media file',
		example: 'image/jpeg',
	}),
	size: validation.PositiveStrOrIntSchema.openapi({
		description: 'Size of the media file in bytes',
		example: 1024,
	}),
	created_at: z.string().datetime().openapi({ description: 'Date and time that the admin was created' }),
	updated_at: z.string().datetime().openapi({ description: 'Date and time that the admin was updated' }),
});

export const UserAvatarSchema = MediaFileSchema.extend({
	reference_id: z.string().uuid().openapi({
		description: 'user_id of the user',
	}),
	reference_type: z.literal('USER_AVATAR').openapi({
		description: 'Type of the reference',
	}),
	reference_sequence: z.literal(0).openapi({
		description: 'The user avatar is always the first sequence',
	}),
	mime_type: z.enum(['image/jpeg', 'image/png']).openapi({
		description: 'MIME type of the media file',
	}),
});

export const CourseCoverImageSchema = MediaFileSchema.extend({
	reference_id: z.string().uuid().openapi({
		description: 'course_id of the course',
	}),
	reference_type: z.literal('COURSE_AVATAR').openapi({
		description: 'Type of the reference',
	}),
	reference_sequence: z.literal(0).openapi({
		description: 'The course cover image is always the first sequence',
	}),
	mime_type: z.enum(['image/jpeg', 'image/png']).openapi({
		description: 'MIME type of the media file',
	}),
});

export const CourseContentImageSchema = MediaFileSchema.extend({
	reference_id: validation.PositiveStrOrIntSchema.openapi({
		description: 'content_id of the lesson_contents',
	}),
	reference_type: z.literal('COURSE_CONTENT_IMAGE').openapi({
		description: 'Type of the reference',
	}),
	mime_type: z.enum(['image/jpeg', 'image/png']).openapi({
		description: 'MIME type of the media file',
	}),
});

export const ValidateMediaFileSchema = {
	PostCreateUserAvatarSchema: z.object({
		params: z.object({}),
		query: z.object({}),
		body: z.undefined(),
	}),
};
