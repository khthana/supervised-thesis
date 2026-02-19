import fs from 'node:fs';
import path from 'node:path';
import type { Prisma, media_files, users } from '@prisma/client';
import type { Request } from 'express';
import { StatusCodes } from 'http-status-codes';

import { mediaRepository } from '@/api/media/media.repository';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { removeFile } from '@/common/utils/files.util';
import { validateUUID } from '@/common/validation/string.validation';
import { youtubeVideoSchema } from '@/common/validation/string.validation';
import { logger } from '@/server';

class ContentMediaService {
	private mediaRepository: typeof mediaRepository;

	constructor() {
		this.mediaRepository = mediaRepository;
	}

	async getContentMainVideo(contentId: string, user: users) {
		const { success, data, error } = await this.mediaRepository.findMediaFileByRefIDAndRefType(
			contentId,
			'CONTENT_VIDEO',
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

	async uploadContentMainVideo(req: Request) {
		if (!req.user) {
			return ServiceResponse.failure('[uploadContentVideo] user is not authenticate', null);
		}

		return ServiceResponse.success('Success', null);
	}
}

export const contentMediaService = new ContentMediaService();
