import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { authenticate, authorizeAdmin, authorizeCourseEditor, authorizeRole } from '@/common/middleware/auth';
import requestLogger from '@/common/middleware/requestLogger';
import { validateRequest } from '@/common/utils/httpHandlers.util';
import { youtubeVideoSchema } from '@/common/validation/string.validation';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { validateAuthHeader } from '@shared/types/common/headers';
import { MediaFileSchema, ValidateMediaFileSchema } from '@shared/types/mediafile.model';
import express, { type Router } from 'express';
import { z } from 'zod';

export const contentMediaRegistry = new OpenAPIRegistry();
export const contentMediaRouter: Router = express.Router();
