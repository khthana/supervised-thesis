import { prisma } from '@/common/utils/database.util';
import type { Prisma, PrismaClient, media_files } from '@prisma/client';

class MediaRepository {
	private database: PrismaClient;

	constructor() {
		this.database = prisma;
	}

	public async createMediaFile(mediaFile: Prisma.media_filesCreateInput): Promise<{
		success: boolean;
		data?: media_files | null;
		error?: string;
	}> {
		try {
			const createdMediaFile = await this.database.media_files.create({
				data: mediaFile,
			});
			return { success: true, data: createdMediaFile };
		} catch (error) {
			return { success: false, error: (error as Error).message };
		}
	}

	public async updateMediaFile(
		reference_id: string,
		reference_type: string,
		mediaFileData: Prisma.media_filesUpdateInput,
	): Promise<{
		success: boolean;
		data?: media_files | null;
		error?: string;
	}> {
		try {
			// Update the media file based on reference_id and reference_type
			const updatedMediaFile = await this.database.media_files.updateMany({
				where: {
					reference_id,
					reference_type,
				},
				data: mediaFileData,
			});

			if (updatedMediaFile.count === 0) {
				return { success: false, error: 'No media file found with the provided reference' };
			}

			// Fetch and return the updated record
			const mediaFile = await this.database.media_files.findFirst({
				where: {
					reference_id,
					reference_type,
				},
			});

			return { success: true, data: mediaFile };
		} catch (error) {
			return { success: false, error: (error as Error).message };
		}
	}

	public async findMediaFileByRefIDAndRefType(
		reference_id: string,
		reference_type: string,
	): Promise<{
		success: boolean;
		data?: media_files | null;
		error?: string;
	}> {
		try {
			const mediaFile = await this.database.media_files.findFirst({
				where: {
					reference_id,
					reference_type,
				},
			});
			return { success: true, data: mediaFile };
		} catch (error) {
			return { success: false, error: (error as Error).message };
		}
	}

	public async findAllMediaFiles(): Promise<{
		success: boolean;
		data?: media_files[] | null;
		error?: string;
	}> {
		try {
			const mediaFiles = await this.database.media_files.findMany();
			return { success: true, data: mediaFiles };
		} catch (error) {
			return { success: false, error: (error as Error).message };
		}
	}
}

export const mediaRepository = new MediaRepository();
