import { prisma } from '@/common/utils/database.util';
import type {
	Prisma,
	PrismaClient,
	course_categories,
	course_cycles,
	course_enrollments,
	course_subcategories,
	courses,
	cycle_access_emails,
	lesson_contents,
	lessons,
	users,
} from '@prisma/client';

import { validateEmail, validateUUID } from '@/common/validation/string.validation';

class CycleContentsRepository {
	private database: PrismaClient;

	constructor() {
		this.database = prisma;
	}

	async createLesson(
		lessonData: Prisma.lessonsCreateInput,
		cycleId: string,
	): Promise<{
		success: boolean;
		data?: lessons | null;
		error?: string;
	}> {
		if (!validateUUID(cycleId)) {
			return {
				success: false,
				data: null,
				error: '[cycle content repository] Invalid cycle ID',
			};
		}

		try {
			const lesson = await this.database.lessons.create({
				data: {
					...lessonData,
					course_cycles: {
						connect: {
							cycle_id: cycleId,
						},
					},
				},
			});
			if (!lesson) {
				return {
					success: false,
					data: null,
					error: '[cycle content repository] Error creating lesson',
				};
			}

			return { success: true, data: lesson };
		} catch (error) {
			return {
				success: false,
				data: null,
				error: '[cycle content repository] Error creating lesson',
			};
		}
	}

	async updateLesson(
		lessonId: number,
		lessonData: Prisma.lessonsUpdateInput,
	): Promise<{
		success: boolean;
		data?: lessons | null;
		error?: string;
	}> {
		try {
			const lesson = await this.database.lessons.update({
				where: { lesson_id: lessonId },
				data: lessonData,
			});
			if (!lesson) {
				return {
					success: false,
					data: null,
					error: '[cycle content repository] Error updating lesson',
				};
			}

			return { success: true, data: lesson };
		} catch (error) {
			return {
				success: false,
				data: null,
				error: '[cycle content repository] Error updating lesson',
			};
		}
	}

	async deleteLesson(lessonId: number): Promise<{
		success: boolean;
		data?: lessons | null;
		error?: string;
	}> {
		try {
			const lesson = await this.database.lessons.delete({
				where: { lesson_id: lessonId },
			});
			if (!lesson) {
				return {
					success: false,
					data: null,
					error: '[cycle content repository] Error deleting lesson',
				};
			}

			return { success: true, data: lesson };
		} catch (error) {
			return {
				success: false,
				data: null,
				error: '[cycle content repository] Error deleting lesson',
			};
		}
	}

	async getLessonContentById(contentId: number): Promise<{
		success: boolean;
		data?: lesson_contents | null;
		error?: string;
	}> {
		try {
			const content = await this.database.lesson_contents.findUnique({
				where: { content_id: contentId },
			});
			if (!content) {
				return {
					success: false,
					data: null,
					error: '[cycle content repository] Error fetching lesson content',
				};
			}

			return { success: true, data: content };
		} catch (error) {
			return {
				success: false,
				data: null,
				error: '[cycle content repository] Error fetching lesson content',
			};
		}
	}

	// TODO: Add validation for lesson content data
	async createLessonContent(
		lessonId: number,
		contentData: Prisma.lesson_contentsCreateInput,
	): Promise<{
		success: boolean;
		data?: lesson_contents | null;
		error?: string;
	}> {
		try {
			const content = await this.database.lesson_contents.create({
				data: {
					...contentData,
					lessons: {
						connect: {
							lesson_id: lessonId,
						},
					},
				},
			});
			if (!content) {
				return {
					success: false,
					data: null,
					error: '[cycle content repository] Error creating lesson content',
				};
			}

			return { success: true, data: content };
		} catch (error) {
			return {
				success: false,
				data: null,
				error: '[cycle content repository] Error creating lesson content',
			};
		}
	}

	async updateLessonContent(
		contentId: number,
		contentData: Prisma.lesson_contentsUpdateInput,
	): Promise<{
		success: boolean;
		data?: lesson_contents | null;
		error?: string;
	}> {
		try {
			const content = await this.database.lesson_contents.update({
				where: { content_id: contentId },
				data: contentData,
			});
			if (!content) {
				return {
					success: false,
					data: null,
					error: '[cycle content repository] Error updating lesson content',
				};
			}

			return { success: true, data: content };
		} catch (error) {
			return {
				success: false,
				data: null,
				error: '[cycle content repository] Error updating lesson content',
			};
		}
	}

	async deleteLessonContent(contentId: number): Promise<{
		success: boolean;
		data?: null;
		error?: string;
	}> {
		try {
			const content = await this.database.lesson_contents.delete({
				where: { content_id: contentId },
			});
			if (!content) {
				return {
					success: false,
					data: null,
					error: '[cycle content repository] Error deleting lesson content',
				};
			}

			return { success: true, data: null };
		} catch (error) {
			return {
				success: false,
				data: null,
				error: '[cycle content repository] Error deleting lesson content',
			};
		}
	}

	async getLessonAndContents(cycleId: string): Promise<{
		success: boolean;
		data?: lessons[] | [];
		error?: string;
	}> {
		if (!validateUUID(cycleId)) {
			return {
				success: false,
				data: [],
				error: '[cycle content repository] Invalid cycle ID',
			};
		}

		try {
			const lessons = await this.database.lessons.findMany({
				where: {
					course_cycles: {
						cycle_id: cycleId,
					},
				},
				include: {
					lesson_contents: true,
				},
			});

			if (!lessons) {
				return {
					success: false,
					data: [],
					error: '[cycle content repository] Error fetching lesson contents',
				};
			}

			return { success: true, data: lessons };
		} catch (error) {
			return {
				success: false,
				data: [],
				error: '[cycle content repository] Error fetching lesson contents',
			};
		}
	}

	async getContentByContentId(contentId: number): Promise<{
		success: boolean;
		data?: lesson_contents | null;
		error?: string;
	}> {
		try {
			const content = await this.database.lesson_contents.findUnique({
				where: { content_id: contentId },
				include: {
					user_content_completions: true,
					grader_tests: true,
					quiz_questions: {
						include: {
							quiz_options: true,
							user_quiz_answers: {
								orderBy: {
									attempt_number: 'desc',
								},
								take: 1,
							},
						},
					},
					user_submissions: true,
				},
			});
			if (!content) {
				return {
					success: false,
					data: null,
					error: '[cycle content repository] Error fetching lesson content',
				};
			}

			// biome-ignore lint: <explanation>
			let includeOptions: any = {};

			// if (content.content_type === 'QUIZ') {
			//   includeOptions = {
			//     quiz_questions: {
			//       include: {
			//         quiz_options: true,
			//         user_quiz_answers: {
			//           orderBy: {
			//             attempt_number: 'desc',
			//           },
			//           take: 1,
			//         },
			//       }
			//     }

			//   };
			// }

			// if (content.content_type === 'ASSIGN_SHEET') {
			//   includeOptions = {
			//     assignment_submissions: true,
			//   };
			// }

			const mediaFiles = await this.database.media_files.findMany({
				where: {
					reference_id: content.content_id.toString(),
					reference_type: content.content_type,
				},
			});

			const result = {
				...content,
				mediaFiles,
			};

			return { success: true, data: result };
		} catch (error) {
			return {
				success: false,
				data: null,
				error: '[cycle content repository] Error fetching lesson content',
			};
		}
	}
}

export const cycleContentsRepository = new CycleContentsRepository();
