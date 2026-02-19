import { CourseCreateSchema, type CourseCreateType } from '@/schemas/createcourse';
import type { ICategory, ICourseDB, ISubCategory } from '~/app/interfaces/course';

class CourseService {
	async getCategories(): Promise<ICategory[]> {
		const response = await fetch('http://localhost:5000/api/courses/categories');

		if (!response.ok) {
			throw new Error(`Failed to load categories: ${response.statusText}`);
		}

		const categories = await response.json();
		return categories;
	}

	async getSubcategories(query: number): Promise<ISubCategory[]> {
		const response = await fetch(`http://localhost:5000/api/courses/categories/${query}/subcategories`);

		if (!response.ok) {
			throw new Error(`Failed to load suggestions: ${response.statusText}`);
		}

		const subcategories = await response.json();
		return subcategories;
	}

	async createCourse(course: CourseCreateType, accessToken: string): Promise<ICourseDB> {
		const response = await fetch('http://localhost:5000/api/courses', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify(course),
		});

		if (!response.ok) {
			const errorDetails = await response.json();
			console.error('Response error details:', errorDetails);
			throw new Error(`Failed to create course: ${response.statusText}`);
		}
		if (response.status === 400) {
			console.log('courseservice bad', response.json());
			return response.json();
		}
		// console.log('courseservice1', response.text());
		return response.json();
	}

	async getCourses(): Promise<ICourseDB> {
		const response = await fetch('http://localhost:5000/api/courses');

		if (!response.ok) {
			throw new Error(`Failed to load courses: ${response.statusText}`);
		}

		const courses = await response.json();
		return courses;
	}
}

export const courseService = new CourseService();
