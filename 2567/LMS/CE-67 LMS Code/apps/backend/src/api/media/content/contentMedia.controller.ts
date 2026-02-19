import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ServiceResponse } from '@/common/models/serviceResponse';
import { handleServiceResponse } from '@/common/utils/httpHandlers.util';
import { youtubeVideoSchema } from '@/common/validation/string.validation';
import { logger } from '@/server';

class ContentMediaController {}

export const contentMediaController = new ContentMediaController();
