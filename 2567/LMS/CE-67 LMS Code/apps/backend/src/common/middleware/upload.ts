import fs from 'node:fs';
import path from 'node:path';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { handleServiceResponse } from '@/common/utils/httpHandlers.util';
import { logger } from '@/common/utils/logger.util';
import type { NextFunction, Request, Response } from 'express';
import formidable, { errors as formidableErrors } from 'formidable';
import { StatusCodes } from 'http-status-codes';

export const BASE_UPLOAD_DIR = path.join(__dirname, '../../../../../uploads');

export const uploadCourseIntrovideo = async (req: Request, res: Response, next: NextFunction) => {
	const uploadPath = path.join(BASE_UPLOAD_DIR, 'course/intro_video');
	if (!fs.existsSync(uploadPath)) {
		fs.mkdirSync(uploadPath, { recursive: true });
	}

	if (!req.course) {
		return handleServiceResponse(ServiceResponse.failure('[uploadCourseIntroVideo] Invalid request data#1', null), res);
	}

	const course = req.course;

	if (!course.course_id) {
		return handleServiceResponse(ServiceResponse.failure('[uploadCourseIntroVideo] Invalid request data#2', null), res);
	}

	const form = formidable({
		uploadDir: uploadPath,
		keepExtensions: true,
		multiples: false,
		maxFiles: 1,
		maxFileSize: 60 * 1024 * 1024,
		filename: (_name, ext, _path, _form) => {
			const fileName = `course_intro_video_${course.course_id}${ext}`;
			return fileName;
		},
	});

	let fields: formidable.Fields;
	let files: formidable.Files;

	try {
		[fields, files] = await form.parse(req);
	} catch (err) {
		if (err instanceof formidableErrors.FormidableError) {
			return handleServiceResponse(ServiceResponse.failure(err.message, null, StatusCodes.BAD_REQUEST), res);
		}
		return handleServiceResponse(
			ServiceResponse.failure(
				'[middleware uploadCourseIntrovideo] Unknown error',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			),
			res,
		);
	}

	req.uploadedData = {
		fields,
		files,
		refType: 'COURSE_INTRO_VIDEO',
	};

	next();
};

export const uploadCourseAvatar = async (req: Request, res: Response, next: NextFunction) => {
	const uploadPath = path.join(BASE_UPLOAD_DIR, 'course/avatar');
	if (!fs.existsSync(uploadPath)) {
		fs.mkdirSync(uploadPath, { recursive: true });
	}

	if (!req.course) {
		return handleServiceResponse(
			ServiceResponse.failure('[middleware uploadCourseAvatar] Invalid request data#1', null),
			res,
		);
	}

	const course = req.course;

	if (!course.course_id) {
		return handleServiceResponse(
			ServiceResponse.failure('[middleware uploadCourseAvatar] Invalid request data#2', null),
			res,
		);
	}

	let backupFilePath = undefined;

	const form = formidable({
		uploadDir: uploadPath,
		keepExtensions: true,
		multiples: false,
		maxFiles: 1,
		maxFileSize: 4 * 1024 * 1024,
		filename: (_name, ext, _path, _form) => {
			const fileName = `course_avatar_${course.course_id}${ext}`;
			const filePath = path.join(uploadPath, fileName);
			if (fs.existsSync(filePath)) {
				const backupFileName = `${fileName}.bak`;
				backupFilePath = path.join(uploadPath, backupFileName);
				fs.renameSync(filePath, backupFilePath);
			}
			return fileName;
		},
	});

	let fields: formidable.Fields;
	let files: formidable.Files;

	try {
		[fields, files] = await form.parse(req);
	} catch (err) {
		if (err instanceof formidableErrors.FormidableError) {
			return handleServiceResponse(ServiceResponse.failure(err.message, null, StatusCodes.BAD_REQUEST), res);
		}
		return handleServiceResponse(
			ServiceResponse.failure('[middleware uploadCourseAvatar] Unknown error', null, StatusCodes.INTERNAL_SERVER_ERROR),
			res,
		);
	}

	req.uploadedData = {
		fields,
		files,
		refType: 'COURSE_AVATAR',
		oldFilePath: backupFilePath,
	};

	next();
};

