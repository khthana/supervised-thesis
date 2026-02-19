import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { type Router } from 'express';
import { z } from 'zod';

import { courseMediaRegistry, courseMediaRouter } from '@/api/media/course/courseMedia.routes';
import { userMediaRegistry, userMediaRouter } from '@/api/media/user/userMedia.routes';
import { contentMediaRegistry, contentMediaRouter } from './content/contentMedia.routes';

export const mediaRegistry = new OpenAPIRegistry();
export const mediaRouter: Router = express.Router();

mediaRouter.use('/users', userMediaRouter);
mediaRouter.use('/courses', courseMediaRouter);
mediaRouter.use('/contents', contentMediaRouter);

export {
	userMediaRouter,
	userMediaRegistry,
	courseMediaRouter,
	courseMediaRegistry,
	contentMediaRouter,
	contentMediaRegistry,
};
