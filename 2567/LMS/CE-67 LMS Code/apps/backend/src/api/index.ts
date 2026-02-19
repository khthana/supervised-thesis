import { healthRouter } from '@/api//health/health.routes';
import { authRouter } from '@/api/auth/auth.routes';
import { coursesRouter } from '@/api/courses/courses.routes';
import { usersRouter } from '@/api/users/users.routes';
import express, { type Router } from 'express';

const apiRouter: Router = express.Router();

apiRouter.get('/', (_req, res) => {
	res.redirect('/api-docs');
});

apiRouter.use('/health', healthRouter); // /api/health
apiRouter.use('/users', usersRouter); // /api/users
apiRouter.use('/auth', authRouter); // /api/auth
apiRouter.use('/courses', coursesRouter); // /api/courses

export { apiRouter };
