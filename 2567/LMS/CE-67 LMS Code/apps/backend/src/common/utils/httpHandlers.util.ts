import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError, type ZodSchema } from 'zod';

import { ServiceResponse } from '@/common/models/serviceResponse';
import { env } from '@/common/utils/envConfig.util';
import { logger } from '@/server';

// Extend JSON เพื่อรองรับการแปลง BigInt ให้เป็น string
// biome-ignore lint: safe any
// (BigInt.prototype as any).toJSON = function () {
// 	return this.toString();
// };

// TODO: improve performance or reduce overhead of converting function
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const convertNestedValues = (value: any): any => {
	if (value instanceof Date) {
		return value.toISOString();
	}

	if (typeof value === 'bigint') {
		return value.toString();
	}

	if (Array.isArray(value)) {
		return value.map((item) => convertNestedValues(item));
	}

	if (value !== null && typeof value === 'object') {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const newObj: Record<string, any> = {};
		for (const key in value) {
			if (Object.prototype.hasOwnProperty.call(value, key)) {
				newObj[key] = convertNestedValues(value[key]);
			}
		}
		return newObj;
	}

	return value;
};

export const handleServiceResponse = <T>(serviceResponse: ServiceResponse<T>, response: Response) => {
	const responseObject = serviceResponse.responseObject;
	let processedResponse = responseObject;

	if (responseObject && typeof responseObject === 'object') {
		processedResponse = convertNestedValues(responseObject);
	}

	const clonedResponse = {
		...serviceResponse,
		responseObject: processedResponse,
	};

	if (!response.headersSent) {
		response.status(serviceResponse.statusCode).send(clonedResponse);
	}
};

export const validateRequest = (schema: ZodSchema) => async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { body, query, params } = schema.parse({
			body: req.body,
			query: req.query,
			params: req.params,
		});

		// เพิ่ม validated data ไปยัง request object
		req.validatedData = { body, query, params };

		next();
	} catch (err) {
		// check if zod error
		if (err instanceof ZodError || (err && typeof err === 'object' && 'errors' in err)) {
			const statusCode = StatusCodes.BAD_REQUEST;
			const zodErrors = err instanceof ZodError ? err.errors : (err as ZodError).errors;

			const serviceResponse = ServiceResponse.failure<{ details: ZodError['errors'] }>(
				'[http handler] Validation Error',
				{ details: zodErrors },
				statusCode,
			);
			return handleServiceResponse(serviceResponse, res);
		}

		// check if prisma error
		if (err && typeof err === 'object' && 'code' in err) {
			const statusCode = StatusCodes.BAD_REQUEST;
			const prismaError = err as { code: string; message: string };
			const serviceResponse = ServiceResponse.failure<{ details: string }>(
				'[http handler] Prisma Error',
				{ details: prismaError.message },
				statusCode,
			);
			return handleServiceResponse(serviceResponse, res);
		}

		// check if other error
		const serviceResponse = ServiceResponse.failure(
			'[http handler] An unexpected error occurred.',
			env.isProduction ? null : { error: (err as Error).message },
			StatusCodes.INTERNAL_SERVER_ERROR,
		);
		return handleServiceResponse(serviceResponse, res);
	}
};
