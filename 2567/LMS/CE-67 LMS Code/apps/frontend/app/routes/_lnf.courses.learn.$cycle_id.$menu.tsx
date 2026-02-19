import type { LessonProps } from '@/interfaces/sharetype';
import type { CycleWithLessonAndEnrollment } from '@/interfaces/sharetype';
import { getPublicEnv } from '@/lib/env.server';
import { commitSession, getSession } from '@/server/sessions/learnify.server';
import { Skeleton } from '@heroui/react';
import { Suspense, lazy as reactLazy } from 'react';
import { type LoaderFunctionArgs, redirect, useLoaderData, useParams } from 'react-router';
import { useSearchParams } from 'react-router';
import { LMSLayout } from '../components/learnify/LMSLayout';

const Lesson = reactLazy(() => import('@/pages/learnify/learn/Lesson'));
const Assignment = reactLazy(() => import('@/pages/learnify/learn/Assignment'));
const Progress = reactLazy(() => import('@/pages/learnify/learn/Progress'));
const People = reactLazy(() => import('@/pages/learnify/learn/People'));
const Announcement = reactLazy(() => import('@/pages/learnify/learn/Announcement'));
const Loading = reactLazy(() => import('../components/global/loading'));

interface LoaderData {
	courseMenu: 'lesson' | 'assignment' | 'progress' | 'people' | 'announcement';
	lesson: LessonProps[];
	cycle: CycleWithLessonAndEnrollment;
}

export async function loader({ params, request }: LoaderFunctionArgs): Promise<Response | LoaderData> {
	// ดึงค่า pathname จาก URL เพื่อตรวจสอบว่ามีส่วนของ menu หรือไม่
	const url = new URL(request.url);
	const pathSegments = url.pathname.split('/').filter(Boolean);

	// ตรวจสอบค่า cycle_id
	let cycle_id = params.cycle_id;
	// console.log('cycle_id#1', cycle_id);
	if (!cycle_id) {
		console.error('cycle_id is missing in the URL');
		cycle_id = pathSegments[2];
		console.log('cycle_id#2', cycle_id);
		if (!cycle_id) {
			throw new Response('Cycle ID is missing', { status: 500 });
		}
	}

	// console.log('cycle');

	try {
		// จัดการ authentication token
		const env = getPublicEnv();
		const session = await getSession(request.headers.get('Cookie'));
		let accessToken = session.get('accessToken');
		const refreshToken = session.get('refreshToken');

		if (!accessToken) {
			try {
				const renew = await fetch(`${env.BACKEND_URL}/api/auth/renew`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						refreshToken: refreshToken,
					}),
				});

				if (!renew.ok) {
					throw new Error(`Failed to renew access token: ${renew.status} ${renew.statusText}`);
				}

				const newTokenData = await renew.json();
				accessToken = newTokenData.accessToken;
				session.set('accessToken', accessToken);
				await commitSession(session);
			} catch (error) {
				console.error('Error renewing token:', error);
				throw new Response('Authentication failed', { status: 401 });
			}
		}

		if (!accessToken) {
			throw new Response('No authentication token available', { status: 401 });
		}

		// ดึงข้อมูล cycle
		const response = await fetch(`${env.BACKEND_URL}/api/courses/cycles/${cycle_id}`, {
			method: 'GET',
			headers: {
				accept: 'application/json',
				Authorization: `Bearer ${accessToken}`,
			},
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch course: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		const cycle = data.responseObject as CycleWithLessonAndEnrollment;
		// console.log('cycle', cycle);
		// สร้าง dummy lessons (หรือสามารถดึงข้อมูล lessons จริงได้ที่นี่)
		const LessonInCourse: LessonProps[] = [];

		// ตรวจสอบว่ามีส่วนของ menu หรือไม่ (segment สุดท้าย)
		const lastSegment = pathSegments[pathSegments.length - 1];
		const validMenus = ['lesson', 'assignment', 'progress', 'people', 'announcement'];

		// ตรวจสอบว่า segment สุดท้ายเป็น menu ที่ถูกต้องหรือไม่
		const menu = validMenus.includes(lastSegment) ? lastSegment : null;

		// กรณีไม่มี menu หรือ menu ไม่ถูกต้อง ให้ redirect ไปที่ /lesson
		if (!menu) {
			return redirect(`/courses/learn/${params.cycle_id}/lesson`);
		}

		return {
			courseMenu: menu as LoaderData['courseMenu'],
			lesson: LessonInCourse,
			cycle: cycle,
		};
	} catch (error) {
		console.error('Error in loader:', error);
		return new Response('Failed to load data', { status: 500 });
	}
}

export default function Course() {
	const params = useParams();
	const [searchParams, setSearchParams] = useSearchParams();
	const { courseMenu, lesson, cycle } = useLoaderData<LoaderData>() as LoaderData;
	// console.log('cycle', cycle);
	// หา tab จาก URL path แทนการใช้ searchParams
	let tab = courseMenu;
	if (tab) {
		// แปลงตัวอักษรแรกให้เป็นตัวใหญ่
		tab = tab.charAt(0).toUpperCase() + tab.slice(1);
	} else {
		tab = 'lesson';
	}

	const Fallback = () => (
		<div className='w-full h-full'>
			<Loading />
		</div>
	);

	const handleTabChange = (newTab: string) => {
		// เปลี่ยนเส้นทางแทนการใช้ searchParams
		window.location.href = `/courses/learn/${params.cycle_id}/${newTab.toLowerCase()}`;
	};

	// ตรวจสอบว่า cycle มีค่าหรือไม่ก่อนใช้งาน
	if (!cycle) {
		return (
			<div className='p-4'>
				<p>Loading cycle data...</p>
			</div>
		);
	}

	return (
		<LMSLayout
			breadcrumbs={['All courses', cycle?.name]}
			tabs={['Lesson', 'Assignment', 'Progress', 'People', 'Announcement']}
			selectedTab={tab}
			onTabChange={handleTabChange}
		>
			<div className='h-full'>
				{(() => {
					switch (tab) {
						case 'Lesson':
							return (
								<Suspense fallback={<Fallback />}>
									<Lesson />
								</Suspense>
							);
						case 'Assignment':
							return (
								<Suspense fallback={<Fallback />}>
									<Assignment />
								</Suspense>
							);
						case 'Progress':
							return (
								<Suspense fallback={<Fallback />}>
									<Progress />
								</Suspense>
							);
						case 'People':
							return (
								<Suspense fallback={<Fallback />}>
									<People />
								</Suspense>
							);
						case 'Announcement':
							return (
								<Suspense fallback={<Fallback />}>
									<Announcement />
								</Suspense>
							);
						default:
							return <Fallback />;
					}
				})()}
			</div>
		</LMSLayout>
	);
}
