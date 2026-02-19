// import { logger } from '@/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
	prisma?: PrismaClient;
};

function createExtendedPrismaClient(): PrismaClient {
	const client = new PrismaClient();
	// .$extends({
	// 	result: {
	// 		$allModels: {
	// 			$allFields: {
	// 				compute({ value }: { value: unknown }) {
	// 					if (typeof value === 'bigint') {
	// 						return value.toString();
	// 					}
	// 					if (value instanceof Date) {
	// 						return value.toISOString();
	// 					}
	// 					return value;
	// 				},
	// 			},
	// 		},
	// 	},
	// });

	return client as unknown as PrismaClient;
}

export const prisma =
	process.env.NODE_ENV === 'production'
		? createExtendedPrismaClient()
		: //biome-ignore lint: safe expression
			(globalForPrisma.prisma ?? (globalForPrisma.prisma = createExtendedPrismaClient()));

export const isDatabaseConnected = async (): Promise<boolean> => {
	try {
		await prisma.$queryRaw`SELECT 1`;
		// logger.info('✅ Database is connected');
		return true;
	} catch (error) {
		// logger.error('❌ Database connection failed', error);
		return false;
	}
};
