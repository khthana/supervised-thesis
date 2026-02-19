import { LMSLayout } from '@/components/learnify/LMSLayout';
import type { ApiResponse, CourseContent } from '@/interfaces/sharetype';
import type { CourseWithCategories } from '@/interfaces/sharetype';
import userService from '@/server/api/user.server';
import { redirectWithToast } from '@/server/toaster.server';
import { getAccessToken } from '@/server/token.server';
import { Skeleton } from '@heroui/react';
import type { Course } from '@shared/types/courses/course.model';
import type { UserRole } from '@shared/types/users/user.model';
import { Suspense, lazy as reactLazy, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData, useOutletContext } from 'react-router';
import LoadingIcon from '../components/global/loading';
import type { CourseWithAvatarType } from '../interfaces/sharetype';
import { getPublicEnv } from '../lib/env.server';

const Learning = reactLazy(() => import('@/pages/learnify/mycourse/Learning'));
const Bookmarks = reactLazy(() => import('@/pages/learnify/mycourse/Bookmarks'));
const Enrolled = reactLazy(() => import('@/pages/learnify/mycourse/Enrolled'));
const Created = reactLazy(() => import('@/pages/learnify/mycourse/Created'));

const LoadingFallback = () => (
	<div className='flex items-center justify-center h-96'>
		<LoadingIcon />
	</div>
);

export async function loader({ request }: LoaderFunctionArgs): Promise<
	| ApiResponse<{
			courses: CourseWithAvatarType[];
			totalCount: number;
	  }>
	| Response
> {
	const env = getPublicEnv();
	const { accessToken } = await getAccessToken(request);
	console.log('accessToken', accessToken);
	try {
		const userData = await userService.getInfo(accessToken);

		if (!userData) {
			return redirectWithToast('/login', {
				type: 'error',
				message: 'Something went wrong. Please try again later.',
			});
		}

		const uID = userData.user_id;

		const res = await fetch(`${env.BACKEND_URL}/api/courses?createdBy=${uID}`);
		console.log(uID);
		const data = (await res.json()) as ApiResponse<CourseContent>;
		return {
			success: true,
			message: 'Success',
			statusCode: 200,
			responseObject: {
				courses: data.responseObject.courses as CourseWithAvatarType[],
				totalCount: data.responseObject.totalCount,
			},
		};
	} catch (error) {
		console.error('Error fetching user info:', error);
		return redirectWithToast('/login', {
			type: 'error',
			message: 'Something went wrong. Please try again later.',
		});
	}
}

export default function MyCourse() {
	const loaderData = useLoaderData<typeof loader>();
	// Extract the courses directly from the responseObject
	const coursesData = loaderData.responseObject.courses;

	const [searchParams] = useSearchParams();

	const [activeTab, setActiveTab] = useState(() => {
		return searchParams.get('tab') || 'Learning';
	});

	const handleTabChange = (newTab: string) => {
		if (activeTab !== newTab) {
			setActiveTab(newTab);
		}
	};

	const renderContent = useMemo(() => {
		const Fallback = () => <Skeleton className='w-full h-full' />;
		switch (activeTab) {
			case 'Learning':
				return (
					<Suspense fallback={<Fallback />}>
						<Learning />
					</Suspense>
				);
			case 'Bookmarks':
				return (
					<Suspense fallback={<Fallback />}>
						<Bookmarks />
					</Suspense>
				);
			case 'Enrolled':
				return (
					<Suspense fallback={<Fallback />}>
						<Enrolled />
					</Suspense>
				);
			case 'Created':
				return (
					<Suspense fallback={<Fallback />}>
						<Created courses={coursesData} />
					</Suspense>
				);
			default:
				return (
					<Suspense fallback={<Fallback />}>
						<Learning />
					</Suspense>
				);
		}
	}, [activeTab, coursesData]);

	return (
		<LMSLayout
			breadcrumbs={['All courses', 'My courses']}
			tabs={['Learning', 'Bookmarks', 'Enrolled', 'Created']}
			selectedTab={activeTab}
			onTabChange={handleTabChange}
		>
			{renderContent}
		</LMSLayout>
	);
}
