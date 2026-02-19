import type { Request, RequestHandler, Response } from 'express';

import { healthService } from '@/api/health/health.service';
import { handleServiceResponse } from '@/common/utils/httpHandlers.util';

class HealthController {
	public check: RequestHandler = async (_req: Request, res: Response) => {
		const serviceResponse = await healthService.checkHealth();
		return handleServiceResponse(serviceResponse, res);
	};
}

export const healthController = new HealthController();
