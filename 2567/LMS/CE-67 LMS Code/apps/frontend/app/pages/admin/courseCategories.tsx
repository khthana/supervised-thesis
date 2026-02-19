import { ContentLayout, type TabItem } from '@/components/admin/ContentLayout';
import LoadingIcon from '@/components/global/loading';
import type { UserTypes } from '@/interfaces/sharetype';
import { getPublicEnv } from '@/lib/env.client';
import type { CourseCategory } from '@shared/types/courses/course.model';
import React, { Suspense, lazy as reactLazy, useEffect, useState, useCallback, useMemo } from 'react';
import { useLoaderData } from 'react-router';

interface StableTabContentProps {
	Component: React.ComponentType<{
		catgories: CourseCategory[];
		mainCategories?: CourseCategory[];
	}>;
	catgories: CourseCategory[];
	mainCategories?: CourseCategory[];
	tabKey: string;
}

function StableTabContent({ Component, catgories, mainCategories, tabKey }: StableTabContentProps) {
	const content = React.useMemo(() => {
		return (
			<Suspense fallback={<div>Loading...</div>}>
				<Component catgories={catgories} mainCategories={mainCategories} />
			</Suspense>
		);
	}, [Component, catgories, mainCategories]);

	return <div data-tab={tabKey}>{content}</div>;
}

const MainTable = reactLazy(() => import('@/components/admin/category/maincat'));
const SubTable = reactLazy(() => import('@/components/admin/category/subcat'));

export async function fetchSubCategory() {
	try {
		const env = getPublicEnv();
		const response = await fetch(`${env.BACKEND_URL}/api/courses/categories/sub`);

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		const data = await response.json();
		console.log('API response:', data);

		if (data?.responseObject && Array.isArray(data.responseObject)) {
			// console.log('Sub Category fetched successfully:', data.responseObject);
			return data.responseObject;
		}
		console.error('Invalid data structure:', data);
		return [];
	} catch (error) {
		console.error('Failed to fetch sub category:', error);
		throw error;
	}
}

interface CategoryLoaderData {
	main: CourseCategory[];
	sub: CourseCategory[];
}

interface LoaderData {
	mgmtMenu: string;
	users: UserTypes[];
	categoris: {
		main: CourseCategory[];
		sub: CourseCategory[];
	};
}

export default function CourseCategories() {
	const loaderData = useLoaderData() as LoaderData;

	const mainCategories = loaderData?.categoris?.main || [];
	const subCategories = loaderData?.categoris?.sub || [];

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const tabs: TabItem[] = useMemo(
		() => [
			{
				key: 'Main Category',
				title: 'Main Category',
				content: <StableTabContent Component={MainTable} catgories={mainCategories} tabKey='Main' />,
			},
			{
				key: 'Sub Category',
				title: 'Sub Category',
				content: (
					<StableTabContent
						Component={SubTable}
						catgories={subCategories}
						mainCategories={mainCategories} // Pass main categories to SubTable
						tabKey='Sub'
					/>
				),
			},
		],
		[mainCategories, subCategories],
	);

	const refreshCategoryData = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			const env = getPublicEnv();

			const mainResponse = await fetch(`${env.BACKEND_URL}/api/courses/categories/main`);
			if (!mainResponse.ok) {
				throw new Error(`Failed to fetch main categories: ${mainResponse.status}`);
			}

			const subResponse = await fetch(`${env.BACKEND_URL}/api/courses/categories/sub`);
			if (!subResponse.ok) {
				throw new Error(`Failed to fetch sub categories: ${subResponse.status}`);
			}

			window.location.reload();
		} catch (error) {
			console.error('Error refreshing category data:', error);
			setError(error instanceof Error ? error.message : 'Failed to refresh categories');
		} finally {
			setIsLoading(false);
		}
	}, []);

	if (isLoading) {
		return (
			<div className='flex justify-center items-center h-48'>
				<LoadingIcon />
			</div>
		);
	}

	if (error) {
		return (
			<div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
				<p>{error}</p>
				<button
					type='button'
					onClick={refreshCategoryData}
					className='mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
				>
					Try Again
				</button>
			</div>
		);
	}

	return (
		<div key='admin-category-management-container'>
			<div className='flex justify-between items-center'>
				<h2 className='text-2xl font-bold px-6 pt-6'>Categories Management</h2>

				<div className='flex items-center'>
					{isLoading && (
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
						onClick={refreshCategoryData}
						disabled={isLoading}
						className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 flex items-center mr-6'
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

			<ContentLayout tabs={tabs} />
		</div>
	);
}