export const uploadUserAvatar = async (req: Request, res: Response, next: NextFunction) => {
	const uploadPath = path.join(BASE_UPLOAD_DIR, 'user/avatar');
	if (!fs.existsSync(uploadPath)) {
		fs.mkdirSync(uploadPath, { recursive: true });
	}

	if (!req.user) {
		return handleServiceResponse(ServiceResponse.failure('[uploadUserAvatar] Invalid request data#1', null), res);
	}

	const user = req.user;

	if (!user.user_id) {
		return handleServiceResponse(ServiceResponse.failure('[uploadUserAvatar] Invalid request data#2', null), res);
	}

	let backupFilePath = undefined;

	const form = formidable({
		uploadDir: uploadPath,
		keepExtensions: true,
		multiples: false,
		maxFiles: 1,
		maxFileSize: 4 * 1024 * 1024,
		filename: (_name, ext, _path, _form) => {
			const fileName = `user_avatar_${user.user_id}${ext}`;
			const filePath = path.join(uploadPath, fileName);
			if (fs.existsSync(filePath)) {
				const backupFileName = `${fileName}.bak`;
				backupFilePath = path.join(uploadPath, backupFileName);
				fs.renameSync(filePath, backupFilePath);
			}
			return fileName;
		},
	});

	let fields: formidable.Fields;
	let files: formidable.Files;

	try {
		[fields, files] = await form.parse(req);
	} catch (err) {
		if (err instanceof formidableErrors.FormidableError) {
			return handleServiceResponse(ServiceResponse.failure(err.message, null, StatusCodes.BAD_REQUEST), res);
		}
		return handleServiceResponse(
			ServiceResponse.failure('[middleware uploadUserAvatar] Unknown error', null, StatusCodes.INTERNAL_SERVER_ERROR),
			res,
		);
	}

	req.uploadedData = {
		fields,
		files,
		refType: 'USER_AVATAR',
		oldFilePath: backupFilePath,
	};

	next();
};

export const uploadContentVideo = async (req: Request, res: Response, next: NextFunction) => {
	const uploadPath = path.join(BASE_UPLOAD_DIR, 'contents/video');
	if (!fs.existsSync(uploadPath)) {
		fs.mkdirSync(uploadPath, { recursive: true });
	}

	if (!req.params) {
		return handleServiceResponse(ServiceResponse.failure('[uploadContentVideo] Invalid request data#1', null), res);
	}

	if (!req.params.content_id) {
		return handleServiceResponse(ServiceResponse.failure('[uploadContentVideo] Invalid request data#2', null), res);
	}

	const contentId = Number.parseInt(req.params.content_id, 10);
	if (Number.isNaN(contentId)) {
		return handleServiceResponse(ServiceResponse.failure('[uploadContentVideo] Invalid request data#3', null), res);
	}

	const form = formidable({
		uploadDir: uploadPath,
		keepExtensions: true,
		multiples: false,
		maxFiles: 1,
		maxFileSize: 100 * 1024 * 1024,
		filename: (_name, ext, _path, _form) => {
			const fileName = `content_video_${contentId}${ext}`;
			return fileName;
		},
	});

	let fields: formidable.Fields;
	let files: formidable.Files;

	try {
		[fields, files] = await form.parse(req);
	} catch (err) {
		if (err instanceof formidableErrors.FormidableError) {
			return handleServiceResponse(ServiceResponse.failure(err.message, null, StatusCodes.BAD_REQUEST), res);
		}
		return handleServiceResponse(
			ServiceResponse.failure('[middleware uploadContentVideo] Unknown error', null, StatusCodes.INTERNAL_SERVER_ERROR),
			res,
		);
	}

	req.uploadedData = {
		fields,
		files,
		refType: 'CONTENT_VIDEO',
	};

	next();
};
