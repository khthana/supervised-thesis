import { isDatabaseConnected } from '@/common/utils/database.util';
import { env } from '@/common/utils/envConfig.util';
import { app, logger } from '@/server';

const startServer = async () => {
	const isDbConnected = await isDatabaseConnected();
	if (!isDbConnected) {
		process.exit(1);
	}

	const server = app.listen(env.PORT, () => {
		const { NODE_ENV, HOST, PORT } = env;
		logger.info(`🚀 Server (${NODE_ENV}) running on http://${HOST}:${PORT}`);
	});

	const onCloseSignal = () => {
		logger.info('SIGINT received, shutting down');
		server.close(() => {
			logger.info('Server closed');
			process.exit();
		});
		setTimeout(() => process.exit(1), 10000).unref();
	};

	process.on('SIGINT', onCloseSignal);
	process.on('SIGTERM', onCloseSignal);
};

startServer().catch((err) => {
	logger.error('❌ Server startup failed', err);
	process.exit(1);
});
