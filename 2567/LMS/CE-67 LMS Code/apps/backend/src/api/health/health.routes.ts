import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { type Request, type Response, type Router } from 'express';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { healthController } from '@/api/health/health.controller';

export const healthRegistry = new OpenAPIRegistry();
export const healthRouter: Router = express.Router();

healthRegistry.registerPath({
	method: 'get',
	path: '/api/health/check',
	tags: ['Health'],
	responses: createApiResponse(z.null(), 'Success'),
});

healthRouter.get('/check', healthController.check);
