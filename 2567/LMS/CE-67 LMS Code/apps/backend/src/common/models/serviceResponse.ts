import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

export class ServiceResponse<T = null> {
	readonly success: boolean;
	readonly message: string;
	readonly responseObject: T;
	readonly statusCode: number;

	private constructor(success: boolean, message: string, responseObject: T, statusCode: number) {
		this.success = success;
		this.message = message;
		this.responseObject = responseObject;
		this.statusCode = statusCode;
	}

	static success<T>(message: string, responseObject: T, statusCode: number = StatusCodes.OK) {
		return new ServiceResponse(true, message, responseObject, statusCode);
	}

	static failure<T>(message: string, responseObject: T, statusCode: number = StatusCodes.BAD_REQUEST) {
		return new ServiceResponse(false, message, responseObject, statusCode);
	}

	// Add toJSON method to handle BigInt serialization
	toJSON() {
		return {
			success: this.success,
			message: this.message,
			responseObject: this.convertBigIntsToStrings(this.responseObject),
			statusCode: this.statusCode,
		};
	}

	// Recursive helper to convert BigInts to strings
	//biome-ignore lint: safe any
	private convertBigIntsToStrings(obj: any): any {
		if (obj === null || obj === undefined) return obj;

		if (typeof obj === 'bigint') {
			return obj.toString();
		}

		if (Array.isArray(obj)) {
			return obj.map((item) => this.convertBigIntsToStrings(item));
		}

		if (typeof obj === 'object') {
			//biome-ignore lint: safe any
			const newObj: any = {};
			for (const [key, value] of Object.entries(obj)) {
				newObj[key] = this.convertBigIntsToStrings(value);
			}
			return newObj;
		}

		return obj;
	}
}

// Update the Zod schema to handle stringified BigInts
export const ServiceResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
	z
		.object({
			success: z.boolean(),
			message: z.string(),
			responseObject: dataSchema.optional(),
			statusCode: z.number(),
		})
		.transform((data) => {
			// Optional: If you want to convert BigInt strings back to BigInt
			if (data.responseObject && typeof data.responseObject === 'object') {
				//biome-ignore lint: safe any
				const convertStringsToBigInts = (obj: any): any => {
					if (obj === null || obj === undefined) return obj;

					if (typeof obj === 'string') {
						try {
							const bigIntValue = BigInt(obj);
							return bigIntValue;
						} catch {
							return obj;
						}
					}

					if (Array.isArray(obj)) {
						return obj.map((item) => convertStringsToBigInts(item));
					}

					if (typeof obj === 'object') {
						//biome-ignore lint: safe any
						const newObj: any = {};
						for (const [key, value] of Object.entries(obj)) {
							newObj[key] = convertStringsToBigInts(value);
						}
						return newObj;
					}

					return obj;
				};

				data.responseObject = convertStringsToBigInts(data.responseObject);
			}

			return data;
		});
