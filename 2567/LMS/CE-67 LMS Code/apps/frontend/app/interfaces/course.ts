export interface ICourse {
	id: number;
	name: {
		en: string;
		th: string;
	};
	description: string;
	intro_video: string;
	cover_image: string;
	language: string;
	type: string;
	creator_id: number;
}

export interface ICourses {
	id: number;
	subject_id: number | null;
	name: string;
	description: string;
	keywords: string[];
	intro_video: string;
	cover_image: string;
	language: string;
	type: string;
	creator_id: number;
	created_at: string;
	updated_at: string;
}

export interface ICourseDB {
	courses: {
		id: number;
		subject_id: number | null;
		name: string;
		description: string;
		keywords: string[];
		intro_video: string;
		cover_image: string;
		language: string;
		type: string;
		creator_id: number;
		created_at: string;
		updated_at: string;
	}[];
	totalCount: number;
}

export interface ICourseCreate {
	name: string;
	description: string;
	keywords: string[];
	intro_video: string;
	cover_image: string;
	language: string;
	type: string;
	creator_id: number;
	categories: {
		main: string;
		sub: string;
	};
	instructors: number[];
}

export interface ICategory {
	id: number;
	name: {
		en: string;
		th: string;
	};
	description: {
		en: string;
		th: string;
	};
}

export interface ISubCategory {
	id: number;
	name: {
		en: string;
		th: string;
	};
	category_id: number;
}
