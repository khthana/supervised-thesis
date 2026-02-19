import { ZodSchema } from 'zod';
import formidable from 'formidable';
import type { AccessTokenPayload } from '@shared/types/auth.model';
import type { Course } from '@shared/types/courses/course.model';
import { C } from 'vitest/dist/chunks/environment.d8YfPkTm.js';

declare global {
	namespace Express {
		interface Request {
			validatedData?: {
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				body: any;
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				query: any;
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				params: any;
			};
			isAdmin?: boolean;
			user?: AccessTokenPayload;
			course?: Course;
			uploadedData?: {
				fields: formidable.Fields;
				files: formidable.Files;
				refType: string;
				oldFilePath?: string;
			};
		}
	}
}
