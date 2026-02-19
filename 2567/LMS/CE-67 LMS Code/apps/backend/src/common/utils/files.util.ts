import fs from 'node:fs';
import path from 'node:path';
import { logger } from '@/server';

export function removeFile(filePath: string): void {
	if (fs.existsSync(filePath)) {
		fs.unlink(filePath, (unlinkErr) => {
			if (unlinkErr) {
				logger.error('[CourseMediaService] Failed to delete file:', unlinkErr);
			} else {
				logger.info('[CourseMediaService] Deleted file due to service failure');
			}
		});
	}
}
