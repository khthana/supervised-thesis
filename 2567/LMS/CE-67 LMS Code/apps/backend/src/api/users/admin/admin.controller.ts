import type { NextFunction, Request, RequestHandler, Response } from 'express';

import { adminService } from '@/api/users/admin/admin.service';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { handleServiceResponse } from '@/common/utils/httpHandlers.util';
import { logger } from '@/server';
import type { admins, users } from '@prisma/client';

class AdminController {
	public getAdmins = async (req: Request, res: Response) => {
		if (!req.validatedData || !req.validatedData.query) {
			return handleServiceResponse(ServiceResponse.failure('[Controller] Invalid request data', null), res);
		}

		const { query } = req.validatedData;
		const { limit, offset, sortBy, orderBy, searchText } = query;
		const serviceResponse = await adminService.getAdmins(limit, offset, sortBy as keyof admins, orderBy, searchText);
		return handleServiceResponse(serviceResponse, res);
	};

	public getAdminByID: RequestHandler = async (req: Request, res: Response) => {
		const id = req.params.id as string;
		const serviceResponse = await adminService.getAdminById(id);
		return handleServiceResponse(serviceResponse, res);
	};
}

export const adminController = new AdminController();
