import { z } from 'zod';

export const createLoginSchema = () =>
	z.object({
		email: z.string().email('Invalid email format.'),
		password: z.string().min(1, 'An error occurred. Please try again later.'),
	});

export type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>;
