import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';

import { apiRouter } from '@/api';
import { openAPIRouter } from '@/api-docs/openAPIRouter';
import { mediaRouter } from '@/api/media/media.routes';
import errorHandler from '@/common/middleware/errorHandler';
import rateLimiter from '@/common/middleware/rateLimiter';
import requestLogger from '@/common/middleware/requestLogger';
import { env } from '@/common/utils/envConfig.util';
import { logger } from '@/common/utils/logger.util';
import { serverAdapter, videoQueue } from '@/common/utils/queue.util';
import { redis } from '@/common/utils/redis.util';

// Handle error event
redis.on('error', (err: Error) => {
	console.error('❌ Redis connection error:', err.message || err);
});

// Handle close event
redis.on('close', () => {
	console.warn('⚠️ Redis connection closed.');
});

const allowedOrigins = env.CORS_ORIGIN;
const app: Express = express();

// Set the application to trust the reverse proxy
app.set('trust proxy', true);

// parse cookies
app.use(cookieParser());

// media router
app.use('/api/media', requestLogger, mediaRouter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging - move here to see the parsed body
app.use(requestLogger);

app.use((_req, res, next) => {
	res.setHeader('Origin-Agent-Cluster', '?1'); // หรือ '?0' ให้เหมือนกันทุกหน้า
	next();
});

// CORS, Helmet and other middleware
app.use(
	cors({
		origin: allowedOrigins || '*',
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		credentials: true,
	}),
);
app.use(
	helmet({
		contentSecurityPolicy: false,
		crossOriginEmbedderPolicy: true,
		crossOriginOpenerPolicy: false,
		dnsPrefetchControl: false,
	}),
);
app.use(rateLimiter);

app.use('/queue', serverAdapter.getRouter());

app.use('/add', (req, res) => {
	const opts =
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		typeof req.query.opts === 'string' ? JSON.parse(req.query.opts) : (req.query.opts as Record<string, any>) || {};

	if (opts.delay) {
		opts.delay = +opts.delay * 1000; // delay must be a number
	}

	videoQueue.add('Add', { title: req.query.title }, opts);

	res.json({
		ok: true,
	});
});

app.use('/api', apiRouter);

// Swagger UI => /api-docs
app.use(openAPIRouter);
// Redirect to Swagger UI
app.get('/', (_req, res) => {
	res.redirect('/api-docs');
});

// Error handlers
app.use(errorHandler());

export { app, logger };
