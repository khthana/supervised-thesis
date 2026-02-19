import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { validation } from '../common/validation';

extendZodWithOpenApi(z);

export type Admin = z.infer<typeof AdminsSchema>;
export const AdminsSchema = z.object({
	user_id: z.string().uuid().openapi({ description: 'Unique identifier of the admin' }),
	is_root: z.boolean().openapi({ description: 'Whether the admin is root or not' }),
	is_active: z.boolean().openapi({ description: 'Whether the admin is active or not' }),
	created_by: z.string().uuid().openapi({
		description: 'Unique identifier of the user who created the admin',
	}),
	created_at: z.string().datetime().openapi({ description: 'Date and time that the admin was created' }),
	updated_at: z.string().datetime().openapi({ description: 'Date and time that the admin was updated' }),
});
