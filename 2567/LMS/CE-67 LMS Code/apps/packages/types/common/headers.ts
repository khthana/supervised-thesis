import z from 'zod';

export const validateAuthHeader = z.object({
	headers: z.object({
		authorization: z
			.string()
			.regex(/^Bearer\s.+$/)
			.describe('Bearer token'),
	}),
});
