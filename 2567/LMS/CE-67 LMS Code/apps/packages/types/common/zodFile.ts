import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import type { MediaFileSchema } from '../mediafile.model';

extendZodWithOpenApi(z);

export const createFileSchema = <T extends z.ZodTypeAny>(schema: typeof MediaFileSchema) => {
	return z.object({
		file: z
			.any()
			.refine((file) => file && file instanceof File, {
				message: 'Avatar file is required',
			})
			.refine((file) => file.size <= 5 * 1024 * 1024, {
				message: 'Avatar file size must be less than 5MB',
			})
			.refine((file) => ['image/jpeg', 'image/png'].includes(file.type), {
				message: 'Avatar file must be JPEG or PNG',
			})
			.openapi({
				description: 'User avatar file (JPEG or PNG, max 5MB)',
			}),
	});
};
