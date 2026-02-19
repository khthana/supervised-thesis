import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { validation } from '../common/validation';

extendZodWithOpenApi(z);

export type CourseCycle = z.infer<typeof CourseCycleSchema>;
export type CycleAccessRole = z.infer<typeof CycleAccessRoleSchema>;
export type CourseCycleType = z.infer<typeof CourseCycleTypeSchema>;
export type CourseCycleStatus = z.infer<typeof CourseCycleStatusSchema>;
export type CycleAccessEmails = z.infer<typeof CycleAccessEmailSchema>;
export type CreateCourseCycle = z.infer<typeof CreateCourseCycleSchema>;
export type UpdateCourseCycle = z.infer<typeof UpdateCourseCycleSchema>;

export const CycleAccessRoleSchema = z
	.string()
	.refine((val) => ['CREATOR', 'EDITOR', 'LEARNER'].includes(val), {
		message: 'Invalid cycle access role',
	})
	.openapi({ description: 'Role of the user in the course cycle' });

export const CourseCycleTypeSchema = z
	.string()
	.refine((val) => ['PUBLIC', 'PRIVATE'].includes(val), {
		message: 'Invalid course cycle type',
	})
	.openapi({ description: 'Type of the course cycle' });

export const CourseCycleStatusSchema = z
	.string()
	.refine((val) => ['ACTIVE', 'INACTIVE'].includes(val), {
		message: 'Invalid course cycle status',
	})
	.openapi({ description: 'Status of the course cycle' });

export const CycleAccessEmailSchema = z.object({
	cycle_id: z.string().uuid().openapi({
		description: 'Unique identifier of the course cycle',
	}),
	user_email: z.string().email().openapi({
		description: 'Email of the user with access to the course cycle',
	}),
	access_role: CycleAccessRoleSchema.openapi({
		description: 'Role of the user in the course cycle',
	}),
});

export const CourseCycleSchema = z.object({
	cycle_id: z.string().uuid().openapi({
		description: 'Unique identifier of the course cycle',
	}),
	course_id: z.string().uuid().openapi({
		description: 'Unique identifier of the course',
	}),
	name: z.string().max(50).openapi({
		description: 'Name of the course cycle',
	}),
	is_always_enroll: z.boolean().openapi({
		description: 'Indicates if the course cycle is always open for enrollment',
	}),
	is_always_open: z.boolean().openapi({
		description: 'Indicates if the course cycle is always open',
	}),
	is_restrict_enroll: z.boolean().openapi({
		description: 'Indicates if enrollment is restricted',
	}),
	max_enrollments: z.number().int().min(0).openapi({
		description: 'Maximum number of enrollments allowed for the course cycle',
	}),
	course_type: CourseCycleTypeSchema.openapi({
		description: 'Type of the course cycle',
	}),
	status: CourseCycleStatusSchema.openapi({
		description: 'Status of the course cycle',
	}),
	enroll_start: z.string().datetime().openapi({
		description: 'Start date and time of enrollment for the course cycle',
	}),
	enroll_end: z.string().datetime().nullable().openapi({
		description: 'End date and time of enrollment for the course cycle',
	}),
	cycle_start: z.string().datetime().openapi({
		description: 'Start date and time of the course cycle',
	}),
	cycle_end: z.string().datetime().nullable().openapi({
		description: 'End date and time of the course cycle',
	}),
	created_at: z.string().datetime().openapi({
		description: 'Date and time that the course cycle was created',
	}),
	updated_at: z.string().datetime().openapi({
		description: 'Date and time that the course cycle was updated',
	}),
});

export const CreateCourseCycleSchema = CourseCycleSchema.omit({
	cycle_id: true,
	course_id: true,
	created_at: true,
	updated_at: true,
}).openapi({
	description: 'Schema for creating a new course cycle',
});

export const UpdateCourseCycleSchema = CourseCycleSchema.omit({
	cycle_id: true,
	course_id: true,
	created_at: true,
	updated_at: true,
}).openapi({
	description: 'Schema for updating an existing course cycle',
});
