import toastSession from '@/server/sessions/toast.server';
import { createToastUtilsWithCustomSession } from 'remix-toast';

export const {
	getToast,
	redirectWithToast,
	redirectWithSuccess,
	redirectWithError,
	redirectWithInfo,
	redirectWithWarning,
	// jsonWithSuccess,
	// jsonWithError,
	// jsonWithInfo,
	// jsonWithWarning,
} = createToastUtilsWithCustomSession(toastSession);
