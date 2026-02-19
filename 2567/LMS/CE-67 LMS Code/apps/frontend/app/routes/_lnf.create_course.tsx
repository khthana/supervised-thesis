import RichTextEditor from '@/components/learnify/texteditor';
import { Button, Card, CardBody, CardHeader, Input, Select, SelectItem } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { z } from 'zod';
import 'react-toastify/dist/ReactToastify.css';
import type { ApiResponse, CategoriesWithSubcategories } from '@/interfaces/sharetype';
import { getPublicEnv } from '@/lib/env.server';
import { CourseCreateSchema, type CourseCreateType } from '@/schemas/createcourse';
import type { CourseSubCategory } from '@shared/types/courses/course.model';
import { useFetcher, useLoaderData, useNavigate } from 'react-router';

export async function loader() {
	try {
		const env = getPublicEnv();
		const res = await fetch(`${env.BACKEND_URL}/api/courses/categories`);
		const data = await res.json();
		return data as ApiResponse<CategoriesWithSubcategories>;
	} catch (error) {
		console.error('Error loading categories:', error);
		return {
			success: false,
			statusCode: 500,
			status: 'error',
			message: 'Failed to load categories',
			responseObject: [] as CategoriesWithSubcategories,
		} as ApiResponse<CategoriesWithSubcategories>;
	}
}

