import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';

import { authRegistry } from '@/api/auth/auth.routes';
import { courseRegistry, coursesRegistry, cycleRegistry, enrollmentRegistry } from '@/api/courses/courses.routes';
import { contentRegistry } from '@/api/courses/cycle/content/content.routes';
import { healthRegistry } from '@/api/health/health.routes';
import { contentMediaRegistry, courseMediaRegistry, mediaRegistry, userMediaRegistry } from '@/api/media/media.routes';
import { adminRegistry, userRegistry, usersRegistry } from '@/api/users/users.routes';

import { env } from '@/common/utils/envConfig.util';

export function generateOpenAPIDocument() {
	const registry = new OpenAPIRegistry([
		healthRegistry,
		usersRegistry,
		userRegistry,
		adminRegistry,
		authRegistry,
		coursesRegistry,
		courseRegistry,
		enrollmentRegistry,
		cycleRegistry,
		contentRegistry,
		mediaRegistry,
		userMediaRegistry,
		courseMediaRegistry,
		contentMediaRegistry,
	]);
	const generator = new OpenApiGeneratorV3(registry.definitions);

	return generator.generateDocument({
		openapi: '3.0.0',
		info: {
			version: '1.0.0',
			title: 'CE Learnify. API Docs',
		},
		externalDocs: {
			description: 'This is the internal API documentation for the CE Learnify project.',
			url: '/swagger.json',
		},
		security: [
			{
				bearerAuth: [],
			},
		],
	});
}
