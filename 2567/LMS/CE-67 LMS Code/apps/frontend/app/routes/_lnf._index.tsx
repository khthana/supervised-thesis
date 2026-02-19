import { LearnifyLayout } from '@/components/learnify/Layout';
import Banner from '@/components/learnify/index/Banner';
import CourseCard from '@/components/learnify/index/CourseCard';
import FilterModal from '@/components/learnify/index/MobileFilter';
import Filterbar from '@/components/learnify/index/SidebarFilter';
import type { ApiResponse, CourseContent, CourseWithAvatarType, UserTypes } from '@/interfaces/sharetype';
import type { CourseWithCategories, UserWithAvatarType } from '@/interfaces/sharetype';
import { getPublicEnv } from '@/lib/env.server';
import { Button, Card, Modal, ModalContent, ModalHeader, Pagination, Spacer, useDisclosure } from '@heroui/react';
import { useCallback, useEffect, useState } from 'react';
import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData, useOutletContext } from 'react-router';
import { useFetcher } from 'react-router';
import type { ParentLoaderData } from './_lnf';

export async function loader({ request }: LoaderFunctionArgs): Promise<ApiResponse<CourseWithCategories>> {
	const env = getPublicEnv();

	try {
		const courseResponse = await fetch(`${env.BACKEND_URL}/api/courses?limit=12&offset=0`, {
			method: 'GET',
			headers: {
				accept: 'application/json',
			},
		});

		if (!courseResponse.ok) {
			console.error(`Failed to fetch courses: ${courseResponse.status} ${courseResponse.statusText}`);
			return {
				success: false,
				message: 'Failed to fetch courses',
				statusCode: courseResponse.status,
				responseObject: {
					courses: {
						courses: [],
						totalCount: 0,
					},
					categories: [],
				},
			};
		}

		const courses = await courseResponse.json();
		// console.log('courses', courses);
		// เรียก API categories
		const categoryResponse = await fetch(`${env.BACKEND_URL}/api/courses/categories`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (!categoryResponse.ok) {
			console.error(`Failed to fetch categories: ${categoryResponse.status} ${categoryResponse.statusText}`);
			return {
				success: false,
				message: 'Failed to fetch categories',
				statusCode: categoryResponse.status,
				responseObject: {
					courses: courses.responseObject,
					categories: [],
				},
			};
		}

		const categories = await categoryResponse.json();

		// ตรวจสอบว่ามีคอร์สหรือไม่
		let message = 'Fetched successfully';
		const courseArray = courses?.responseObject?.courses || [];

		if (Array.isArray(courseArray) && courseArray.length === 0) {
			message = 'No courses found';
		}

		// ส่งข้อมูลกลับไปให้ Frontend ในรูปแบบที่ถูกต้อง
		return {
			success: true,
			message,
			statusCode: 200,
			responseObject: {
				courses: courses.responseObject,
				categories: categories.responseObject,
			},
		};
	} catch (error) {
		console.error('Error in loader:', error);
		return {
			success: false,
			message: 'Failed to fetch courses',
			statusCode: 500,
			responseObject: {
				courses: {
					courses: [],
					totalCount: 0,
				},
				categories: [],
			},
		};
	}
}

export default function Index() {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const loaderData = useOutletContext<ParentLoaderData>();

	const data = useLoaderData<ApiResponse<CourseWithCategories>>();
	const user = loaderData.loaderData.user as UserWithAvatarType;

	const fetcher = useFetcher();

	const categories = data?.responseObject?.categories || [];
	const initialCourses = data?.responseObject?.courses?.courses || [];
	const totalCount = data?.responseObject?.courses?.totalCount || 0;

	const [currentCourses, setCurrentCourses] = useState<CourseWithAvatarType[]>(
		initialCourses as CourseWithAvatarType[],
	);
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalItems, setTotalItems] = useState(totalCount);

	const itemsPerPage = 12;
	const totalPages = Math.ceil(totalItems / itemsPerPage);

	const handlePageChange = (page: number) => {
		const offset = (page - 1) * itemsPerPage;
		const formData = new FormData();
		formData.append('offset', offset.toString());

		if (selectedCategory) {
			formData.append('categoryId', selectedCategory);
		}

		if (selectedSubCategories.length > 0) {
			for (const id of selectedSubCategories) {
				formData.append('subCategoryId', id);
			}
		}

		fetcher.submit(formData, { method: 'post', action: '/action/pagenate' });

		setCurrentPage(page);
	};

	useEffect(() => {
		if (fetcher.data && fetcher.data.status === 200 && fetcher.data.course) {
			const newCourses = fetcher.data.course.courses?.courses || [];
			setCurrentCourses(newCourses);

			const newTotalCount = fetcher.data.course.courses?.totalCount || 0;
			setTotalItems(newTotalCount);
		}
	}, [fetcher.data]);

	const handleApplyFilter = useCallback(
		(categoryId: string | null, subCategoryIds: string[]) => {
			setCurrentPage(1);

			setSelectedCategory(categoryId);
			setSelectedSubCategories(subCategoryIds);

			const formData = new FormData();
			formData.append('offset', '0');

			if (categoryId) {
				formData.append('category_id', categoryId);
			}

			if (subCategoryIds.length > 0) {
				for (const id of subCategoryIds) {
					formData.append('subcategory_id', id);
				}
			}

			fetcher.submit(formData, { method: 'post', action: '/action/pagenate' });
		},
		[fetcher],
	);

	const isLoading = fetcher.state === 'loading' || fetcher.state === 'submitting';

	return (
		<LearnifyLayout user={user}>
			<div className=' max-w-[2100px] min-w[1100px] mx-h-[740px] px-8 s:grid-cols-[1fr] grid xl:grid-rows-[auto_1fr] h-[100%] w-[100vw]'>
				{/* ---------------------------------------------------------- */}
				<div className='TopContent '>
					<Banner />
				</div>
				{/* ---------------------------------------------------------- */}

				<div className='CourseContent max-w-[2700px] grid lg:grid-cols-[1.5fr_2fr] xl:grid-cols-[1fr_5fr]'>
					<div className='Fillter hidden lg:block '>
						{categories && categories.length > 0 ? (
							<Filterbar categories={categories} onApplyFilter={handleApplyFilter} />
						) : (
							<div className='p-4 text-gray-500'>Loading categories...</div>
						)}
					</div>

					<Card className='Course w-[97%] my-6 mx-4'>
						<div className=' grid grid-cols-2'>
							<h1 className=' mx-12 my-8 flex items-center gap-2 sm:text-lg md:text-xl xl:text-2xl'>
								<b>
									{selectedCategory && categories.length > 0
										? `${categories.find((cat) => cat.category_id.toString() === selectedCategory)?.name || 'Selected'} Courses`
										: 'All Courses'}
								</b>
								<Button onPress={onOpen} color='primary' variant='light' className='lg:hidden'>
									Filter
								</Button>
								<Modal isOpen={isOpen} onClose={onOpenChange}>
									<ModalHeader>Filter</ModalHeader>
									<ModalContent>
										{() =>
											categories && categories.length > 0 ? (
												<FilterModal categories={categories} onApplyFilter={handleApplyFilter} />
											) : (
												<div className='p-4 text-center'>Loading categories...</div>
											)
										}
									</ModalContent>
								</Modal>
							</h1>
						</div>

						<div className='grid cols-start-2 mx-2'>
							{isLoading ? (
								<div className='col-span-full text-center py-10'>Loading courses...</div>
							) : (
								<div className={'grid justify-items-center text-black sm:grid-cols-2 xl:grid-cols-4'}>
									{currentCourses && currentCourses.length > 0 ? (
										currentCourses.map((items) => {
											return (
												<div key={items.course_id}>
													<CourseCard
														Course_name={items.name}
														Cat={'section'}
														Course_id={items.course_id}
														Url_img={items.avatar?.url}
													/>
													<Spacer y={12} x={8} />
												</div>
											);
										})
									) : (
										<div className='col-span-full text-center py-10'>No courses found matching your criteria</div>
									)}
								</div>
							)}
							<div className='flex justify-center p-5'>
								{totalPages > 0 && (
									<Pagination total={totalPages} page={currentPage} onChange={handlePageChange} color='primary' />
								)}
							</div>
						</div>
					</Card>
				</div>
			</div>
		</LearnifyLayout>
	);
}
