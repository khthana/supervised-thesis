import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { type Router } from 'express';
import { z } from 'zod';

import { adminRegistry, adminRouter } from '@/api/users/admin/admin.routes';
import { userRegistry, userRouter } from '@/api/users/user/user.routes';

export { userRegistry, adminRegistry };

export const usersRegistry = new OpenAPIRegistry();
export const usersRouter: Router = express.Router();

usersRouter.use('/admins', adminRouter);
usersRouter.use('/', userRouter);
