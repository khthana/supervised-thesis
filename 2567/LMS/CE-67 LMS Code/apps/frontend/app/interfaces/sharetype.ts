import type { Course } from '@shared/types/courses/course.model';
import { CourseCategorySchema, CourseSchema, CourseSubCategorySchema } from '@shared/types/courses/course.model';
import { CourseEnrollmentSchema } from '@shared/types/courses/courseEnrollment.model';
import { CourseCycleSchema, CycleAccessEmailSchema } from '@shared/types/courses/cycle.model';
import { LessonSchema } from '@shared/types/courses/lesson.model';
import { UserAvatarSchema } from '@shared/types/mediafile.model';
import { CourseCoverImageSchema } from '@shared/types/mediafile.model';
import { UserSchema } from '@shared/types/users/user.model';
import { z } from 'zod';

export type UserTypes = z.infer<typeof UserSchema>;
export type UserWithAvatarType = z.infer<typeof UserWithAvatarSchema>;

export type CourseWithUserType = z.infer<typeof CourseWithUserSchema>;
export type CourseWithCategories = z.infer<typeof CourseWithCategoriesSchema>;
export type CategoriesWithSubcategories = z.infer<typeof CategoriesWithSubcategoriesSchema>;
export type CourseCreateType = z.infer<typeof CourseCreateSchema>;
export type CourseWithAvatarType = z.infer<typeof CourseWithAvatarSchema>;

export type CourseCycleType = z.infer<typeof CourseCycleSchema>;

export type CycleWithLessonAndEnrollment = z.infer<typeof CycleWithLessonAndEnrollmentSchema>;

export type LessonType = z.infer<typeof LessonSchema>;

export const LessonOmitDateSchema = LessonSchema.omit({
	created_at: true,
	updated_at: true,
	cycle_id: true,
});

export const CourseCreateSchema = CourseSchema.omit({
	course_id: true,
	created_at: true,
	updated_at: true,
});

export const UserWithAvatarSchema = UserSchema.extend({
	avatar: UserAvatarSchema.optional(),
});

export const CourseWithUserSchema = CourseSchema.extend({
	users: UserWithAvatarSchema,
});

const CategoriesWithSubcategoriesSchema = z.array(
	CourseCategorySchema.extend({
		course_subcategories: z.array(CourseSubCategorySchema),
	}),
);

export const CourseWithAvatarSchema = CourseWithUserSchema.extend({
	avatar: CourseCoverImageSchema.optional(),
	intro_video: CourseCoverImageSchema.optional(),
});

const CourseWithCategoriesSchema = z.object({
	courses: z.object({
		courses: CourseWithAvatarSchema.array(),
		totalCount: z.number().int(),
	}),
	categories: CategoriesWithSubcategoriesSchema,
});

export const CycleWithLessonAndEnrollmentSchema = CourseCycleSchema.extend({
	cycle_access_emails: CycleAccessEmailSchema.array(),
	lessons: LessonSchema.array(),
	enrollment: CourseEnrollmentSchema.optional(),
});

export interface LessonProps {
	id: number;
	lessons: string;
	content?: contents[];
}

export interface contents {
	id: number;
	content: string;
	type: 'video' | 'file' | 'quiz' | 'assignment';
}

export interface CycleProps {
	id: number;
	name: string;
}

export interface Attachment {
	id: number;
	title: string;
	type: 'pdf' | 'docx' | 'link';
	url: string;
	description: string;
	size?: string;
}

export interface Subtopic {
	id: string;
	title: string;
	type: 'video' | 'file' | 'quiz' | 'assignment';
	videoUrl?: string;
	attachments?: Attachment[];
	quizContent?: string;
	assignmentContent?: {
		description: string;
		dueDate: string;
		maxScore: number;
		attachments?: Attachment[];
	};
}

export interface Topic {
	id: number;
	title: string;
	subtopics: Subtopic[];
}

// types/content.ts
export interface VideoUploadData {
	id: string;
	title: string;
	type: 'video';
	uploadType: string;
	videoUrl: string;
}

export interface FileUploadData {
	id: string;
	title: string;
	type: 'file';
	attachments: Attachment[];
}

export interface QuizData {
	code: string;
	image: string | null;
	selectedTest: number | null;
}

export interface AssignmentData {
	description: string;
	dueDate: string;
	maxScore: number;
	attachments?: Attachment[];
}

export interface Quiz {
	code: string;
	image: string | null;
	selectedTest: number | null;
}

export interface Assignment {
	description: string;
	dueDate: string;
	maxScore: number;
	attachments?: Attachment[];
}

export interface QuizScore {
	chapter: number;
	score: number;
	quiz: Quiz;
}

export interface AssignmentScore {
	assignmentId: number;
	score: number;
	assignment: Assignment;
}

export interface StudentGrades {
	id: number;
	studentId: string;
	name: string;
	quizScores: QuizScore[];
	assignmentScores: AssignmentScore[];
}

export interface ChartData {
	name: string;
	value: number;
}

export interface CourseContent {
	courses: Course[];
	totalCount: number;
}

export interface ApiResponse<T> {
	success: boolean;
	message: string;
	responseObject: T;
	statusCode: number;
}
