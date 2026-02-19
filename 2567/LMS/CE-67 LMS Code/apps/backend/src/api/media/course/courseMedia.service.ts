import fs from 'node:fs';
import path from 'node:path';
import type { Prisma, media_files, users } from '@prisma/client';
import type { Request } from 'express';
import { StatusCodes } from 'http-status-codes';

import { mediaRepository } from '@/api/media/media.repository';
import { BASE_UPLOAD_DIR } from '@/common/middleware/upload';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { removeFile } from '@/common/utils/files.util';
import { validateUUID } from '@/common/validation/string.validation';
import { youtubeVideoSchema } from '@/common/validation/string.validation';
import { logger } from '@/server';

class CourseMediaService {
	private mediaRepository: typeof mediaRepository;

	constructor() {
		this.mediaRepository = mediaRepository;
	}

	async getCourseAvatarMeta(courseId: string): Promise<ServiceResponse<media_files | null>> {
		if (!courseId || !validateUUID(courseId)) {
			return ServiceResponse.failure('[get course avatar] Invalid request data#1', null);
		}

		const { success, data, error } = await this.mediaRepository.findMediaFileByRefIDAndRefType(
			courseId,
			'COURSE_AVATAR',
		);
		if (!success) {
			if (error) {
				return ServiceResponse.failure(error, null, StatusCodes.INTERNAL_SERVER_ERROR);
			}
			return ServiceResponse.failure('[get course avatar] Unknown error', null, StatusCodes.INTERNAL_SERVER_ERROR);
		}

		if (!data) {
			return ServiceResponse.success('[get course avatar] No avatar found', null);
		}

		return ServiceResponse.success('[get course avatar] Success', data);
	}

