import {
	Avatar,
	Button,
	Card,
	CardBody,
	CardHeader,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Spinner,
	avatar,
	useDisclosure,
} from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { cache, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useOutletContext } from 'react-router';
import type { ActionFunctionArgs } from 'react-router';
import { useFetcher } from 'react-router';
import { redirect } from 'react-router';
import { useNavigate } from 'react-router';
import { useSubmit } from 'react-router-dom';
import { Form, useActionData } from 'react-router-dom';
import { z } from 'zod';
import { LMSLayout } from '../components/learnify/LMSLayout';
import type { ParentLoaderData } from './_lnf';

interface FormData {
	firstname_en: string;
	firstname_th: string;
	lastname_en: string;
	lastname_th: string;
	email: string;
	file?: File;
}

interface UserData extends FormData {
	roles?: string;
	is_verified?: boolean;
}

interface LoaderData {
	user: UserData;
}

const MAX_FILE_SIZE = 1024 * 1024 * 10; // 10MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'];

const profileSchema = z.object({
	firstname_en: z.string().min(1, { message: 'English first name is required' }),
	firstname_th: z.string().min(1, { message: 'Thai first name is required' }),
	lastname_en: z.string().min(1, { message: 'English last name is required' }),
	lastname_th: z.string().min(1, { message: 'Thai last name is required' }),
	email: z.string().email({ message: 'Invalid email format' }),
	// file: z.instanceof(File).optional(),
});

