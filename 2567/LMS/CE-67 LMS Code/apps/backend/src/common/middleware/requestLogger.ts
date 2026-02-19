import { randomUUID } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Request, RequestHandler, Response } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import type { LevelWithSilent } from 'pino';
import { type CustomAttributeKeys, type Options, pinoHttp } from 'pino-http';

import { env } from '@/common/utils/envConfig.util';
import { censorEmail } from '@/common/utils/string.util';

enum LogLevel {
	Fatal = 'fatal',
	Error = 'error',
	Warn = 'warn',
	Info = 'info',
	Debug = 'debug',
	Trace = 'trace',
	Silent = 'silent',
}

type PinoCustomProps = {
	request: Request;
	response: Response;
	error: Error;
	responseBody: unknown;
	requestBody: unknown;
};

const customRemove = new Set([
	'host',
	'user-agent',
	'accept',
	'sec-ch-ua',
	'content-type',
	'sec-ch-ua-mobile',
	'origin',
	'sec-fetch-site',
	'sec-fetch-mode',
	'sec-fetch-dest',
	'accept-encoding',
	'accept-language',
	'cf-connecting-ip',
	'cf-visitor',
	'cf-ipcountry',
	'cf-ray',
	'cdn-loop',
	'x-forwarded-for',
	'x-real-ip',
	'x-forwarded-host',
	'x-forwarded-port',
	'x-forwarded-scheme',
	'x-forwarded-proto',
	'connection',
]);

const customRedact: string[] = [];

const CENSOR_PATTERN = '***🔒CENSORED🔒***';

const requestLogger = (options?: Options): RequestHandler[] => {
	const pinoOptions: Options = {
		enabled: true,
		customProps: customProps as unknown as Options['customProps'],
		redact: {
			paths: customRedact,
			censor: CENSOR_PATTERN,
		},
		genReqId,
		customLogLevel,
		customSuccessMessage,
		customReceivedMessage: (req) => `request received: ${req.method}`,
		customErrorMessage: (_req, res) => `request errored with status code: ${res.statusCode}`,
		customAttributeKeys,
		serializers: customSerializers, // Add the custom serializers
		transport: {
			target: 'pino-pretty',
			options: {
				colorize: true,
				translateTime: 'SYS:standard',
				ignore: 'pid,hostname',
			},
		},
		...options,
	};
	return [responseBodyMiddleware, pinoHttp(pinoOptions)];
};