	async uploadCourseAvatar(req: Request): Promise<ServiceResponse<media_files | null>> {
		if (!req.user) {
			return ServiceResponse.failure('[uploadCourseAvatarMeta] Invalid request data#1', null);
		}

		if (!req.course) {
			return ServiceResponse.failure('[uploadCourseAvatarMeta] Invalid request data#1', null);
		}

		const course = req.course;
		if (!course.course_id) {
			return ServiceResponse.failure('[uploadCourseAvatarMeta] Invalid request data#2', null);
		}

		try {
			if (!req.uploadedData || !req.uploadedData.files) {
				return ServiceResponse.failure('[uploadCourseAvatarMeta] Invalid request data#3', null);
			}

			const files = req.uploadedData.files;

			if (!files.file || files.file.length === 0) {
				return ServiceResponse.failure('[uploadCourseAvatarMeta] No file uploaded', null, StatusCodes.BAD_REQUEST);
			}

			const filePath = files.file[0].filepath;

			if (files.file[0].mimetype !== 'image/jpeg' && files.file[0].mimetype !== 'image/png') {
				removeFile(filePath);
				// resotre the file to the original location
				if (req.uploadedData.oldFilePath) {
					// rename with remove .bak
					fs.renameSync(filePath, req.uploadedData.oldFilePath);
					req.uploadedData.oldFilePath = undefined;
				}
				return ServiceResponse.failure('[uploadCourseAvatarMeta] Invalid file type', null, StatusCodes.BAD_REQUEST);
			}

			const fileMetadata: Prisma.media_filesCreateInput = {
				reference_id: course.course_id,
				reference_type: 'COURSE_AVATAR',
				reference_sequence: 1,
				reference_settings: {},
				url: path.join('course/avatar', files.file[0].newFilename),
				type: 'image',
				mime_type: files.file[0].mimetype,
				size: files.file[0].size,
			};

			const { success, data, error } = await this.mediaRepository.createMediaFile(fileMetadata);
			if (!success) {
				removeFile(filePath);
				// resotre the file to the original location
				if (req.uploadedData.oldFilePath) {
					// rename with remove .bak
					fs.renameSync(filePath, req.uploadedData.oldFilePath);
					req.uploadedData.oldFilePath = undefined;
				}
				if (error) {
					return ServiceResponse.failure(error, null, StatusCodes.INTERNAL_SERVER_ERROR);
				}
				return ServiceResponse.failure(
					'[uploadCourseAvatarMeta] Unknown error',
					null,
					StatusCodes.INTERNAL_SERVER_ERROR,
				);
			}

			if (!data) {
				removeFile(filePath);
				// resotre the file to the original location
				if (req.uploadedData.oldFilePath) {
					// rename with remove .bak
					fs.renameSync(filePath, req.uploadedData.oldFilePath);
					req.uploadedData.oldFilePath = undefined;
				}
				return ServiceResponse.failure(
					'[uploadCourseAvatarMeta] Unknown error#1',
					null,
					StatusCodes.INTERNAL_SERVER_ERROR,
				);
			}

			return ServiceResponse.success('[uploadCourseAvatarMeta] Success', data);
		} catch (err) {
			logger.error(err);
			return ServiceResponse.failure('[uploadCourseAvatarMeta] Unknown error', null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	// async updateCourseAvatar(req: Request, avatar: media_files): Promise<ServiceResponse<media_files | null>> {
	// 	if (!req.course) {
	// 		return ServiceResponse.failure('[updateCourseAvatarMeta] Invalid request data#1', null);
	// 	}

	// 	const course = req.course;
	// 	if (!course.course_id) {
	// 		return ServiceResponse.failure('[updateCourseAvatarMeta] Invalid request data#2', null);
	// 	}

	// 	const localFilePath = path.join(BASE_UPLOAD_DIR, avatar.url);
	// 	removeFile(localFilePath);

	// 	return this.uploadCourseAvatar(req);
	// }

	async uploadCourseIntroVideo(req: Request): Promise<ServiceResponse<media_files | null>> {
		if (!req.user) {
			return ServiceResponse.failure('[uploadCourseIntroVideo] Invalid request data#1', null);
		}

		if (!req.course) {
			return ServiceResponse.failure('[uploadCourseIntroVideo] Invalid request data#1', null);
		}

		const course = req.course;
		if (!course.course_id) {
			return ServiceResponse.failure('[uploadCourseIntroVideo] Invalid request data#2', null);
		}

		try {
			if (!req.uploadedData) {
				return ServiceResponse.failure('[uploadCourseIntroVideo] Invalid request data#3', null);
			}

			if (req.uploadedData.fields) {
				const { external_video } = req.uploadedData.fields;
				const externalVideoStr = Array.isArray(external_video) ? external_video[0] : external_video;
				if (externalVideoStr && !youtubeVideoSchema.safeParse(externalVideoStr).success) {
					return ServiceResponse.failure(
						'[uploadCourseIntroVideo] Invalid youtube video URL',
						null,
						StatusCodes.BAD_REQUEST,
					);
				}

				if (externalVideoStr && youtubeVideoSchema.safeParse(externalVideoStr).success) {
					const fileMetadata: Prisma.media_filesCreateInput = {
						reference_id: course.course_id,
						reference_type: 'COURSE_INTRO_VIDEO',
						reference_sequence: 1,
						reference_settings: {},
						url: externalVideoStr,
						type: 'video',
						mime_type: 'video/link',
						size: 0,
					};

					const { success, data, error } = await this.mediaRepository.createMediaFile(fileMetadata);
					if (!success) {
						if (error) {
							return ServiceResponse.failure(error, null, StatusCodes.INTERNAL_SERVER_ERROR);
						}
						return ServiceResponse.failure(
							'[uploadCourseIntroVideo] Unknown error',
							null,
							StatusCodes.INTERNAL_SERVER_ERROR,
						);
					}

					if (!data) {
						return ServiceResponse.failure(
							'[uploadCourseIntroVideo] Unknown error#1',
							null,
							StatusCodes.INTERNAL_SERVER_ERROR,
						);
					}

					return ServiceResponse.success('[uploadCourseIntroVideo] Success', data);
				}
			}

			if (!req.uploadedData.files) {
				return ServiceResponse.failure('[uploadCourseIntroVideo] Invalid request data#4', null);
			}

			const files = req.uploadedData.files;

			if (!files.file || files.file.length === 0) {
				return ServiceResponse.failure('[uploadCourseIntroVideo] No file uploaded', null, StatusCodes.BAD_REQUEST);
			}

			const filePath = files.file[0].filepath;

			if (
				files.file[0].mimetype !== 'video/mp4' &&
				files.file[0].mimetype !== 'video/webm' &&
				files.file[0].mimetype !== 'video/ogg'
			) {
				removeFile(filePath);
				// resotre the file to the original location
				if (req.uploadedData.oldFilePath) {
					// rename with remove .bak
					fs.renameSync(filePath, req.uploadedData.oldFilePath);
					req.uploadedData.oldFilePath = undefined;
				}
				return ServiceResponse.failure('[uploadCourseIntroVideo] Invalid file type', null, StatusCodes.BAD_REQUEST);
			}

			const fileMetadata: Prisma.media_filesCreateInput = {
				reference_id: course.course_id,
				reference_type: 'COURSE_INTRO_VIDEO',
				reference_sequence: 1,
				reference_settings: {},
				url: path.join('course/intro_video', files.file[0].newFilename),
				type: 'video',
				mime_type: files.file[0].mimetype,
				size: files.file[0].size,
			};

			const { success, data, error } = await this.mediaRepository.createMediaFile(fileMetadata);
			if (!success) {
				removeFile(filePath);
				// resotre the file to the original location
				if (req.uploadedData.oldFilePath) {
					// rename with remove .bak
					fs.renameSync(filePath, req.uploadedData.oldFilePath);
					req.uploadedData.oldFilePath = undefined;
				}
				if (error) {
					return ServiceResponse.failure(error, null, StatusCodes.INTERNAL_SERVER_ERROR);
				}
				return ServiceResponse.failure(
					'[uploadCourseIntroVideo] Unknown error',
					null,
					StatusCodes.INTERNAL_SERVER_ERROR,
				);
			}

			if (!data) {
				removeFile(filePath);
				// resotre the file to the original location
				if (req.uploadedData.oldFilePath) {
					// rename with remove .bak
					fs.renameSync(filePath, req.uploadedData.oldFilePath);
					req.uploadedData.oldFilePath = undefined;
				}
				return ServiceResponse.failure(
					'[uploadCourseIntroVideo] Unknown error#1',
					null,
					StatusCodes.INTERNAL_SERVER_ERROR,
				);
			}

			return ServiceResponse.success('[uploadCourseIntroVideo] Success', data);
		} catch (err) {
			logger.error(err);
			return ServiceResponse.failure('[uploadCourseIntroVideo] Unknown error', null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	// async updateCourseIntroVideo(req: Request): Promise<ServiceResponse<media_files | null>> {
	// 	if (!req.course) {
	// 		return ServiceResponse.failure('[updateCourseAvatarMeta] Invalid request data#1', null);
	// 	}

	// 	const course = req.course;
	// 	if (!course.course_id) {
	// 		return ServiceResponse.failure('[updateCourseAvatarMeta] Invalid request data#2', null);
	// 	}

	// 	const courseVideo = await this.getCourseIntroVideoMeta(course.course_id);
	// 	if (courseVideo.success && courseVideo.responseObject) {
	// 		const localFilePath = path.join(BASE_UPLOAD_DIR, courseVideo.responseObject.url);
	// 		if (localFilePath !== req.uploadedData.files.file[0].filepath) {
	// 			removeFile(localFilePath);
	// 		}
	// 	}

	// 	return this.uploadCourseIntroVideo(req);
	// }

	async getCourseIntroVideoMeta(courseId: string): Promise<ServiceResponse<media_files | null>> {
		if (!courseId || !validateUUID(courseId)) {
			return ServiceResponse.failure('[get course video] Invalid request data#1', null);
		}

		const { success, data, error } = await this.mediaRepository.findMediaFileByRefIDAndRefType(
			courseId,
			'COURSE_INTRO_VIDEO',
		);
		if (!success) {
			if (error) {
				return ServiceResponse.failure(error, null, StatusCodes.INTERNAL_SERVER_ERROR);
			}
			return ServiceResponse.failure('[get course video] Unknown error', null, StatusCodes.INTERNAL_SERVER_ERROR);
		}

		if (!data) {
			return ServiceResponse.success('[get course video] No video found', null);
		}

		return ServiceResponse.success('[get course video] Success', data);
	}
}
export const courseMediaService = new CourseMediaService();
