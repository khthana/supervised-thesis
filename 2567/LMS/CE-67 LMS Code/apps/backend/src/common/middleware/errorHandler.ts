import { ServiceResponse } from '@/common/models/serviceResponse';
import { handleServiceResponse } from '@/common/utils/httpHandlers.util';
import type { ErrorRequestHandler, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

const unexpectedRequest: RequestHandler = (_req, res) => {
	const status = StatusCodes.NOT_FOUND;
	const serviceResponse = ServiceResponse.failure('API not found', null, status);
	handleServiceResponse(serviceResponse, res);
};

const addErrorToRequestLog: ErrorRequestHandler = (err, _req, res, next) => {
	res.locals.err = err;
	next(err);
};

export default () => [unexpectedRequest, addErrorToRequestLog];