const CreateCourseForm = () => {
	const navigate = useNavigate();
	const fetcher = useFetcher();
	const data = useLoaderData<ApiResponse<CategoriesWithSubcategories>>();
	const categories = data.responseObject || [];

	const [loading, setLoading] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
	const [subCategories, setSubCategories] = useState<CourseSubCategory[]>([]);
	const [isDebugMode, setIsDebugMode] = useState(false);

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
		watch,
		reset,
	} = useForm<CourseCreateType>({
		resolver: zodResolver(CourseCreateSchema),
		defaultValues: {
			name: '',
			subject_id: '',
			description: '',
			course_language: 'th',
			category_id: undefined,
			subcategory_id: undefined,
		},
	});

	const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const categoryId = Number(e.target.value);
		setSelectedCategory(categoryId);

		const category = categories.find((cat) => cat.category_id === categoryId);
		if (category) {
			setSubCategories(category.course_subcategories);
		} else {
			setSubCategories([]);
		}
	};

	useEffect(() => {
		if (Object.keys(errors).length > 0) {
			console.log('Form validation errors:', errors);
		}
	}, [errors]);

	useEffect(() => {
		if (fetcher.state === 'idle' && fetcher.data) {
			console.log('Fetcher response:', fetcher.data);
			if (fetcher.data.success) {
				toast.success('Course created successfully!', {
					position: 'top-right',
					autoClose: 1500,
				});
			} else {
				toast.error(`Failed to create course: ${fetcher.data.message || 'Unknown error'}`, {
					position: 'top-right',
					autoClose: 3000,
				});
			}
		}
	}, [fetcher.state, fetcher.data]);

	const onSubmit = async (formData: CourseCreateType) => {
		setLoading(true);

		try {
			const submitData = new FormData();

			submitData.append('name', formData.name);

			if (formData.description) {
				const descriptionValue =
					typeof formData.description === 'object' ? JSON.stringify(formData.description) : formData.description;

				submitData.append('description', descriptionValue);
				console.log('Description processed:', descriptionValue);
			}

			if (formData.subject_id) submitData.append('subject_id', formData.subject_id);
			if (formData.course_language) submitData.append('course_language', formData.course_language);

			if (formData.category_id !== undefined) {
				submitData.append('category_id', String(formData.category_id));
			}

			if (formData.subcategory_id !== undefined) {
				submitData.append('subcategory_id', String(formData.subcategory_id));
			}

			console.log('Submitting form data:');
			for (const [key, value] of submitData.entries()) {
				console.log(`${key}: ${value instanceof File ? `File: ${value.name}` : value}`);
			}

			fetcher.submit(submitData, {
				method: 'post',
				encType: 'multipart/form-data',
				action: '/action/course/create',
			});

			toast.info('Submitting form...', {
				position: 'top-right',
				autoClose: 1500,
			});
		} catch (error) {
			console.error('Error in form submission:', error);
			toast.error(`Error: ${error instanceof Error ? error.message : String(error)}`, {
				position: 'top-right',
				autoClose: 3000,
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.ctrlKey && e.shiftKey && e.key === 'D') {
				setIsDebugMode((prev) => !prev);
				toast.info(`Debug mode ${!isDebugMode ? 'enabled' : 'disabled'}`, {
					position: 'bottom-right',
					autoClose: 1000,
				});
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [isDebugMode]);

	return (
		<>
			<Card className='w-full max-w-6xl mx-auto shadow-lg'>
				<CardHeader className='px-8 pt-6 border-b'>
					<h1 className='text-3xl font-bold text-center'>Create My Course</h1>
				</CardHeader>
				<CardBody className='px-8 py-6'>
					<form
						className='space-y-4'
						onSubmit={(e) => {
							e.preventDefault(); // ป้องกันการรีเฟรชหน้า
							console.log('Form submitted manually');

							handleSubmit(
								(data) => {
									console.log('Form validated successfully!', data);
									onSubmit(data);
								},
								(validationErrors) => {
									console.error('Validation errors:', validationErrors);
									const errorList = Object.entries(validationErrors)
										.map(([field, error]) => `${field}: ${error.message}`)
										.join(', ');
									toast.error(`Please fix the following errors: ${errorList}`, {
										position: 'top-right',
										autoClose: 3000,
									});
								},
							)(e); // ส่ง event เข้าไป
						}}
					>
						<div className='grid gap-6' style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
							<div>
								<p className='mb-2 w-fit'>Course Name</p>
								<Controller
									name='name'
									control={control}
									render={({ field }) => (
										<Input
											placeholder='Enter course name in English'
											{...field}
											errorMessage={errors.name?.message}
											size='lg'
										/>
									)}
								/>
							</div>

							<div>
								<p className='mb-2'>Subject ID</p>
								<Controller
									name='subject_id'
									control={control}
									render={({ field }) => (
										<Input
											placeholder='Enter subject ID'
											{...field}
											errorMessage={errors.subject_id?.message}
											size='lg'
										/>
									)}
								/>
							</div>

							<div>
								<p className='mb-2'>Course Language</p>
								<Controller
									name='course_language'
									control={control}
									render={({ field }) => (
										<Select
											className=''
											size='lg'
											placeholder='Select Language'
											aria-label='Course Language'
											defaultSelectedKeys={['th']}
											onChange={(e) => field.onChange(e.target.value)}
										>
											<SelectItem key='th' value='th'>
												Thai
											</SelectItem>
											<SelectItem key='en' value='en'>
												English
											</SelectItem>
										</Select>
									)}
								/>
							</div>
						</div>

						<div>
							<label htmlFor='description' className='block mb-2 font-medium'>
								Description
							</label>
							<Controller
								name='description'
								control={control}
								render={({ field }) => (
									<RichTextEditor
										onChange={(value) => {
											console.log('RichTextEditor value updated:', value);
											try {
												field.onChange(JSON.stringify(value));
											} catch (error) {
												console.error('Error converting rich text to JSON:', error);
												field.onChange(value);
											}
										}}
										value={
											field.value
												? typeof field.value === 'string'
													? (() => {
															try {
																return JSON.parse(field.value);
															} catch (e) {
																console.error('Error parsing description:', e);
																return undefined;
															}
														})()
													: field.value
												: undefined
										}
									/>
								)}
							/>
							{errors.description?.message && (
								<p className='mt-1 text-sm text-red-600'>
									{typeof errors.description?.message === 'string' ? errors.description.message : ''}
								</p>
							)}
						</div>

						{/* Categories Selection */}
						<div className='grid grid-cols-2 md:grid-cols-2 gap-4'>
							{/* Main Category Field */}
							<div>
								<p className='mb-2'>Main Category</p>
								<Controller
									name='category_id'
									control={control}
									render={({ field }) => (
										<Select
											size='lg'
											placeholder='Select main category'
											aria-label='Main Category'
											onChange={(e) => {
												field.onChange(Number(e.target.value));
												handleCategoryChange(e);
											}}
										>
											{categories && categories.length > 0 ? (
												categories.map((category) => (
													<SelectItem key={category.category_id} value={category.category_id}>
														{category.name}
													</SelectItem>
												))
											) : (
												<SelectItem isDisabled value=''>
													No categories available
												</SelectItem>
											)}
										</Select>
									)}
								/>
								{errors.category_id?.message && (
									<p className='mt-1 text-sm text-red-600'>{errors.category_id?.message}</p>
								)}
							</div>

							{/* Sub Category Field */}
							<div className=''>
								<p className='mb-2'>Sub Category</p>
								<Controller
									name='subcategory_id'
									control={control}
									render={({ field }) => (
										<Select
											size='lg'
											placeholder='Select sub category'
											aria-label='Sub Category'
											onChange={(e) => field.onChange(Number(e.target.value))}
											isDisabled={!selectedCategory || subCategories.length === 0}
										>
											{subCategories.length > 0 ? (
												subCategories.map((subCategory) => (
													<SelectItem key={subCategory.subcategory_id} value={subCategory.subcategory_id}>
														{subCategory.name}
													</SelectItem>
												))
											) : (
												<SelectItem isDisabled value=''>
													{selectedCategory ? 'No subcategories available' : 'Please select a category first'}
												</SelectItem>
											)}
										</Select>
									)}
								/>
								{errors.subcategory_id?.message && (
									<p className='mt-1 text-sm text-red-600'>{errors.subcategory_id?.message}</p>
								)}
							</div>
						</div>

						<div className='text-center mt-6'>
							<button
								type='submit'
								className='bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded'
								disabled={loading || isSubmitting}
							>
								{loading || isSubmitting ? 'Creating Course...' : 'Create Course'}
							</button>
						</div>
					</form>
				</CardBody>
			</Card>
			<ToastContainer />
		</>
	);
};

export default CreateCourseForm;
