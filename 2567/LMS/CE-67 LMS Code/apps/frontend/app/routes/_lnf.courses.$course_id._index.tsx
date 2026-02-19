import SlateContentViewer from '@/components/learnify/SlatConverter';
import RichTextEditor from '@/components/learnify/texteditor';
import type { ParentLoaderData } from '@/routes/_lnf';
import {
	Button,
	Card,
	CardHeader,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Select,
	SelectItem,
	Spacer,
} from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { LoaderFunctionArgs } from 'react-router';
import { useFetcher, useLoaderData, useNavigate, useOutletContext } from 'react-router';
import type { Descendant } from 'slate';
import { z } from 'zod';
import { LMSLayout } from '../components/learnify/LMSLayout';
import type {
	ApiResponse,
	CategoriesWithSubcategories,
	CourseCycleType,
	CourseWithAvatarType,
} from '../interfaces/sharetype';

export async function loader({ request, params }: LoaderFunctionArgs) {
	const course_id = params.course_id;
	const getPublicEnv = await import('@/lib/env.server').then((mod) => mod.getPublicEnv);
	const env = getPublicEnv();
	const { getAccessToken } = await import('@/server/token.server');
	const userServiceModule = await import('@/server/api/user.server');

	try {
		// const response = await fetch(`${env.BACKEND_URL}/api/courses?id=${course_id}`);
		const response = await fetch(`${env.BACKEND_URL}/api/courses/${course_id}`);

		if (!response.ok) {
			console.error(`Failed to fetch course: ${response.status} ${response.statusText}`);
			return { status: response.status, message: 'Course not found' };
		}

		const Data = await response.json();
		const course = Data.responseObject as CourseWithAvatarType;
		// const course = Data as CourseWithUserType;
		// console.log('Course:', course);
		const { accessToken, status } = await getAccessToken(request);
		console.log('Access Token:', accessToken);
		if (status !== 200 && status !== 401) {
			return {
				status: status,
				message: 'Unauthorized',
				course: course,
				isMyCourse: false,
				categories: [],
			};
		}

		const res = await fetch(`${env.BACKEND_URL}/api/courses/categories`);

		if (!res.ok) {
			console.error(`Failed to fetch categories: ${res.status} ${res.statusText}`);
			return {
				status: res.status,
				message: 'Failed to fetch categories',
				course: course,
				isMyCourse: false,
				categories: [],
			};
		}

		const categoriesData = await res.json();
		// console.log('Categories:', categoriesData.responseObject);

		const user = await userServiceModule.default.getInfo(accessToken);

		if (course.created_by === user?.user_id) {
			return {
				status: 200,
				message: 'Course fetched successfully',
				course: course,
				isMyCourse: true,
				categories: categoriesData.responseObject,
			};
		}

		return {
			status: 200,
			message: 'Course fetched successfully',
			course: course,
			isMyCourse: false,
			categories: categoriesData.responseObject,
		};
	} catch (error) {
		console.error('Error fetching course:', error);
		return { status: 500, message: 'Failed to fetch course' };
	}
}

const coursedetailSchema = z.object({
	course_id: z.string().optional(),
	name: z.string().min(5, { message: 'Require Name of Course' }),
	description: z.string().optional(),
	subject_id: z.string().optional(),
	category_id: z.number().optional(),
	subcategory_id: z.number().optional(),
	course_language: z.string().optional().nullable(),
});

interface LoaderData {
	course: CourseWithAvatarType;
	isMyCourse: boolean;
	categories: CategoriesWithSubcategories;
}

