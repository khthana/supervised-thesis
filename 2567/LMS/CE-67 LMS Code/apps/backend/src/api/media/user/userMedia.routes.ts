import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { type Router } from 'express';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { userMediaController } from '@/api/media/user/userMedia.controller';
import { authenticate, authorizeAdmin, authorizeRole } from '@/common/middleware/auth';
import { uploadUserAvatar } from '@/common/middleware/upload';
import { validateRequest } from '@/common/utils/httpHandlers.util';
import { validateAuthHeader } from '@shared/types/common/headers';
import { MediaFileSchema, ValidateMediaFileSchema } from '@shared/types/mediafile.model';

export const userMediaRegistry = new OpenAPIRegistry();
export const userMediaRouter: Router = express.Router();

userMediaRegistry.register('MediaFile', MediaFileSchema);

userMediaRegistry.registerPath({
	method: 'post',
	path: '/api/media/users/avatar',
	tags: ['Media'],
	request: {
		headers: validateAuthHeader.shape.headers,
	},
	responses: createApiResponse(MediaFileSchema, 'Success'),
});
userMediaRouter.post('/avatar', authenticate, uploadUserAvatar, userMediaController.uploadUserAvatar);

// userMediaRegistry.registerPath({
// 	method: 'get',
// 	path: '/api/media/users/avatar',
// 	tags: ['Media'],
// 	request: {
// 		headers: validateAuthHeader.shape.headers,
// 	},
// 	responses: createApiResponse(MediaFileSchema, 'Success'),
// });
// userMediaRouter.get('/avatar', authenticate, userMediaController.getUserAvatar);
