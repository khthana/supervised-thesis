// /routes/action.pagenate.tsx
import type { ActionFunctionArgs } from 'react-router';
import { getPublicEnv } from '../lib/env.server';

export async function action({ request }: ActionFunctionArgs) {
	const env = getPublicEnv();
	console.log('hi page');
	try {
		const formData = await request.formData();
		const offset = formData.get('offset') || '0';
		const categoryId = formData.get('category_id');
		const subCategoryIds = formData.getAll('subcategory_id');

		const queryParams = new URLSearchParams();
		queryParams.append('limit', '12');
		queryParams.append('offset', offset.toString());

		if (categoryId) {
			queryParams.append('categoryId', categoryId.toString());
		}

		if (subCategoryIds.length > 0) {
			for (const id of subCategoryIds) {
				queryParams.append('subCategoryId', id.toString());
			}
		}

		// console.log('Query Params:', queryParams.toString());
		const response = await fetch(`${env.BACKEND_URL}/api/courses?${queryParams.toString()}`);

		if (!response.ok) {
			console.error(`Failed to fetch courses: ${response.status} ${response.statusText}`);
			return {
				status: response.status,
				message: 'Courses not found',
				course: {
					courses: {
						courses: [],
						totalCount: 0,
					},
				},
			};
		}

		const data = await response.json();

		return {
			status: 200,
			message: 'Courses fetched successfully',
			course: data.responseObject,
		};
	} catch (error) {
		console.error('Error fetching courses:', error);
		return {
			status: 500,
			message: 'Failed to fetch courses',
			course: {
				courses: {
					courses: [],
					totalCount: 0,
				},
			},
		};
	}
}
