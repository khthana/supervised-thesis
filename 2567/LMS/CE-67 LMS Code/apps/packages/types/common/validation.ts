import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const validation = {
	KmitlEmailSchema: z
		.string()
		.email()
		.max(120)
		.refine((email) => email.endsWith('@kmitl.ac.th'), {
			message: 'Email must end with @kmitl.ac.th',
		})
		.openapi({ type: 'string', description: 'KMITL email' }),

	PositiveIntSchema: z
		.number() // tells Zod that the input is a number
		.int() // protects against floating point numbers
		.positive() // protects against negative numbers
		.openapi({ type: 'integer', description: 'Positive integer' }),

	PositiveStr2IntSchema: z
		.string()
		.regex(/^\d+$/, 'ID must be a numeric value')
		.transform(Number)
		.refine((num) => num > 0, 'ID must be a positive number')
		.openapi({ type: 'integer', description: 'Positive integer' }),

	PositiveStrOrIntSchema: z
		.union([
			z
				.string()
				.regex(/^\d+$/, 'ID must be a numeric value')
				.transform(Number)
				.refine((num) => num > 0, 'ID must be a positive number'),

			z.number().int().positive('ID must be a positive number'),
		])
		.openapi({ type: 'integer', description: 'Positive integer or numeric string' }),

	EnglishNameSchema: z
		.string()
		.min(1, { message: 'Name cannot be empty' })
		.max(50, { message: 'Name must be at most 50 characters' })
		.regex(/^[a-zA-Z\s]+$/, {
			message: 'Name must contain only alphabetic characters and spaces',
		})
		.transform((val) => val.replace(/\s+/g, ''))
		.openapi({ type: 'string', description: 'Name in English' }),

	ThaiNameSchema: z
		.string()
		.min(1, { message: 'Name cannot be empty' })
		.max(50, { message: 'Name must be at most 50 characters' })
		.regex(/^[\u0E00-\u0E7F\s]+$/, {
			message: 'Name must contain only Thai characters and spaces',
		})
		.transform((val) => val.replace(/\s+/g, ''))
		.openapi({ type: 'string', description: 'Name in Thai' }),

	Argon2TokenSchema: z
		.string()
		.max(255)
		.regex(/^\$argon2id\$v=\d+\$m=\d+,t=\d+,p=\d+\$[A-Za-z0-9+\/=]+(\$[A-Za-z0-9+\/=]+)?$/, {
			message: 'Invalid Argon2 token',
		})
		.openapi({ type: 'string', description: 'Argon2 token' }),

	StrongPasswordSchema: z
		.string()
		.min(8, 'Password must be at least 8 characters long')
		.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
		.regex(/[a-z]/, 'Password must contain at least one lowercase letter')
		.regex(/[0-9]/, 'Password must contain at least one number')
		.regex(/[@$!%*?&]/, 'Password must contain at least one special character')
		.openapi({ type: 'string', description: 'Strong password' }),

	commonQueryValidation: z.object({
		limit: z
			.union([z.string(), z.undefined()])
			.transform((val) => {
				if (!val) return undefined;
				const num = Number(val);
				if (Number.isNaN(num)) {
					throw new z.ZodError([
						{
							code: z.ZodIssueCode.custom,
							path: ['limit'],
							message: 'Limit must be a valid number',
						},
					]);
				}
				return num;
			})
			.openapi({ type: 'integer', description: 'Limit for pagination' }),

		offset: z
			.union([z.string(), z.undefined()])
			.transform((val) => {
				if (!val) return undefined;
				const num = Number(val);
				if (Number.isNaN(num)) {
					throw new z.ZodError([
						{
							code: z.ZodIssueCode.custom,
							path: ['offset'],
							message: 'Offset must be a valid number',
						},
					]);
				}
				return num;
			})
			.openapi({ type: 'integer', description: 'Offset for pagination' }),

		sortBy: z.string().optional().openapi({ type: 'string', description: 'Field to sort by' }),

		orderBy: z
			.enum(['asc', 'desc'])
			.default('desc')
			.openapi({ type: 'string', enum: ['asc', 'desc'], description: 'Sort order' }),

		searchText: z
			.string()
			.min(4)
			.optional()
			.openapi({ type: 'string', description: 'Search text with minimum 4 characters' }),
	}),
};
