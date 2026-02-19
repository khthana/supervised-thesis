import { Skeleton } from '@heroui/skeleton';
import type { CourseCategory, CourseSubCategory } from '@shared/types/courses/course.model';
import { Suspense, lazy as reactLazy, useMemo } from 'react';
import { Await, useLoaderData, useOutletContext } from 'react-router';
import { type LoaderFunctionArgs, redirect } from 'react-router';
import { AdminLayout } from '../components/admin/Layout';
import { useWindowDimensions } from '../hooks/winindowDimensions';
import type { ApiResponse, UserTypes } from '../interfaces/sharetype';
import { getPublicEnv } from '../lib/env.server';
import MobileRestrict from '../pages/admin/mobileRestrict';
import type { ParentLoaderData as AdmLoaderData } from './_adm';

// ใช้ React.lazy เพื่อโหลดคอมโพเนนต์แบบ dynamic
const AdminDashboard = reactLazy(() => import('../pages/admin/dashboard'));
const Courses = reactLazy(() => import('../pages/admin/mobileRestrict'));
const Users = reactLazy(() => import('../pages/admin/users'));
const CourseCategories = reactLazy(() => import('../pages/admin/courseCategories'));
const ManageUser = reactLazy(() => import('../pages/admin/usermanage'));
const Loading = reactLazy(() => import('../components/global/loading'));

interface LocalLoaderData {
	mgmtMenu: string;
	users: UserTypes[];
	categoris: {
		main: CourseCategory[];
		sub: CourseSubCategory[];
	};
}

export async function loader({ request, params }: LoaderFunctionArgs): Promise<Response | LocalLoaderData> {
	const userRequestMenu = params.menu as string;
	const validMenus = ['dashboard', 'courses', 'users', 'learning_categories', 'usermanage'];
	// const mgmtMenu = validMenus.includes(userRequestMenu) ? userRequestMenu : 'dashboard';
	const mgmtMenu = validMenus.includes(userRequestMenu) ? userRequestMenu : 'users';
	let users: UserTypes[] = [];
	let main: CourseCategory[] = [];
	let sub: CourseSubCategory[] = [];

	const env = getPublicEnv();

	if (mgmtMenu === 'users') {
		try {
			const env = getPublicEnv();
			// console.log('🚀 Fetching users API from loader, URL:', `${env.BACKEND_URL}/api/users`);

			const response = await fetch(`${env.BACKEND_URL}/api/users`, {
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) {
				console.error('⚠️ API Error:', response.status, response.statusText);
				throw new Error(`Failed to fetch users: ${response.status}`);
			}

			const data = await response.json();
			// console.log('📊 API response structure:', Object.keys(data));

			if (!data.responseObject || !data.responseObject.users) {
				console.error('⚠️ Invalid API response format:', data);
				throw new Error('Invalid API response format');
			}

			users = data.responseObject.users;
			// console.log('✅ Users loaded successfully, count:', users);
		} catch (error) {
			console.error('❌ Error fetching users:', error);
		}
	}

	if (mgmtMenu === 'learning_categories') {
		try {
			const response = await fetch(`${env.BACKEND_URL}/api/courses/categories/main`);
			const data = await response.json();
			main = data.responseObject;

			if (data?.responseObject && Array.isArray(data.responseObject)) {
				// console.log('Main Category fetched successfully:', data.responseObject);
			}
		} catch (error) {
			console.error('Failed to fetch category:', error);
			throw error;
		}

		try {
			const response = await fetch(`${env.BACKEND_URL}/api/courses/categories/sub`);
			const data = await response.json();
			sub = data.responseObject;
			// if (data?.responseObject && Array.isArray(data.responseObject)) {
			// 	console.log('Sub Category fetched successfully:', data.responseObject);
			// }
		} catch (error) {
			console.error('Failed to fetch sub category:', error);
			throw error;
		}
	}

	if (mgmtMenu !== userRequestMenu) {
		return redirect(`/management/${mgmtMenu}`);
	}

	return {
		mgmtMenu,
		users: users,
		categoris: {
			main: main,
			sub: sub,
		},
	};
}

export default function AdminPanel() {
	const { mgmtMenu } = useLoaderData<LocalLoaderData>();
	const { loaderData } = useOutletContext<{ loaderData: AdmLoaderData }>();
	const userData = loaderData.user as UserTypes;
	const user = userData as UserTypes;
	const { height, width } = useWindowDimensions();

	if (!loaderData) {
		return <Loading />;
	}

	if (!user) {
		return <MobileRestrict />;
	}

	const renderContent = useMemo(() => {
		const Fallback = () => <Skeleton className='w-full h-full' />;

		switch (mgmtMenu) {
			case 'dashboard':
				return (
					<Suspense fallback={<Fallback />}>
						<AdminDashboard />
					</Suspense>
				);
			case 'courses':
				return (
					<Suspense fallback={<Fallback />}>
						<Courses />
					</Suspense>
				);
			case 'users':
				return (
					<Suspense fallback={<Fallback />}>
						<Users />
					</Suspense>
				);
			case 'learning_categories':
				return (
					<Suspense fallback={<Fallback />}>
						<CourseCategories />
					</Suspense>
				);
			case 'usermanage':
				return (
					<Suspense fallback={<Fallback />}>
						<ManageUser />
					</Suspense>
				);
			default:
				return <Fallback />;
		}
	}, [mgmtMenu]);

	if ((width && width < 1024) || (height && height < 600)) {
		console.log('Window dimensions:', { width, height });
		return <MobileRestrict />;
	}

	return <AdminLayout user={user}>{renderContent}</AdminLayout>;
}
