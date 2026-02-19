import { ContentLayout, type TabItem } from '@/components/admin/ContentLayout';
import type { UserTypes } from '@/interfaces/sharetype';
import { type UserRole, UserRoleSchema } from '@shared/types/users/user.model';
import React, { Suspense, lazy as reactLazy, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useLoaderData, useOutletContext, useRevalidator } from 'react-router';

function StableTabContent({
	Component,
	users,
	tabKey,
}: {
	Component: React.ComponentType<{ users: UserTypes[] }>;
	users: UserTypes[];
	tabKey: string;
}) {
	const content = React.useMemo(() => {
		return (
			<Suspense fallback={<div>Loading...</div>}>
				<Component users={users} />
			</Suspense>
		);
	}, [Component, users]);

	return <div data-tab={tabKey}>{content}</div>;
}

const InstructorTable = reactLazy(() => import('@/components/admin/users/instructor'));
const AdminTable = reactLazy(() => import('@/components/admin/users/admin'));
const LearnerTable = reactLazy(() => import('@/components/admin/users/learner'));

export default function AdminUserManagement() {
	const initialLoadDoneRef = useRef(false);

	const revalidator = useRevalidator();
	const { mgmtMenu, users: initialUsers } = useLoaderData() as { mgmtMenu: string; users: UserTypes[] };

	const [users, setUsers] = useState<UserTypes[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [refreshing, setRefreshing] = useState(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (initialLoadDoneRef.current) return;

		if (initialUsers && Array.isArray(initialUsers)) {
			setUsers(initialUsers);
			setIsLoading(false);
			initialLoadDoneRef.current = true;
		}
	}, []);

	const refreshUserData = useCallback(async () => {
		if (refreshing) return;

		try {
			setRefreshing(true);
			setIsLoading(true);

			setError(null);
		} catch (err) {
			console.error('Error refreshing data:', err);
			setError('Failed to refresh user data');
		} finally {
			setIsLoading(false);
			setTimeout(() => {
				setRefreshing(false);
			}, 1000);
		}
	}, [refreshing]);

	// แบ่งประเภทผู้ใช้ตามบทบาท
	const memoizedUsers = useMemo(() => {
		if (!users || !Array.isArray(users)) {
			return { learners: [], instructors: [], admins: [] };
		}

		const result = {
			learners: users.filter((user) => {
				const parsedRole = UserRoleSchema.safeParse(user?.user_role?.toString().toUpperCase());
				return parsedRole.success && parsedRole.data === 'LEARNER';
			}),
			instructors: users.filter((user) => {
				const parsedRole = UserRoleSchema.safeParse(user?.user_role?.toString().toUpperCase());
				return parsedRole.success && parsedRole.data === 'INSTRUCTOR';
			}),
			admins: users.filter((user) => {
				const parsedRole = UserRoleSchema.safeParse(user?.user_role?.toString().toUpperCase());
				return parsedRole.success && parsedRole.data === 'ANNOUNCER';
			}),
		};

		return result;
	}, [users]);

	// สร้าง tabs สำหรับแสดงผล
	const tabs: TabItem[] = useMemo(
		() => [
			{
				key: 'Learner',
				title: 'Learner',
				content: <StableTabContent Component={LearnerTable} users={memoizedUsers.learners} tabKey='learner' />,
			},
			{
				key: 'Instructor',
				title: 'Instructor',
				content: <StableTabContent Component={InstructorTable} users={memoizedUsers.instructors} tabKey='instructor' />,
			},
			{
				key: 'Admin',
				title: 'Admin',
				content: <StableTabContent Component={AdminTable} users={memoizedUsers.admins} tabKey='admin' />,
			},
		],
		[memoizedUsers],
	);

	// แสดง loading state ถ้ากำลังโหลดข้อมูล
	if (isLoading) {
		return (
			<div className='flex items-center justify-center h-64'>
				<svg
					className='animate-spin h-10 w-10 text-blue-500'
					xmlns='http://www.w3.org/2000/svg'
					fill='none'
					viewBox='0 0 24 24'
				>
					<title>Loading spinner</title>
					<circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
					<path
						className='opacity-75'
						fill='currentColor'
						d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
					/>
				</svg>
				<span className='ml-3 text-lg'>Loading users...</span>
			</div>
		);
	}

	// แสดงข้อผิดพลาดถ้ามี
	if (error && (!users || users.length === 0)) {
		return (
			<div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
				<p>{error}</p>
				<button
					type='button'
					onClick={refreshUserData}
					className='mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
				>
					Try Again
				</button>
			</div>
		);
	}

	// แสดงเนื้อหาหลัก
	return (
		<div key='admin-user-management-container'>
			<div className='flex justify-between items-center'>
				<h2 className='text-2xl font-bold px-6 pt-6'>User Management</h2>

				<div className='flex items-center'>
					{revalidator.state === 'loading' && (
						<span className='mr-4 text-sm text-gray-500 flex items-center'>
							<svg
								className='animate-spin h-4 w-4 mr-1'
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
							>
								<title>Loading spinner</title>
								<circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
								<path
									className='opacity-75'
									fill='currentColor'
									d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
								/>
							</svg>
							Updating...
						</span>
					)}

					{/* <button
            type='button'
            onClick={refreshUserData}
            disabled={revalidator.state === 'loading'}
            className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 flex items-center'
          >
            <svg 
              className='h-5 w-5 mr-2'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <title>Refresh icon</title>
              <path 
                strokeLinecap='round' 
                strokeLinejoin='round' 
                strokeWidth={2} 
                d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' 
              />
            </svg>
            Refresh
          </button> */}
				</div>
			</div>

			{/* แสดงผลตามสถานะของข้อมูล */}
			<ContentLayout tabs={tabs} />
		</div>
	);
}