export default function Profile() {
	const { loaderData } = useOutletContext<{ loaderData: ParentLoaderData }>();
	const { user } = loaderData;
	const [isEditing, setIsEditing] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [previewImage, setPreviewImage] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [submitError, setSubmitError] = useState<string | null>(null);

	// const navigate = useNavigate();
	const fetcher = useFetcher();

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
		setValue,
	} = useForm<FormData>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			firstname_en: user?.firstname_en,
			firstname_th: user?.firstname_th || undefined,
			lastname_en: user?.lastname_en,
			lastname_th: user?.lastname_th || undefined,
			email: user?.email,
			// file: undefined,
		},
	});

	const onSubmit = async (data: FormData) => {
		setIsUploading(true);
		setSubmitError(null);

		try {
			const formData = new FormData();
			formData.append('firstname_en', data.firstname_en);
			formData.append('firstname_th', data.firstname_th);
			formData.append('lastname_en', data.lastname_en);
			formData.append('lastname_th', data.lastname_th);
			formData.append('email', data.email);
			// if (data.file) {
			// 	formData.append('file', data.file);
			// }

			fetcher.submit(formData, {
				method: 'POST',
				action: '/action/change/userData',
				// encType: 'multipart/form-data',
			});

			// action

			setIsEditing(false);
			setPreviewImage(null);
			reset();
		} catch (error) {}
	};

	const handleCancel = () => {
		setIsEditing(false);
		setPreviewImage(null);
		reset();
	};

	const handleBrowseClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	// ฟังก์ชันสำหรับตรวจสอบและจัดการไฟล์ที่อัปโหลด
	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (!ALLOWED_FILE_TYPES.includes(file.type)) {
			setSubmitError('Invalid file type. Please upload an image file (JPEG or PNG)');
			e.target.value = '';
			onOpen();
			return;
		}

		if (file.size > MAX_FILE_SIZE) {
			setSubmitError('file size must not exceed 10MB');
			e.target.value = '';
			onOpen();
			return;
		}

		setValue('file', file);

		const reader = new FileReader();
		reader.onload = (e) => {
			if (e.target?.result) {
				setPreviewImage(e.target.result as string);
			}
		};
		reader.readAsDataURL(file);

		const formAvatar = new FormData();
		formAvatar.append('file', file);

		fetcher.submit(formAvatar, {
			method: 'POST',
			action: '/action/upload/avatar',
			encType: 'multipart/form-data',
		});
	};

	return (
		<LMSLayout breadcrumbs={['Home', 'My Profile']}>
			<div className='space-y-4 mb-12'>
				<h1 className='text-3xl mx-12 text-[#FD9E02]'>Profile</h1>
				<Card className='profile-card w-[90vw] mx-auto' radius='sm'>
					<form onSubmit={handleSubmit(onSubmit)}>
						<CardHeader className='grid grid-cols-2 gap-4 mt-4'>
							<div className='flex gap-12 mx-4 w-full justify-center items-center'>
								{/* <div className='relative flex flex-col items-center justify-center'>
										
									<Avatar
															className={'w-24 h-24 text-3xl cursor-pointer'}
															isBordered
															src={isEditing ? previewImage || user?.avatar?.url : user?.avatar?.url}
															onChange={handleBrowseClick}
															// fallback={user?.firstname?.en?.[0]?.toUpperCase() || 'U'}
															
											/>
										<div className=''>

											<label
												htmlFor='file'
												className='cursor-pointer text-[#FD9E02] hover:text-[#FD9E02] transition-colors'>
													<Input
														type='file'
														ref={fileInputRef}
														// onChange={handleImageChange}
														placeholder='Upload Image'
														// className='hidden'
														>

												</Input>
														Edit
											</label>
										</div>
								</div> */}

								<div className='relative group flex flex-col items-center justify-center'>
									<Avatar
										className='w-24 h-24 text-3xl cursor-pointer'
										isBordered
										src={isEditing ? previewImage || user?.avatar?.url : user?.avatar?.url}
									/>
									{/* กล่องลอยทับที่ไว้ใส่ไอคอน จะซ่อนตอนปกติ และค่อยโชว์ตอน hover */}
									<div
										className='absolute inset-0 flex items-center justify-center 
                          opacity-0 group-hover:opacity-100 transition-opacity'
									>
										<label htmlFor='avatarFile' className='cursor-pointer'>
											<span className='material-symbols-outlined' style={{ fontSize: '60px' }}>
												edit
											</span>
										</label>
									</div>
									{/* Input file ซ่อน */}
									<Input
										id='avatarFile'
										type='file'
										ref={fileInputRef}
										onChange={handleImageChange}
										className='hidden'
									/>
								</div>
								<div className='space-y-2'>
									<h1 className='text-lg font-semibold'>
										{user?.firstname_en} {user?.lastname_en}
									</h1>
									{/* <p className='text-gray-600'>{user?.email}</p> */}
									{isEditing ? (
										<Controller<FormData>
											name='email'
											control={control}
											render={({ field }) => (
												<Input
													label='Email'
													{...field}
													value={field.value as string}
													isInvalid={!!errors.email}
													errorMessage={errors.email?.message}
													isDisabled={isUploading}
												/>
											)}
										/>
										// <div>hi</div>
									) : (
										<p className='text-gray-600'>{user?.email}</p>
									)}
									<div className='flex items-center gap-2'>
										<span className='material-symbols-outlined w-fit' style={{ fontSize: '25px' }}>
											Groups
										</span>
										<p>{user?.user_role}</p>
									</div>
								</div>
							</div>

							<div className='flex justify-end mx-4 h-full gap-2'>
								{isEditing ? (
									<>
										<Button size='sm' color='danger' variant='light' onPress={handleCancel}>
											Cancel
										</Button>
										<Button
											size='sm'
											color='primary'
											type='submit'
											isLoading={isUploading || fetcher.state === 'submitting'}
										>
											Save
										</Button>
									</>
								) : (
									<Button size='sm' variant='bordered' className='w-fit' onPress={() => setIsEditing(true)}>
										<span className='material-symbols-outlined w-fit' style={{ fontSize: '20px' }}>
											Edit
										</span>
										Edit
									</Button>
								)}
							</div>
						</CardHeader>

						<CardBody className='max-w-5xl mx-auto px-6 py-8'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								{isEditing ? (
									<>
										<Controller<FormData>
											name='firstname_en'
											control={control}
											render={({ field }) => (
												<Input
													label='ชื่อ (EN)'
													{...field}
													value={field.value as string}
													isInvalid={!!errors.firstname_en}
													errorMessage={errors.firstname_en?.message}
													isDisabled={isUploading}
												/>
											)}
										/>
										<Controller<FormData>
											name='lastname_en'
											control={control}
											render={({ field }) => (
												<Input
													label='นามสกุล (EN)'
													{...field}
													value={field.value as string}
													isInvalid={!!errors.lastname_en}
													errorMessage={errors.lastname_en?.message}
													isDisabled={isUploading}
												/>
											)}
										/>

										<Controller<FormData>
											name='firstname_th'
											control={control}
											render={({ field }) => (
												<Input
													label='ชื่อ (TH)'
													{...field}
													value={field.value as string}
													isInvalid={!!errors.firstname_th}
													errorMessage={errors.firstname_th?.message}
													isDisabled={isUploading}
												/>
											)}
										/>
										<Controller<FormData>
											name='lastname_th'
											control={control}
											render={({ field }) => (
												<Input
													label='นามสกุล (TH)'
													{...field}
													value={field.value as string}
													isInvalid={!!errors.lastname_th}
													errorMessage={errors.lastname_th?.message}
													isDisabled={isUploading}
												/>
											)}
										/>
									</>
								) : (
									<>
										<p className='w-full rounded-lg p-4'>
											<b>ชื่อ (EN) : </b> &nbsp; {user?.firstname_en}
										</p>
										<p className='rounded-lg p-4'>
											<b>นามสกุล (EN) : </b> &nbsp; {user?.lastname_en}
										</p>
										<p className='rounded-lg p-4'>
											<b>ชื่อ (ไทย) : </b> &nbsp; {user?.firstname_th}
										</p>
										<p className='rounded-lg p-4'>
											<b>นามสกุล (ไทย) : </b> &nbsp; {user?.lastname_th}
										</p>
									</>
								)}
							</div>
						</CardBody>
					</form>
				</Card>
			</div>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalContent>
					<ModalHeader>Error</ModalHeader>
					<ModalBody>
						<p>{submitError}</p>
					</ModalBody>
					<ModalFooter>
						<Button color='primary' onPress={onClose}>
							OK
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</LMSLayout>
	);
}
