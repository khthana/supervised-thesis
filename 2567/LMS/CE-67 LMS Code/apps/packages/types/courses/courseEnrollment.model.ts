import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { validation } from '../common/validation';

extendZodWithOpenApi(z);

export type CourseEnrollmentStatus = z.infer<typeof CourseEnrollmentStatusSchema>;
export type CourseEnrollment = z.infer<typeof CourseEnrollmentSchema>;

export const CourseEnrollmentStatusSchema = z.enum(['ENROLLED', 'COMPLETED', 'DROPPED']);

export const CourseEnrollmentSchema = z.object({
	course_id: z.string().uuid().openapi({ description: 'ID of the course' }),
	cycle_id: z.string().uuid().openapi({ description: 'ID of the course cycle' }),
	user_id: validation.PositiveStrOrIntSchema.openapi({ description: 'ID of the user' }),
	status: CourseEnrollmentStatusSchema.openapi({ description: 'Status of the course enrollment' }),
	completed_at: z
		.string()
		.datetime()
		.optional()
		.openapi({ description: 'Date and time that the course enrollment was completed' }),
	last_enrolled_at: z
		.string()
		.datetime()
		.openapi({ description: 'Date and time that the user last enrolled in the course' }),
	last_dropped_at: z
		.string()
		.datetime()
		.optional()
		.openapi({ description: 'Date and time that the user last dropped the course' }),
	updated_at: z.string().datetime().openapi({ description: 'Date and time that the course enrollment was updated' }),
});
