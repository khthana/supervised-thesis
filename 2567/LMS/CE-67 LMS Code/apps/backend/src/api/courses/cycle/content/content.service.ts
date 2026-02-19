import { logger } from '@/server';
import type {
	Prisma,
	course_cycles,
	lesson_contents,
	lessons,
	score_weight_groups,
	scwg_lesson_contents,
} from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { cycleContentsRepository } from '@/api/courses/cycle/content/content.repository';
import { ServiceResponse } from '@/common/models/serviceResponse';
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
	UpdateLesson,
	UpdateLessonContent,
	UpdateLessonContentSchema,
	UpdateLessonSchema,
} from '@shared/types/courses/lesson.model';

class CycleContentService {
	private cycleContentsRepository = cycleContentsRepository;

	constructor() {
		this.cycleContentsRepository = cycleContentsRepository;
	}

	async createLesson(cycleId: string, lessonData: CreateLesson): Promise<ServiceResponse<lessons | null>> {
		if (!validateUUID(cycleId)) {
			return ServiceResponse.failure('[cycle content service] Invalid cycle ID', null);
		}

		const lesson: Prisma.lessonsCreateInput = {
			name: lessonData.name,
			sequence: lessonData.sequence,
			requires_previous_lesson: lessonData.requires_previous_lesson,
			course_cycles: {
				connect: {
					cycle_id: cycleId,
				},
			},
		};

		const { success, data, error } = await this.cycleContentsRepository.createLesson(lesson, cycleId);
		if (!success) {
			return ServiceResponse.failure(
				`[cycle content service] Error creating lesson ${error}`,
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
		if (!data) {
			return ServiceResponse.failure(
				'[cycle content service] Error creating lesson',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
		return ServiceResponse.success('Lesson created successfully', data, StatusCodes.CREATED);
	}

	async updateLesson(
		lessonId: number,
		lessonData: Prisma.lessonsUpdateInput,
	): Promise<ServiceResponse<lessons | null>> {
		const { success, data, error } = await this.cycleContentsRepository.updateLesson(lessonId, lessonData);
		if (!success) {
			return ServiceResponse.failure(
				`[cycle content service] Error updating lesson: ${error}`,
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
		if (!data) {
			return ServiceResponse.failure(
				'[cycle content service] Error updating lesson',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
		return ServiceResponse.success('Lesson updated successfully', data, StatusCodes.OK);
	}

	async deleteLesson(lessonId: number): Promise<ServiceResponse<null>> {
		const { success, data, error } = await this.cycleContentsRepository.deleteLesson(lessonId);
		if (!success) {
			return ServiceResponse.failure(
				`[cycle content service] Error deleting lesson: ${error}`,
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
		if (!data) {
			return ServiceResponse.failure(
				'[cycle content service] Error deleting lesson',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
		return ServiceResponse.success('Lesson deleted successfully', null, StatusCodes.NO_CONTENT);
	}

	async createLessonContent(
		lessonId: number,
		contentData: CreateLessonContent,
	): Promise<ServiceResponse<lesson_contents | null>> {
		const lessonContent: Prisma.lesson_contentsCreateInput = {
			name: contentData.name,
			sequence: contentData.sequence,
			content_type: contentData.content_type,
			content_status: contentData.content_status,
			content: contentData.content,
			lessons: {
				connect: {
					lesson_id: lessonId,
				},
			},
		};

		const { success, data, error } = await this.cycleContentsRepository.createLessonContent(lessonId, lessonContent);
		if (!success) {
			return ServiceResponse.failure(
				`[cycle content service] Error creating lesson content: ${error}`,
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
		if (!data) {
			return ServiceResponse.failure(
				'[cycle content service] Error creating lesson content',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
		return ServiceResponse.success('Lesson content created successfully', data, StatusCodes.CREATED);
	}

	async updateLessonContent(
		contentId: number,
		contentData: Prisma.lesson_contentsUpdateInput,
	): Promise<ServiceResponse<lesson_contents | null>> {
		const { success, data, error } = await this.cycleContentsRepository.updateLessonContent(contentId, contentData);
		if (!success) {
			return ServiceResponse.failure(
				`[cycle content service] Error updating lesson content: ${error}`,
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
		if (!data) {
			return ServiceResponse.failure(
				'[cycle content service] Error updating lesson content',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
		return ServiceResponse.success('Lesson content updated successfully', data, StatusCodes.OK);
	}

	async deleteLessonContent(contentId: number): Promise<ServiceResponse<null>> {
		const { success, data, error } = await this.cycleContentsRepository.deleteLessonContent(contentId);
		if (!success) {
			return ServiceResponse.failure(
				`[cycle content service] Error deleting lesson content: ${error}`,
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
		if (!data) {
			return ServiceResponse.failure(
				'[cycle content service] Error deleting lesson content',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
		return ServiceResponse.success('Lesson content deleted successfully', null, StatusCodes.NO_CONTENT);
	}

	async getAllLessons(cycleId: string): Promise<ServiceResponse<lessons[] | null>> {
		const { success, data, error } = await this.cycleContentsRepository.getLessonAndContents(cycleId);
		if (!success) {
			return ServiceResponse.failure(
				`[cycle content service] Error getting lessons: ${error}`,
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
		if (!data) {
			return ServiceResponse.failure(
				'[cycle content service] Error getting lessons',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
		return ServiceResponse.success('Lessons retrieved successfully', data);
	}

	async getContentByContentId(contentId: number): Promise<ServiceResponse<lesson_contents | null>> {
		const { success, data, error } = await this.cycleContentsRepository.getContentByContentId(contentId);
		if (!success) {
			return ServiceResponse.failure(
				`[cycle content service] Error getting lesson content: ${error}`,
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
		if (!data) {
			return ServiceResponse.failure(
				'[cycle content service] Error getting lesson content',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
		return ServiceResponse.success('Lesson content retrieved successfully', data);
	}
}

export const cycleContentService = new CycleContentService();
