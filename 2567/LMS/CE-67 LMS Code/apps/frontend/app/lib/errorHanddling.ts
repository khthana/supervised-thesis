// ไฟล์ใหม่
export interface ErrorResponse {
	status: number;
	message: string;
}

export function handleApiError(error: unknown, fallbackMessage: string): ErrorResponse {
	console.error('API Error:', error);

	if (error instanceof Response) {
		return {
			status: error.status,
			message: `${fallbackMessage} (${error.status})`,
		};
	}

	if (error instanceof Error) {
		return {
			status: 500,
			message: `${fallbackMessage}: ${error.message}`,
		};
	}

	return {
		status: 500,
		message: fallbackMessage,
	};
}
