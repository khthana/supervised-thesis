import { env } from '@/common/utils/envConfig.util';
import { logger } from '@/server';
import Redis from 'ioredis';

let _redisRetryCount = 0;

export const redis = new Redis({
	host: env.REDIS_HOST,
	port: env.REDIS_PORT,
	connectTimeout: 10000,
	commandTimeout: 10000,
	maxRetriesPerRequest: null,
	enableReadyCheck: false,

	retryStrategy: (times) => {
		if (times >= 100) {
			console.error('❌ Redis connection failed after max retries.');
			redis.disconnect();
			return null;
		}
		_redisRetryCount++;
		// Exponential backoff strategy maximum delay of 10 seconds
		const delay = Math.min(100 * 2 ** times, 10000);
		console.warn(`🔄 Redis reconnect attempt #${times}, retrying in ${delay}ms`);
		return delay;
	},
});

export const isRedisServerConnected = async (): Promise<boolean> => {
	try {
		const result = await redis.ping();
		if (result === 'PONG') {
			logger.info('✅ Redis is connected');
			return true;
		}
		logger.error('❌ Redis connection failed');
		return false;
	} catch (error) {
		logger.error('❌ Redis connection failed', error);
		return false;
	}
};
