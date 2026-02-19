import { ServiceResponse } from '@/common/models/serviceResponse';
import { handleServiceResponse } from '@/common/utils/httpHandlers.util';
import { logger } from '@/server';
import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { cycleContentService } from '@/api/courses/cycle/content/content.service';
import { validateUUID } from '@/common/validation/string.validation';

import {
	ContentStatus,
	ContentType,
	type CreateLesson,
	type CreateLessonContent,
	CreateLessonContentSchema,
	CreateLessonSchema,
	Lesson,
	LessonContent,
	LessonContentSchema,
	LessonSchema,
	type UpdateLesson,
	type UpdateLessonContent,
	UpdateLessonContentSchema,
	UpdateLessonSchema,
} from '@shared/types/courses/lesson.model';

class CycleContentController {
	private cycleContentService = cycleContentService;

	constructor() {
		this.cycleContentService = cycleContentService;
	}

	public createLesson: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
		if (!req.validatedData || !req.validatedData.params || !req.validatedData.body) {
			return handleServiceResponse(ServiceResponse.failure('Invalid request data', null), res);
		}

		const { params, body } = req.validatedData;
		const cycleId = params.cycle_id;
		const lessonData: CreateLesson = {
			name: body.name,
			sequence: body.sequence,
			requires_previous_lesson: body.requires_previous_lesson,
		};

		// Validate lessonData with zod
		const lessonValidationResult = CreateLessonSchema.safeParse(lessonData);
		if (!lessonValidationResult.success) {
			return handleServiceResponse(
				ServiceResponse.failure('Invalid lesson data', lessonValidationResult.error.format()),
				res,
			);
		}

		const lessonResponse = await this.cycleContentService.createLesson(cycleId, lessonData);

		return handleServiceResponse(lessonResponse, res);
	};

	public updateLesson: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
		if (!req.validatedData || !req.validatedData.params || !req.validatedData.body) {
			return handleServiceResponse(ServiceResponse.failure('Invalid request data', null), res);
		}

		const { params, body } = req.validatedData;
		const lessonId = params.lesson_id;
		const lessonData: UpdateLesson = {
			name: body.name,
			sequence: body.sequence,
			requires_previous_lesson: body.requires_previous_lesson,
		};

		// Validate lessonData with zod
		const lessonValidationResult = UpdateLessonSchema.safeParse(lessonData);
		if (!lessonValidationResult.success) {
			return handleServiceResponse(
				ServiceResponse.failure('Invalid lesson data', lessonValidationResult.error.format()),
				res,
			);
		}

		const lessonResponse = await this.cycleContentService.updateLesson(lessonId, lessonData);

		return handleServiceResponse(lessonResponse, res);
	};

	public deleteLesson: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
		if (!req.validatedData || !req.validatedData.params) {
			return handleServiceResponse(ServiceResponse.failure('Invalid request data', null), res);
		}

		const { params } = req.validatedData;
		const lessonId = params.lesson_id;

		const lessonResponse = await this.cycleContentService.deleteLesson(lessonId);

		return handleServiceResponse(lessonResponse, res);
	};

	public createLessonContent: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
		if (!req.validatedData || !req.validatedData.params || !req.validatedData.body) {
			return handleServiceResponse(ServiceResponse.failure('Invalid request data', null), res);
		}

		const { params, body } = req.validatedData;
		const lessonId = params.lesson_id;
		const contentData: CreateLessonContent = {
			name: body.name,
			sequence: body.sequence,
			content_type: body.content_type,
			content_status: body.content_status,
			content: body.content,
			lesson_id: lessonId,
		};

		// Validate contentData with zod
		const contentValidationResult = CreateLessonContentSchema.safeParse(contentData);
		if (!contentValidationResult.success) {
			return handleServiceResponse(
				ServiceResponse.failure('Invalid content data', contentValidationResult.error.format()),
				res,
			);
		}

		const lessonContentResponse = await this.cycleContentService.createLessonContent(lessonId, contentData);

		return handleServiceResponse(lessonContentResponse, res);
	};

	public updateLessonContent: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
		if (!req.validatedData || !req.validatedData.params || !req.validatedData.body) {
			return handleServiceResponse(ServiceResponse.failure('Invalid request data', null), res);
		}

		const { params, body } = req.validatedData;
		const lessonContentId = params.content_id;
		const contentData: UpdateLessonContent = {
			name: body.name,
			sequence: body.sequence,
			content_type: body.content_type,
			content_status: body.content_status,
			content: body.content,
		};

		// Validate contentData with zod
		const contentValidationResult = LessonContentSchema.safeParse(contentData);
		if (!contentValidationResult.success) {
			return handleServiceResponse(
				ServiceResponse.failure('Invalid content data', contentValidationResult.error.format()),
				res,
			);
		}

		const lessonContentResponse = await this.cycleContentService.updateLessonContent(lessonContentId, contentData);

		return handleServiceResponse(lessonContentResponse, res);
	};

	public deleteLessonContent: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
		if (!req.validatedData || !req.validatedData.params) {
			return handleServiceResponse(ServiceResponse.failure('Invalid request data', null), res);
		}

		const { params } = req.validatedData;
		const lessonContentId = params.content_id;

		const lessonContentResponse = await this.cycleContentService.deleteLessonContent(lessonContentId);

		return handleServiceResponse(lessonContentResponse, res);
	};

	public getLessonAndContents: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
		if (!req.validatedData || !req.validatedData.params) {
			return handleServiceResponse(ServiceResponse.failure('Invalid request data', null), res);
		}

		const { params } = req.validatedData;
		const cycleId = params.cycle_id;

		const lessonResponse = await this.cycleContentService.getAllLessons(cycleId);

		return handleServiceResponse(lessonResponse, res);
	};

	public getLessonContent: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
		if (!req.validatedData || !req.validatedData.params) {
			return handleServiceResponse(ServiceResponse.failure('Invalid request data', null), res);
		}

		const { params } = req.validatedData;
		const lessonContentId = params.content_id;

		const lessonContentResponse = await this.cycleContentService.getContentByContentId(lessonContentId);

		return handleServiceResponse(lessonContentResponse, res);
	};
}

export const cycleContentController = new CycleContentController();