// Define custom serializers to control how objects are logged
const customSerializers = {
	req: (req: IncomingMessage) => {
		const headers = (req as Request).headers;
		const body = (req as Request).body;

		// Function to sanitize the request body (similar to how we handle responseBody)
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const sanitizeRequestBody = (body: any) => {
			if (!body) return body;

			// Create a deep clone to avoid modifying the original request
			try {
				const clonedBody = JSON.parse(JSON.stringify(body));

				// Redact password fields
				if (clonedBody.password) {
					clonedBody.password = CENSOR_PATTERN;
				}

				if (clonedBody.password_hash) {
					clonedBody.password_hash = CENSOR_PATTERN;
				}

				// Add more specific body redactions as needed

				return clonedBody;
			} catch (_e) {
				// If we can't clone (e.g., circular references), return safely
				return body;
			}
		};

		const removeSensitiveHeaders = (headers: Record<string, string | string[] | undefined>) => {
			const sanitizedHeaders = { ...headers }; // Clone headers object

			// Handle authorization header separately
			if (sanitizedHeaders.authorization) {
				const authHeader = sanitizedHeaders.authorization as string;
				if (authHeader.startsWith('Bearer ')) {
					sanitizedHeaders.authorization = `Bearer ${CENSOR_PATTERN}`;
				} else {
					sanitizedHeaders.authorization = CENSOR_PATTERN;
				}
			}

			// Remove other sensitive headers
			for (const key of Object.keys(sanitizedHeaders)) {
				if (customRemove.has(key.toLowerCase())) {
					delete sanitizedHeaders[key]; // 🔥 ลบ header ทิ้งไปเลย
				}
			}
			return sanitizedHeaders;
		};
		return {
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			id: (req as any).id,
			method: req.method,
			url: req.url,
			path: (req as Request).path,
			query: (req as Request).query,
			params: (req as Request).params,
			body: sanitizeRequestBody(body),
			headers: removeSensitiveHeaders(headers),
			remoteAddress: req.socket?.remoteAddress,
		};
	},
	res: (res: ServerResponse) => {
		return {
			statusCode: res.statusCode,
			// Headers are already being redacted in the options
		};
	},
	err: (err: Error) => {
		return {
			type: err.constructor.name,
			message: err.message,
			stack: env.isDevelopment ? err.stack : undefined,
			// Include additional error properties if they exist
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			...((err as any).statusCode && { statusCode: (err as any).statusCode }),
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			...((err as any).code && { code: (err as any).code }),
		};
	},
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	requestBody: (body: any) => {
		if (!body) return body;

		try {
			// Create a deep clone to avoid modifying the original request
			const clonedBody = JSON.parse(JSON.stringify(body));

			// Case 1: Redact request body email, password if it's on production
			if (env.isProduction) {
				if (clonedBody?.email) {
					clonedBody.email = censorEmail(clonedBody.email);
				}
				if (clonedBody?.password) {
					clonedBody.password = CENSOR_PATTERN;
				}
			}

			return clonedBody;
		} catch (_e) {
			// If we can't clone (e.g., circular references), return safely
			return body;
		}
	},
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	responseBody: (body: any) => {
		// Handle different types of response bodies
		if (typeof body === 'string') {
			try {
				// Try to parse as JSON
				return JSON.parse(body);
			} catch (_e) {
				// If not valid JSON, return as string
				return body.length > 200 ? `${body.substring(0, 200)}... (truncated)` : body;
			}
		}

		// Create a deep clone to avoid modifying the original response
		const clonedBody = JSON.parse(JSON.stringify(body));

		// Case 1: Redact password_hash in users array if it exists
		if (clonedBody?.responseObject?.users && Array.isArray(clonedBody.responseObject.users)) {
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			clonedBody.responseObject.users = clonedBody.responseObject.users.map((user: any) => {
				if (user.password_hash) {
					if (env.isProduction) {
						user.email = censorEmail(user.email);
					}
					return {
						...user,
						password_hash: CENSOR_PATTERN,
					};
				}
				return user;
			});
		}

		// Case 2: Redact password_hash in a single user object
		if (clonedBody?.responseObject?.password_hash && clonedBody?.responseObject?.email) {
			clonedBody.responseObject.password_hash = CENSOR_PATTERN;
			if (env.isProduction) {
				clonedBody.responseObject.email = censorEmail(clonedBody.responseObject.email);
			}
		}

		return clonedBody;
	},
};

const customAttributeKeys: CustomAttributeKeys = {
	req: 'request',
	res: 'response',
	err: 'error',
	responseTime: 'timeTaken',
};

const customProps = (req: Request, res: Response): PinoCustomProps => ({
	request: req,
	response: res,
	error: res.locals.err,
	responseBody: res.locals.responseBody,
	requestBody: req.body,
});

const responseBodyMiddleware: RequestHandler = (_req, res, next) => {
	const isNotProduction = !env.isProduction;
	if (isNotProduction) {
		const originalSend = res.send;
		res.send = (content) => {
			res.locals.responseBody = content;
			res.send = originalSend;
			return originalSend.call(res, content);
		};
	}
	next();
};

const customLogLevel = (_req: IncomingMessage, res: ServerResponse<IncomingMessage>, err?: Error): LevelWithSilent => {
	if (err || res.statusCode >= StatusCodes.INTERNAL_SERVER_ERROR) return LogLevel.Error;
	if (res.statusCode >= StatusCodes.BAD_REQUEST) return LogLevel.Warn;
	if (res.statusCode >= StatusCodes.MULTIPLE_CHOICES) return LogLevel.Silent;
	return LogLevel.Info;
};

const customSuccessMessage = (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
	if (res.statusCode === StatusCodes.NOT_FOUND) return getReasonPhrase(StatusCodes.NOT_FOUND);
	return `${req.method} completed`;
};

const genReqId = (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
	const existingID = req.id ?? req.headers['x-request-id'];
	if (existingID) return existingID;
	const id = randomUUID();
	res.setHeader('X-Request-Id', id);
	return id;
};

export default requestLogger();
