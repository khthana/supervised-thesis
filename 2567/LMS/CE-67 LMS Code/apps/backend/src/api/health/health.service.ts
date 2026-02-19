import { StatusCodes } from 'http-status-codes';

import { ServiceResponse } from '@/common/models/serviceResponse';
import { isDatabaseConnected } from '@/common/utils/database.util';
import { isRedisServerConnected } from '@/common/utils/redis.util';
import { logger } from '@/server';

class HealthService {
	// Retrieves the health status of the service
	async checkHealth(): Promise<ServiceResponse<string | null>> {
		try {
			const isDbConnected = await isDatabaseConnected();
			if (!isDbConnected) {
				return ServiceResponse.failure('❌ Cannot connect to the database.', null, StatusCodes.INTERNAL_SERVER_ERROR);
			}

			const isRedisConnected = await isRedisServerConnected();
			if (!isRedisConnected) {
				return ServiceResponse.failure('❌ Cannot connect to Redis.', null, StatusCodes.INTERNAL_SERVER_ERROR);
			}

			return ServiceResponse.success<string | null>('✅ Service is healthy', null);
		} catch (ex) {
			const errorMessage = `❌ Error checking health status: ${(ex as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure(
				'❌ An error occurred while checking health status.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}
}

export const healthService = new HealthService();
