// import type { LessonProps } from '@/interfaces/sharetype';
// import type { CourseWithUserType } from '@/interfaces/sharetype';
// import { getPublicEnv } from '@/lib/env.server';
// import { Skeleton } from '@heroui/react';
// import { Suspense, lazy as reactLazy, useMemo } from 'react';
// import { type LoaderFunctionArgs, type Params, redirect, useLoaderData, useOutletContext } from 'react-router';
// import { useSearchParams } from 'react-router';
// import { LMSLayout } from '../components/learnify/LMSLayout';

// const Lesson = reactLazy(() => import('@/pages/learnify/learn/Lesson'));
// const Assignment = reactLazy(() => import('@/pages/learnify/learn/Assignment'));
// const Progress = reactLazy(() => import('@/pages/learnify/learn/Progress'));
// const People = reactLazy(() => import('@/pages/learnify/learn/People'));
// const Announcement = reactLazy(() => import('@/pages/learnify/learn/Announcement'));
// const Loading = reactLazy(() => import('../components/global/loading'));

// interface LoaderData {
// 	courseMenu: 'lesson' | 'assignment' | 'progress' | 'people' | 'announcement';
// 	lesson: LessonProps[];
// 	course: CourseWithUserType;
// }

// async function Courseloader({
// 	params,
// 	request,
// }: { params: Params<string>; request: Request }): Promise<{ course: CourseWithUserType }> {
// 	const env = getPublicEnv();
// 	try {
// 		const courseId = params.course_id;
// 		if (!courseId) {
// 			throw new Error('Course ID is missing');
// 		}

// 		const response = await fetch(`${env.BACKEND_URL}/api/courses/${courseId}`, {
// 			method: 'GET',
// 			headers: {
// 				accept: 'application/json',
// 			},
// 		});

// 		if (!response.ok) {
// 			throw new Error(`Failed to fetch course: ${response.status} ${response.statusText}`);
// 		}

// 		const course = await response.json();
// 		return { course };
// 	} catch (error) {
// 		console.error('Error in Courseloader:', error);
// 		throw new Response('Failed to load course data', { status: 500 });
// 	}
// }

// export async function loader({ params, request }: LoaderFunctionArgs): Promise<Response | LoaderData> {
// 	if (!params.menu || !['lesson', 'assignment', 'progress', 'people', 'announcement'].includes(params.menu)) {
// 		return redirect(`/courses/${params.course_id}/learn/lesson`);
// 	}

// 	try {
// 		const courseData = await Courseloader({ params, request });

// 		const LessonInCourse: LessonProps[] = []; // Replace with actual lesson fetching logic

// 		const courseMenu = params.menu as LoaderData['courseMenu'];

// 		return {
// 			courseMenu: courseMenu,
// 			lesson: LessonInCourse,
// 			course: courseData.course,
// 		};
// 	} catch (error) {
// 		console.error('Error in loader:', error);
// 		return new Response('Failed to load data', { status: 500 });
// 	}
// }

// export default function Course() {
// 	const [searchParams, setSearchParams] = useSearchParams();
// 	const { courseMenu, lesson, course } = useLoaderData<LoaderData>() as LoaderData;

// 	const tab = searchParams.get('tab') || 'Lesson';
// 	const Fallback = () => (
// 		<Skeleton className='w-full h-full'>
// 			<Loading />
// 		</Skeleton>
// 	);

// 	const handleTabChange = (newTab: string) => {
// 		setSearchParams({ tab: newTab });
// 	};

// 	return (
// 		<LMSLayout
// 			breadcrumbs={['All courses', `${course.name}`]}
// 			tabs={['Lesson', 'Assignment', 'Progress', 'People', 'Announcement']}
// 			selectedTab={tab}
// 			onTabChange={handleTabChange}
// 		>
// 			<div className='h-full'>
// 				{(() => {
// 					switch (tab) {
// 						case 'Lesson':
// 							return (
// 								<Suspense fallback={<Fallback />}>
// 									<Lesson lessons={lesson} />
// 								</Suspense>
// 							);
// 						case 'Assignment':
// 							return (
// 								<Suspense fallback={<Fallback />}>
// 									<Assignment />
// 								</Suspense>
// 							);
// 						case 'Progress':
// 							return (
// 								<Suspense fallback={<Fallback />}>
// 									<Progress />
// 								</Suspense>
// 							);
// 						case 'People':
// 							return (
// 								<Suspense fallback={<Fallback />}>
// 									<People />
// 								</Suspense>
// 							);
// 						case 'Announcement':
// 							return (
// 								<Suspense fallback={<Fallback />}>
// 									<Announcement />
// 								</Suspense>
// 							);
// 						default:
// 							return <Fallback />;
// 					}
// 				})()}
// 			</div>
// 		</LMSLayout>
// 	);
// }