function coursedetail() {
	const { course, isMyCourse, categories } = useLoaderData<LoaderData>();
	const navigate = useNavigate();
	const { loaderData } = useOutletContext<{ loaderData: ParentLoaderData & { message?: string } }>();
	const userId = loaderData.user?.user_id;
	const [isOpen, onOpenChange] = useState(false);
	const [fileName, setFileName] = useState('');

	const [isUploading, setIsUploading] = useState(false);
	const [fileToUpload, setFileToUpload] = useState<File | null>(null);
	const [uploadError, setUploadError] = useState<string | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	const [isVideoUploading, setIsVideoUploading] = useState(false);
	const [videoToUpload, setVideoToUpload] = useState<File | null>(null);
	const [videoFileName, setVideoFileName] = useState<string | null>(null);
	const [videoUploadProgress, setVideoUploadProgress] = useState(0);

	const imageFetcher = useFetcher();
	const courseFetcher = useFetcher();
	const videoFetcher = useFetcher();
	const cycleFetcher = useFetcher();

	const [cycles, setCycle] = useState<CourseCycleType[]>([]);

	const [onCreating, setOnCreating] = useState(false);
	const [showCreateForm, setShowCreateForm] = useState(false);

	if (!course) {
		return (
			<LMSLayout breadcrumbs={['All course', 'Error']}>
				<div className='flex flex-col items-center justify-center p-10'>
					<h1 className='text-2xl font-bold mb-4'>{'An error occurred'}</h1>
					<Button color='primary' onPress={() => navigate('/')}>
						Back to Home
					</Button>
				</div>
			</LMSLayout>
		);
	}

	const [isEditing, setIsEditing] = useState(false);

	const [isEnrolled, setIsEnrolled] = useState(() => {
		if (typeof window !== 'undefined') {
			const enrolledCourses = JSON.parse(localStorage.getItem(`enrolledCourses_${userId}`) || '[]');
			return enrolledCourses.includes(course);
		}
		return false;
	});

	const handleEnrollment = () => {
		if (!loaderData.user) {
			navigate('/login');
			return;
		}

		if (isEnrolled) {
			// handleGoToCourse(cycleFetcher.data?.cycle[0]?.cycle_id);
			return;
		}

		if (typeof window !== 'undefined') {
			const enrolledCourses = JSON.parse(localStorage.getItem(`enrolledCourses_${userId}`) || '[]');
			if (!enrolledCourses.includes(course.name)) {
				enrolledCourses.push(course.name);
				localStorage.setItem(`enrolledCourses_${userId}`, JSON.stringify(enrolledCourses));
				setIsEnrolled(true);
			}
		}
	};

	const handleUnenrollment = () => {
		if (typeof window !== 'undefined') {
			const enrolledCourses = JSON.parse(localStorage.getItem(`enrolledCourses_${userId}`) || '[]');
			if (enrolledCourses.includes(course.name)) {
				const newEnrolledCourses = enrolledCourses.filter((courseName: string) => courseName !== course.name);
				localStorage.setItem(`enrolledCourses_${userId}`, JSON.stringify(newEnrolledCourses));
				setIsEnrolled(false);
			}
		}
	};

	const handleGoToCourse = (cycleId?: string) => {
		if (cycleId) {
			navigate(`/courses/learn/${cycleId}`);
		} else {
			alert('No course cycles available');
		}
	};

	const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const selectedFile = e.target.files[0];
			setFileName(selectedFile.name);
			setFileToUpload(selectedFile);
			setUploadError(null);

			const objectUrl = URL.createObjectURL(selectedFile);
			setPreviewUrl(objectUrl);

			return objectUrl;
		}
		return null;
	};

	const handleUploadImage = () => {
		if (!fileToUpload) {
			setUploadError('Please select a file first');
			return;
		}

		setIsUploading(true);
		setUploadError(null);

		const formData = new FormData();
		formData.append('file', fileToUpload);
		formData.append('course_id', course.course_id.toString());

		imageFetcher.submit(formData, {
			method: 'post',
			encType: 'multipart/form-data',
			action: '/action/upload/covercourse',
		});
	};

	const handleSave = () => {
		handleSubmit((data) => {
			const formData = new FormData();
			formData.append('subject_id', data.subject_id || '');
			formData.append('name', data.name);

			if (data.description) {
				let descriptionValue = data.description;

				if (typeof data.description === 'object') {
					descriptionValue = JSON.stringify(data.description);
				} else if (
					typeof data.description === 'string' &&
					(data.description.startsWith('"[') || data.description.startsWith('"{')) &&
					(data.description.endsWith(']"') || data.description.endsWith('}"'))
				) {
					descriptionValue = data.description.substring(1, data.description.length - 1);
				}

				formData.append('description', descriptionValue);
			}

			formData.append('category_id', data.category_id?.toString() || '');
			formData.append('subcategory_id', data.subcategory_id?.toString() || '');
			formData.append('course_language', data.course_language || 'th');

			courseFetcher.submit(formData, {
				method: 'post',
				action: `/action/course/update/${course.course_id}`,
			});
		})();
	};

	const handleDateTime = (dateInput: Date | string): string => {
		const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

		if (Number.isNaN(date.getTime())) {
			throw new Error('Invalid date');
		}

		const pad = (n: number) => n.toString().padStart(2, '0');

		const day = pad(date.getDate());
		const month = pad(date.getMonth() + 1);
		const year = date.getFullYear();

		const hours = pad(date.getHours());
		const minutes = pad(date.getMinutes());
		const seconds = pad(date.getSeconds());

		return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
	};

	const getYouTubeEmbedUrl = (url: string) => {
		if (!url || url === 'null') {
			return 'https://www.youtube.com/embed/tgbNymZ7vqY'; // default video
		}

		try {
			// ตรวจสอบลิงก์รูปแบบ youtu.be
			if (url.includes('youtu.be/')) {
				const videoId = url.split('youtu.be/')[1]?.split('?')[0];
				if (videoId) {
					return `https://www.youtube.com/embed/${videoId}`;
				}
			}

			// ตรวจสอบลิงก์รูปแบบ youtube.com/watch?v=
			if (url.includes('youtube.com/watch')) {
				const videoId = new URL(url).searchParams.get('v');
				if (videoId) {
					return `https://www.youtube.com/embed/${videoId}`;
				}
			}

			// ถ้าเป็น URL ที่มี protocol ถูกต้องแล้ว (เช่น https://...) ให้ส่งกลับเลย
			if (url.startsWith('http')) {
				return url;
			}

			// หากไม่ตรงกับรูปแบบใดๆ ให้ใช้ค่า default
			return 'https://www.youtube.com/embed/tgbNymZ7vqY';
		} catch (error) {
			console.error('Error parsing YouTube URL:', error);
			return 'https://www.youtube.com/embed/tgbNymZ7vqY';
		}
	};

	interface CourseFormData {
		course_id?: string;
		name: string;
		description?: string;
		subject_id?: string;
		category_id?: number;
		subcategory_id?: number;
		course_language?: string | null;
	}

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
		setValue,
	} = useForm<CourseFormData>({
		resolver: zodResolver(coursedetailSchema),
		defaultValues: {
			course_id: course.course_id,
			subject_id: course.subject_id,
			name: course.name,
			description: course.description,
			category_id: course.category_id,
			subcategory_id: course.subcategory_id,
			course_language: course.course_language,
		},
	});

	useEffect(() => {
		if (imageFetcher.state === 'idle' && imageFetcher.data) {
			setIsUploading(false);

			if (imageFetcher.data.success) {
				alert('Image uploaded successfully');
				setFileName('');
				setFileToUpload(null);
				setPreviewUrl(null);

				if (imageFetcher.data.imageUrl) {
					console.log('Image URL:', imageFetcher.data.imageUrl);
				}
			} else {
				setUploadError(imageFetcher.data.message || 'Upload failed');
			}
		}
	}, [imageFetcher.state, imageFetcher.data]);

	useEffect(() => {
		return () => {
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
			}
		};
	}, [previewUrl]);

	const handleNameImageCover = (fileName: string) => {
		if (fileName) {
			if (fileName.length > 20) {
				return `${fileName.slice(0, 20)}...${fileName.slice(-4)}`;
			}
			return fileName;
		}
		return '';
	};

	// Client-side function to handle video upload with size validation
	const handleUploadVideo = () => {
		if (!videoToUpload) {
			alert('Please select a video file first');
			return;
		}

		// Check file size - limit to 5MB (adjust this based on actual server limits)
		const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
		if (videoToUpload.size > MAX_FILE_SIZE) {
			alert(
				`File is too large! Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB. Your file is ${(videoToUpload.size / (1024 * 1024)).toFixed(2)}MB.`,
			);
			return;
		}

		setIsVideoUploading(true);
		setVideoUploadProgress(0);

		// Create a FormData instance to send the file
		const formData = new FormData();
		formData.append('file', videoToUpload);
		formData.append('course_id', course.course_id.toString());

		// Create XMLHttpRequest for progress monitoring
		const xhr = new XMLHttpRequest();

		// Set up progress event
		xhr.upload.addEventListener('progress', (event) => {
			if (event.lengthComputable) {
				const progress = Math.round((event.loaded / event.total) * 100);
				console.log('Upload progress:', progress);
				setVideoUploadProgress(progress);
			}
		});

		// Handle completion
		xhr.addEventListener('load', () => {
			console.log('XHR Response:', {
				status: xhr.status,
				responseText: xhr.responseText.substring(0, 200),
			});

			setIsVideoUploading(false);

			if (xhr.status >= 200 && xhr.status < 300) {
				try {
					const response = JSON.parse(xhr.responseText);

					if (response.success) {
						setVideoFileName(null);
						setVideoToUpload(null);
						alert('Video uploaded successfully');
					} else {
						alert(`Error: ${response.message || 'Unknown server error'}`);
					}
				} catch (error) {
					console.error('Error parsing response:', error);
					alert('Server returned an invalid response');
				}
			} else if (xhr.status === 413) {
				alert('The video file is too large. Please select a smaller file (less than 5MB).');
			} else {
				alert(`Upload failed with status: ${xhr.status}`);
			}
		});

		// Handle errors
		xhr.addEventListener('error', () => {
			console.error('Network error during upload');
			setIsVideoUploading(false);
			alert('Network error occurred during upload');
		});

		// Handle aborted upload
		xhr.addEventListener('abort', () => {
			console.log('Upload aborted');
			setIsVideoUploading(false);
			alert('Upload was aborted');
		});

		// Send the request to your action route
		xhr.open('POST', `/action/course/video/${course.course_id}`, true);
		xhr.send(formData);
	};

	const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
	const [subCategories, setSubCategories] = useState<
		Array<{
			name: string;
			category_id: number;
			subcategory_id: number;
			created_at: string;
			updated_at: string;
		}>
	>([]);

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

	const handleCycle = () => {
		onOpenChange(true);
		cycleFetcher.load(`/action/get/cycles/${course.course_id}`);
	};

	// เพิ่มฟังก์ชันใหม่สำหรับการเปิดฟอร์มสร้าง cycle
	const handleCreateCycle = () => {
		// ปิดโมดัลรายการ cycles
		onOpenChange(false);
		// รอให้โมดัลแรกปิดก่อนเปิดฟอร์มสร้าง
		setTimeout(() => setShowCreateForm(true), 300);
	};

	useEffect(() => {
		// When cycleFetcher finishes and has data with status 200,
		// refresh the cycles list and close the creation modal
		if (cycleFetcher.state === 'idle' && cycleFetcher.data && cycleFetcher.data.status === 200) {
			// Only execute if we were creating a cycle
			if (onCreating) {
				setOnCreating(false);
				// Refresh the cycle list
				// cycleFetcher.load(`/action/get/cycles/${course.course_id}`);
			}
		}
	}, [cycleFetcher.state, cycleFetcher.data, onCreating]);

	// useEffect(() => {
	// 	console.log('onCreating state changed:', onCreating);
	// }, [onCreating]);

	return (
		<LMSLayout breadcrumbs={['All course', course.name]}>
			<div className='h-full'>
				<div className='grid grid-cols-[2.5fr_1fr] p-5'>
					<div className='flex md:pl-5 '>
						{/* ------------------------------------------------------------------------------------------------- */}

						{isOpen && (
							<Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior='inside'>
								<ModalContent>
									{(onClose) => (
										<>
											<ModalHeader className='flex flex-col gap-1'>Course Sections</ModalHeader>
											<ModalBody>
												{cycleFetcher.state === 'loading' && (
													<div className='flex justify-center items-center py-10'>
														<p className='text-blue-500'>Loading cycles data...</p>
													</div>
												)}

												{cycleFetcher.state === 'idle' && cycleFetcher.data && (
													<div className=' flex-col gap-2'>
														{cycleFetcher.data.cycle.map((cycle: CourseCycleType) => (
															<div key={cycle.cycle_id}>
																<Button
																	variant='ghost'
																	onPress={() => navigate(`/courses/learn/${cycle.cycle_id}/lesson`)}
																	className='w-full h-full min-w-[100px] min-h-[65px]'
																>
																	{/* <Button variant='ghost' onPress={() => console.log(`/courses/learn/${cycle.cycle_id}`)} className='w-full h-full min-w-[100px] min-h-[65px]'> */}
																	<p className='text-lg font-semibold'>{cycle.name}</p>
																</Button>
																<Spacer x={4} y={2} />
															</div>
														))}
													</div>
												)}

												{cycleFetcher.state === 'idle' && cycleFetcher.data && cycleFetcher.data.message && (
													<p className='text-red-500'>{cycleFetcher.data.message}</p>
												)}
											</ModalBody>
											<ModalFooter>
												<Button
													color='primary'
													onPress={() => {
														cycleFetcher.load(`/action/get/cycles/${course.course_id}`);
													}}
												>
													Refresh
												</Button>
												<Button variant='light' onPress={() => navigate(`/create/cycle/${course.course_id}`)}>
													Create New Cycle
												</Button>
											</ModalFooter>
										</>
									)}
								</ModalContent>
							</Modal>
						)}

						{/* ------------------------------------------------------------------------------------------------- */}

						<Card className='w-full h-full max-w-[1500px] min-w-[100px]'>
							<div className=' h-full box-border w-full rounded-lg p-8 shadow-md'>
								<div className='grid grid-cols-[14%_66%_20%] justify-start'>
									<div className='items-center w-fit'>
										{isEditing ? (
											<div className=''>
												<Controller<CourseFormData>
													name='subject_id'
													control={control}
													render={({ field }) => (
														<Input
															{...field}
															id='subject_id'
															size='lg'
															className='w-[80%] text-3xl font-bold'
															placeholder='Subject'
															isInvalid={!!errors.subject_id}
															errorMessage={errors.subject_id?.message}
															value={field.value !== undefined ? String(field.value) : ''} // Ensure value is a string
															onChange={(e) => {
																setValue('subject_id', e.target.value);
															}}
														/>
													)}
													rules={{ required: 'Subject is required' }}
												/>
											</div>
										) : (
											<div className='flex items-center'>
												<p className='text-3xl font-bold mr-4'>{course.subject_id}</p>
											</div>
										)}
									</div>
									<div className='flex justify-between items-center'>
										{isEditing ? (
											<Controller<CourseFormData>
												name='name'
												control={control}
												render={({ field }) => (
													<Input
														{...field}
														id='name'
														size='lg'
														className='w-[80%] text-3xl font-bold'
														placeholder='Name of course'
														isInvalid={!!errors.name}
														errorMessage={errors.name?.message}
														value={field.value !== undefined ? String(field.value) : ''} // Ensure value is a string
													/>
												)}
												rules={{ required: 'Name of course is required' }}
											/>
										) : (
											<h1 className='text-3xl font-bold w-[80%]'>{course.name}</h1>
										)}
									</div>
									<div className='justify-end flex items-center'>
										{isMyCourse && !isEditing ? (
											<Button
												color='primary'
												onPress={() => {
													setIsEditing(!isEditing);
												}}
											>
												Edit course
											</Button>
										) : isMyCourse && isEditing ? (
											<div className='flex flex-row gap-2'>
												<Button color='danger' variant='light' onPress={() => setIsEditing(!isEditing)}>
													Cancel
												</Button>
												<Button
													color='primary'
													isLoading={courseFetcher.state === 'submitting'}
													onPress={() => handleSave()}
												>
													Save
												</Button>
											</div>
										) : null}
									</div>
								</div>

								{!isEditing && (
									<div className='flex flex-wrap gap-2 mt-3 '>
										<p className='font-normal '>instructor :</p>
										<p className='font-normal '>
											{course.users.firstname_en} {course.users.lastname_en}
										</p>
									</div>
								)}

								{isEditing && (
									<div className='mt-5 grid grid-cols-[34%_33%_33%] justify-start'>
										{/* <p className='m-4'>Change cover image</p> */}
										<Input
											type='file'
											id='file'
											name='file'
											accept='image/*'
											placeholder='Upload file'
											className='hidden'
											onChange={(e) => {
												handleFile(e);
											}}
											hidden
										/>

										<div className='grid grid-rows-auto gap-2'>
											{fileName && <p className='text-gray-400'>Selected file: {handleNameImageCover(fileName)}</p>}

											{previewUrl && (
												<div className='mt-2 mb-4'>
													<p className='text-sm text-gray-600 mb-1'>Preview:</p>
													<img
														src={previewUrl}
														alt='Selected course cover'
														className='max-h-40 max-w-xs rounded border shadow-sm'
													/>
												</div>
											)}

											<div className='grid grid-rows-2 gap-2'>
												<p>
													Upload a new cover image (max size: 5MB)
													{fileName && <span className='text-gray-500'> - {fileName}</span>}
												</p>
												<div className='grid grid-cols-2 mx-6'>
													<Button
														color='primary'
														variant='light'
														onPress={() => {
															const fileInput = document.getElementById('file');
															if (fileInput) fileInput.click();
														}}
													>
														Select File
													</Button>

													<Button
														color='primary'
														isLoading={isUploading}
														isDisabled={isUploading || !fileToUpload}
														onPress={handleUploadImage}
													>
														Upload Image
													</Button>
												</div>
											</div>

											{uploadError && <p className='text-red-500 mt-2'>{uploadError}</p>}

											{imageFetcher.state === 'submitting' && <p className='text-blue-500 mt-2'>Uploading image...</p>}
										</div>
										<div className='grid grid-rows-2 gap-4 mx-4 items-center'>
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
										<div className=''>
											<p className='mb-2'>Language</p>
											<Controller
												name='course_language'
												control={control}
												render={({ field }) => (
													<Select
														size='lg'
														className='w-[60%]'
														placeholder='Select language'
														aria-label='Language'
														onChange={(e) => field.onChange(e.target.value)}
													>
														<SelectItem value='th'>Thai</SelectItem>
														<SelectItem value='en'>English</SelectItem>
													</Select>
												)}
											/>
										</div>
									</div>
								)}

								{/* <p className='mt-4 '>{course.description}</p> */}
								{isEditing ? (
									<Controller<CourseFormData>
										name='description'
										control={control}
										render={({ field }) => (
											<RichTextEditor
												{...field}
												id='description'
												className='w-full mt-4'
												placeholder='Description'
												isInvalid={!!errors.description}
												errorMessage={errors.description?.message}
												// แปลงจาก string เป็น Slate object
												value={
													field.value
														? (() => {
																try {
																	return JSON.parse(String(field.value));
																} catch (e) {
																	console.error('Error parsing description:', e);
																	return [{ type: 'paragraph', children: [{ text: '' }] }];
																}
															})()
														: [{ type: 'paragraph', children: [{ text: '' }] }]
												}
												minHeight='200px'
												maxHeight='400px'
												// แปลงจาก Slate object เป็น JSON string
												onChange={(value) => {
													try {
														// แปลงเป็น JSON string ก่อนส่งไป
														field.onChange(JSON.stringify(value));
													} catch (error) {
														console.error('Error converting rich text to JSON:', error);
														field.onChange('');
													}
												}}
											/>
										)}
									/>
								) : (
									// <p className='mt-4'>{course.description}</p>
									<SlateContentViewer
										value={(() => {
											try {
												return course.description ? (JSON.parse(course.description) as Descendant[]) : [];
											} catch {
												console.error('Invalid description format');
												return [];
											}
										})()}
									/>
								)}
							</div>
						</Card>
					</div>

					<div className='flex justify-center py-5 md:py-0 md:px-5'>
						<Card className='px-4 py-4 w-full max-w-[500px] min-w-[200px]'>
							{isEditing ? (
								<div className='flex flex-col gap-4 w-full'>
									<h3 className='text-lg font-medium'>Course Video</h3>
									<Input
										type='text'
										label='YouTube Video URL'
										placeholder='Enter YouTube video URL'
										// defaultValue={course.videoUrl || ''}
										onChange={(e) => {
											const videoUrl = e.target.value;
											// You can add form value setting here if needed
											// Example: setValue('videoUrl', videoUrl);
										}}
										className='w-full'
									/>
									<p className='text-sm text-gray-500'>
										Enter a valid YouTube URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID)
									</p>
									<div className='flex items-center my-2'>
										<div className='flex-grow border-t border-gray-300' />
										<span className='mx-2 text-gray-500 text-sm'>OR</span>
										<div className='flex-grow border-t border-gray-300' />
									</div>
									<Input
										type='file'
										id='video-file'
										name='video-file'
										accept='video/*'
										placeholder='Upload video file'
										className='hidden'
										onChange={(e) => {
											if (e.target.files && e.target.files.length > 0) {
												const selectedFile = e.target.files[0];
												setVideoFileName(selectedFile.name);
												setVideoToUpload(selectedFile);
												setVideoUploadProgress(0);
											}
										}}
									/>
									<div className='flex gap-2'>
										<Button
											color='primary'
											variant='light'
											onPress={() => {
												const fileInput = document.getElementById('video-file');
												if (fileInput) fileInput.click();
											}}
										>
											Select Video File
										</Button>
										<Button
											color='primary'
											isDisabled={!videoToUpload || isVideoUploading}
											isLoading={isVideoUploading}
											onPress={handleUploadVideo}
										>
											Upload Video
										</Button>
									</div>

									{videoFileName && (
										<div className='mt-2'>
											<p className='text-gray-600 mb-1'>Selected video: {videoFileName}</p>

											{isVideoUploading && (
												<div className='w-full mt-2'>
													<div className='w-full bg-gray-200 rounded-full h-2.5'>
														<div
															className='bg-blue-600 h-2.5 rounded-full'
															style={{ width: `${videoUploadProgress}%` }}
														/>
													</div>
													<p className='text-xs text-gray-500 mt-1 text-right'>{videoUploadProgress}% Uploaded</p>
												</div>
											)}

											{videoUploadProgress === 100 && !isVideoUploading && (
												<div className='flex items-center mt-2 text-green-500'>
													<span className='material-symbols-outlined mr-1'>check_circle</span>
													<span>Upload Complete</span>
												</div>
											)}
										</div>
									)}
								</div>
							) : (
								<div className=''>
									<iframe
										className='rounded-2xl p-2 '
										width='100%'
										height='215'
										src={(() => {
											// แสดงวิดีโอจาก URL ที่ได้รับ
											if (course.intro_video?.url) {
												const url = course.intro_video.url;

												// กรณีที่ 1: เป็นวิดีโอจาก YouTube
												if (url.includes('youtube.com') || url.includes('youtu.be')) {
													try {
														// กรณี youtu.be
														if (url.includes('youtu.be/')) {
															const videoId = url.split('youtu.be/')[1]?.split('?')[0];
															return `https://www.youtube.com/embed/${videoId}`;
														}

														// กรณี youtube.com/watch?v=
														if (url.includes('youtube.com/watch')) {
															const urlObj = new URL(url);
															const videoId = urlObj.searchParams.get('v');
															return `https://www.youtube.com/embed/${videoId}`;
														}

														// ถ้า URL มี /embed/ อยู่แล้ว ใช้เลย
														if (url.includes('/embed/')) {
															return url;
														}
													} catch (error) {
														console.error('Error parsing YouTube URL:', error);
													}
												}

												// กรณีที่ 2: เป็นวิดีโอจาก backend ของคุณเอง
												else {
													return url; // ใช้ URL จาก backend โดยตรง
												}
											}

											// ค่าเริ่มต้นถ้าไม่มี URL หรือแปลงไม่สำเร็จ
											return 'https://www.youtube.com/embed/tgbNymZ7vqY';
										})()}
										title='YouTube video player'
										allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
										frameBorder='0'
										allowFullScreen
									/>
								</div>
							)}
							{!isMyCourse && (
								<div className='my-2 grid grid-cols-[10%_90%] justify-start'>
									<div className='w-fit'>
										<span
											className='material-symbols-outlined pl-3 w-fit'
											style={{ fontSize: 'font-size: clamp(48px, 5vw, 60px);' }}
										>
											Calendar_Month
										</span>
									</div>
									<div className='grid grid-row-2 pl-2 font-medium'>
										<div>
											<span className='text-gray-400'>Starts: </span>
											{handleDateTime(course.created_at)}
										</div>
										<div>
											<span className='text-gray-400'>End: </span>
											{handleDateTime(course.created_at)}
										</div>
										{/* <div className=''>{handleDateTime(course.updated_at)}</div> */}
									</div>
								</div>
							)}

							<div className='p-2'>
								<div className='oneline self-center border-1  ' />
							</div>

							<div>
								<div>
									{isMyCourse ? (
										<Button className='w-full' color='primary' onPress={handleCycle}>
											Go to Update
										</Button>
									) : (
										<Button className='w-full' color='primary' onPress={handleEnrollment}>
											{isEnrolled ? 'Go to course' : 'Enroll'}
										</Button>
									)}
								</div>
							</div>
							{isMyCourse ? (
								<div className='mt-4'>
									<Button color='danger' variant='light' className='w-full font-medium' onPress={handleUnenrollment}>
										Delete course
									</Button>
								</div>
							) : (
								<div className='mt-auto pt-4 flex justify-end'>
									<Button
										color='danger'
										variant='light'
										className='w-fit font-medium'
										size='sm'
										onPress={handleUnenrollment}
									>
										Unenroll
									</Button>
								</div>
							)}
						</Card>
					</div>
				</div>
			</div>
		</LMSLayout>
	);
}

export default coursedetail;
