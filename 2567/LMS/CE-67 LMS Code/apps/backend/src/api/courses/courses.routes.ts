import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { type Router } from 'express';
import { z } from 'zod';

import { courseRegistry, courseRouter } from '@/api/courses/course/course.routes';
import { cycleRegistry, cycleRouter } from '@/api/courses/cycle/cycle.routes';
import { enrollmentRegistry, enrollmentRouter } from '@/api/courses/enrollment/enrollment.routes';

export { courseRegistry, enrollmentRegistry, cycleRegistry };

export const coursesRegistry = new OpenAPIRegistry();
export const coursesRouter: Router = express.Router();

coursesRouter.use('/enrollments', enrollmentRouter);
coursesRouter.use('/:course_id/cycles', cycleRouter);
coursesRouter.use('/cycles', cycleRouter);
coursesRouter.use('/', courseRouter);
