import { z } from 'zod';

export type CommonQueryValidation = z.infer<typeof commonQueryValidation>;
export const commonQueryValidation = z.object({
	limit: z.number().default(12),
	offset: z.number().default(0),
	sortBy: z.string().optional(),
	orderBy: z.enum(['asc', 'desc']).default('desc'),
	searchText: z.string().optional(),
});
