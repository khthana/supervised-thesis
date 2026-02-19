import type { LoaderFunctionArgs } from 'react-router';
import { getPublicEnv } from '../lib/env.server';
import { getAccessToken } from '../server/token.server';

export async function action({ request, params }: LoaderFunctionArgs) {
	console.log('action update course');
	const env = getPublicEnv();
	const courseId = params.course_id;
	const Token = await getAccessToken(request);

	if (!Token.accessToken) {
		return {
			success: false,
			message: 'Unauthorized',
			statusCode: 401,
			responseObject: null,
		};
	}

	const accessToken = Token.accessToken;

	// console.log('courseId', courseId);
	const formData = await request.formData();
	const formDataObj = Object.fromEntries(formData.entries());

	let processedDescription = formDataObj.description;
	if (typeof processedDescription === 'string') {
		try {
			const descriptionObj = JSON.parse(processedDescription);
			processedDescription = JSON.stringify(descriptionObj);
		} catch (e) {
			console.error('Error parsing description:', e);
		}
	}

	const processedData = {
		...formDataObj,
		description: processedDescription,
		category_id: formDataObj.category_id ? Number(formDataObj.category_id) : undefined,
		subcategory_id: formDataObj.subcategory_id ? Number(formDataObj.subcategory_id) : undefined,
	};

	// console.log('processedData', processedData);
	try {
		const response = await fetch(`${env.BACKEND_URL}/api/courses/${courseId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify(processedData),
		});

		if (!response.ok) {
			throw new Error(`Failed to update course: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		console.log('data', data.responseObject);
		return data;
	} catch (error) {
		console.error('Error updating course:', error);
		return {
			success: false,
			message: 'Failed to update course',
			statusCode: 500,
			responseObject: null,
		};
	}
}
