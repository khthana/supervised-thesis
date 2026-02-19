import fs from 'node:fs';
import path from 'node:path';
import type { Prisma, media_files, users } from '@prisma/client';
import type { Request } from 'express';
import { StatusCodes } from 'http-status-codes';

import { mediaRepository } from '@/api/media/media.repository';
import { BASE_UPLOAD_DIR } from '@/common/middleware/upload';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';

import { env } from '@/common/utils/envConfig.util';
import formidable, { errors as formidableErrors } from 'formidable';

import { removeFile } from '@/common/utils/files.util';
import { type MediaFile, ValidateMediaFileSchema } from '@shared/types/mediafile.model';

class UserMediaService {
	private mediaRepository: typeof mediaRepository;

	constructor() {
		this.mediaRepository = mediaRepository;
	}

	async getUserAvatarMeta(user: users): Promise<ServiceResponse<media_files | null>> {
		const { success, data, error } = await this.mediaRepository.findMediaFileByRefIDAndRefType(
			user.user_id,
			'USER_AVATAR',
		);
		if (!success) {
			if (error) {
				return ServiceResponse.failure(error, null, StatusCodes.INTERNAL_SERVER_ERROR);
			}
			return ServiceResponse.failure('[get user avatar] Unknown error', null, StatusCodes.INTERNAL_SERVER_ERROR);
		}

		if (!data) {
			return ServiceResponse.success('[get user avatar] No avatar found', null);
		}

		return ServiceResponse.success('[get user avatar] Success', data);
	}

	async uploadUserAvatar(req: Request, user: users): Promise<ServiceResponse<media_files | null>> {
		try {
			if (!req.uploadedData || !req.uploadedData.files) {
				return ServiceResponse.failure('[uploadUserAvatar] Invalid request data#3', null);
			}

			const files = req.uploadedData.files;

			if (!files.file || files.file.length === 0) {
				return ServiceResponse.failure('[uploadUserAvatar] No file uploaded', null, StatusCodes.BAD_REQUEST);
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
				return ServiceResponse.failure('[uploadUserAvatar] Invalid file type', null, StatusCodes.BAD_REQUEST);
			}

			const fileMetadata: Prisma.media_filesCreateInput = {
				reference_id: user.user_id,
				reference_type: 'USER_AVATAR',
				reference_sequence: 1,
				reference_settings: {},
				url: path.join('user/avatar', files.file[0].newFilename),
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
				return ServiceResponse.failure('[uploadUserAvatar] Unknown error', null, StatusCodes.INTERNAL_SERVER_ERROR);
			}

			if (!data) {
				removeFile(filePath);
				// resotre the file to the original location
				if (req.uploadedData.oldFilePath) {
					// rename with remove .bak
					fs.renameSync(filePath, req.uploadedData.oldFilePath);
					req.uploadedData.oldFilePath = undefined;
				}
				return ServiceResponse.failure('[uploadUserAvatar] Unknown error#1', null, StatusCodes.INTERNAL_SERVER_ERROR);
			}

			return ServiceResponse.success('[uploadUserAvatar] Success', data);
		} catch (err) {
			logger.error(err);
			return ServiceResponse.failure('[uploadUserAvatar] Unknown error', null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}
}

export const userMediaService = new UserMediaService();
