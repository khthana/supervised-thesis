import { z } from 'zod';

export const validateUUID = (uuid: string): boolean => {
	const parsedUUID = z.string().uuid().safeParse(uuid);
	if (!parsedUUID.success) {
		return false;
	}
	return true;
};

const youtubeVideoUrlRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}(&.+)?$/;

export const youtubeVideoSchema = z.object({
	external_video: z
		.string()
		.url()
		.refine((val) => youtubeVideoUrlRegex.test(val), {
			message: 'Must be a valid YouTube video URL',
		}),
});

export const validateEmail = (email: string): boolean => {
	const parsedEmail = z.string().email().safeParse(email);
	if (!parsedEmail.success) {
		return false;
	}
	return true;
};
