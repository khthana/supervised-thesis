import { LMSLayout } from '@/components/learnify/LMSLayout';
import { getPublicEnv } from '@/lib/env.server';
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Checkbox,
	Chip,
	Divider,
	Input,
	Select,
	SelectItem,
	Spacer,
	Tooltip,
} from '@heroui/react';
import { useEffect, useState } from 'react';
import { useFetcher, useLoaderData, useNavigate, useParams } from 'react-router';
import type { LoaderFunctionArgs } from 'react-router';

interface Course {
	id: string;
	name: string;
}

interface LoaderData {
	course: Course | null;
	status: number;
	message: string;
}

// ฟังก์ชัน loader สำหรับดึงข้อมูลคอร์ส
export async function loader({ request, params }: LoaderFunctionArgs): Promise<LoaderData> {
	const env = getPublicEnv();
	const { course_id } = params;

	if (!course_id) {
		return {
			status: 400,
			message: 'Course ID is required',
			course: null,
		};
	}

	try {
		// ดึงข้อมูลคอร์ส
		const response = await fetch(`${env.BACKEND_URL}/api/courses/${course_id}`);

		if (!response.ok) {
			return {
				status: response.status,
				message: 'Course not found',
				course: null,
			};
		}

		const data = await response.json();

		return {
			status: 200,
			message: 'Course fetched successfully',
			course: data.responseObject,
		};
	} catch (error) {
		console.error('Error fetching course:', error);
		return {
			status: 500,
			message: 'Failed to fetch course',
			course: null,
		};
	}
}

export default function CreateCourseCycle() {
	const { course } = useLoaderData<LoaderData>();
	const navigate = useNavigate();
	const params = useParams();
	const course_id = params.course_id;
	const cycleFetcher = useFetcher();

	// สถานะข้อผิดพลาดของวันที่
	const [dateErrors, setDateErrors] = useState({
		enroll_start: '',
		enroll_end: '',
		cycle_start: '',
		cycle_end: '',
	});

	// สถานะแบบฟอร์ม
	const [formState, setFormState] = useState({
		name: '',
		is_always_enroll: true,
		is_always_open: false,
		is_restrict: false,
		max_learner: 0,
		course_type: 'self-paced',
		status: 'published',
		enroll_start: '',
		enroll_end: '',
		cycle_start: '',
		cycle_end: '',
	});

	// กำหนดค่าสูงสุดที่อนุญาตให้มีผู้เรียนได้
	const MAX_ALLOWED_LEARNERS = 1000;

	// ฟังก์ชันตรวจสอบวันที่ปัจจุบัน
	const getCurrentDateTimeForInput = () => {
		const now = new Date();
		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, '0');
		const day = String(now.getDate()).padStart(2, '0');
		const hours = String(now.getHours()).padStart(2, '0');
		const minutes = String(now.getMinutes()).padStart(2, '0');

		return `${year}-${month}-${day}T${hours}:${minutes}`;
	};

	// ตรวจสอบว่าวันที่น้อยกว่าปัจจุบันหรือไม่
	const isDateBeforeNow = (dateString: string) => {
		if (!dateString) return false;

		const selectedDate = new Date(dateString);
		const now = new Date();

		return selectedDate < now;
	};

	// ตรวจสอบว่าวันที่เริ่มต้นน้อยกว่าวันที่สิ้นสุดหรือไม่
	const isStartBeforeEnd = (startDate: string, endDate: string) => {
		if (!startDate || !endDate) return true;

		const start = new Date(startDate);
		const end = new Date(endDate);

		return start < end;
	};

	// ตรวจสอบว่าช่วงลงทะเบียนอยู่ในช่วงของคอร์สหรือไม่
	const isEnrollmentWithinCycle = () => {
		// ถ้าเป็น always_enroll หรือ always_open ไม่ต้องตรวจสอบ
		if (formState.is_always_enroll || formState.is_always_open) return true;

		const enrollStart = formState.enroll_start ? new Date(formState.enroll_start) : null;
		const enrollEnd = formState.enroll_end ? new Date(formState.enroll_end) : null;
		const cycleStart = formState.cycle_start ? new Date(formState.cycle_start) : null;
		const cycleEnd = formState.cycle_end ? new Date(formState.cycle_end) : null;

		// ถ้าวันที่ไม่ครบ ไม่ต้องตรวจสอบ
		if (!enrollStart || !enrollEnd || !cycleStart || !cycleEnd) return true;

		// ตรวจสอบว่าวันเริ่มลงทะเบียนเร็วกว่าหรือเท่ากับวันเริ่มคอร์ส
		// และวันสิ้นสุดการลงทะเบียนไม่เกินวันสิ้นสุดคอร์ส
		return enrollEnd <= cycleEnd;
	};

	// ฟังก์ชันตรวจสอบความถูกต้องของวันที่
	const validateDates = (name: string, value: string) => {
		// Clone object without creating full new reference each time
		const errors = { ...dateErrors };

		// ตรวจสอบวันที่ต่ำกว่าปัจจุบัน
		if (isDateBeforeNow(value)) {
			errors[name as keyof typeof dateErrors] = 'Date cannot be before current time';
			return errors;
		}

		// ล้างข้อผิดพลาดสำหรับฟิลด์นี้
		errors[name as keyof typeof dateErrors] = '';

		// ตรวจสอบเฉพาะเมื่อจำเป็น
		if ((name === 'enroll_start' || name === 'enroll_end') && formState.enroll_start && formState.enroll_end) {
			if (!isStartBeforeEnd(formState.enroll_start, formState.enroll_end)) {
				errors.enroll_end = 'Enrollment end date must be after start date';
			} else {
				errors.enroll_end = '';
			}
		}

		if ((name === 'cycle_start' || name === 'cycle_end') && formState.cycle_start && formState.cycle_end) {
			if (!isStartBeforeEnd(formState.cycle_start, formState.cycle_end)) {
				errors.cycle_end = 'Cycle end date must be after start date';
			} else {
				errors.cycle_end = '';
			}
		}

		// ตรวจสอบเฉพาะเมื่อจำเป็น
		if ((name === 'enroll_end' || name === 'cycle_end') && !formState.is_always_enroll && !formState.is_always_open) {
			if (!isEnrollmentWithinCycle()) {
				errors.enroll_end = 'Enrollment period must end before or on the same day as the cycle ends';
			}
		}

		return errors;
	};

	// จัดการการเปลี่ยนแปลงของฟิลด์ Input และ Select
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value, type } = e.target as HTMLInputElement;

		if (type === 'checkbox') {
			const checked = (e.target as HTMLInputElement).checked;
			setFormState((prev) => ({ ...prev, [name]: checked }));

			// ตรวจสอบกรณีเปลี่ยน always_enroll หรือ always_open
			if (name === 'is_always_enroll' || name === 'is_always_open') {
				setDateErrors((prev) => ({ ...prev, enroll_end: '', cycle_end: '' }));
			}
		} else if (type === 'datetime-local') {
			setFormState((prev) => ({ ...prev, [name]: value }));

			// ตรวจสอบความถูกต้องของวันที่
			const newErrors = validateDates(name, value);
			setDateErrors(newErrors);
		} else if (name === 'max_learner') {
			// ตรวจสอบและจำกัดจำนวนผู้เรียน
			const numValue = Number.parseInt(value, 10);

			if (Number.isNaN(numValue)) {
				// ถ้าไม่ใช่ตัวเลข ให้กำหนดค่าเป็น 0
				setFormState((prev) => ({ ...prev, max_learner: 0 }));
			} else if (numValue > MAX_ALLOWED_LEARNERS) {
				// ถ้าเกินขีดจำกัด ให้กำหนดค่าเป็นค่าสูงสุดที่อนุญาต
				setFormState((prev) => ({ ...prev, max_learner: MAX_ALLOWED_LEARNERS }));
				// อาจเพิ่มการแจ้งเตือนด้วย alert หรือ toast
				alert(`Maximum learners cannot exceed ${MAX_ALLOWED_LEARNERS}`);
			} else {
				// ถ้าอยู่ในช่วงที่ยอมรับได้ ให้ใช้ค่านั้น
				setFormState((prev) => ({ ...prev, max_learner: numValue }));
			}
		} else {
			setFormState((prev) => ({ ...prev, [name]: value }));
		}
	};

	// จัดการการเปลี่ยนแปลงของ Checkbox จาก HeroUI
	const handleCheckboxChange = (name: string, isSelected: boolean) => {
		setFormState((prev) => ({ ...prev, [name]: isSelected }));

		// ตรวจสอบกรณีเปลี่ยน always_enroll หรือ always_open
		if (name === 'is_always_enroll' || name === 'is_always_open') {
			setDateErrors((prev) => ({ ...prev, enroll_end: '', cycle_end: '' }));
		}
	};

	// ตรวจสอบความถูกต้องของฟอร์มทั้งหมดก่อนส่ง
	const isFormValid = () => {
		// ตรวจสอบว่ามีข้อผิดพลาดหรือไม่
		const hasErrors = Object.values(dateErrors).some((error) => error !== '');

		// ตรวจสอบว่ากรอกข้อมูลจำเป็นหรือไม่
		let missingRequired = !formState.name;

		// ตรวจสอบวันที่ที่จำเป็น
		if (!formState.is_always_enroll) {
			missingRequired = missingRequired || !formState.enroll_start;
			if (!formState.is_always_enroll) missingRequired = missingRequired || !formState.enroll_end;
		}

		if (!formState.is_always_open) {
			missingRequired = missingRequired || !formState.cycle_start;
			if (!formState.is_always_open) missingRequired = missingRequired || !formState.cycle_end;
		}

		return !hasErrors && !missingRequired;
	};

	// ส่งฟอร์ม
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// ตรวจสอบความถูกต้องอีกครั้งก่อนส่ง
		if (!isFormValid()) {
			alert('Please correct the errors before submitting');
			return;
		}

		const formData = new FormData();

		// เพิ่มข้อมูลจาก state ลงใน FormData
		for (const [key, value] of Object.entries(formState)) {
			if (key.includes('_start') || key.includes('_end')) {
				if (value && typeof value === 'string') {
					const dateObj = new Date(value);
					formData.append(key, dateObj.toISOString());
				}
			} else if (typeof value === 'boolean') {
				formData.append(key, value.toString());
			} else if (typeof value === 'number') {
				formData.append(key, value.toString());
			} else {
				formData.append(key, value as string);
			}
		}

		// ส่งข้อมูลไปยัง API
		cycleFetcher.submit(formData, {
			method: 'post',
			action: `/action/create/cycle/${course_id}`,
		});
	};

	// ตรวจสอบเมื่อส่งฟอร์มสำเร็จ
	useEffect(() => {
		// เช็คเฉพาะเมื่อ state เปลี่ยนเป็น idle และมีข้อมูล
		if (cycleFetcher.state === 'idle' && cycleFetcher.data?.status === 200) {
			// กลับไปยังหน้าคอร์ส
			navigate(`/courses/${course_id}`);
		}
	}, [cycleFetcher.state, cycleFetcher.data?.status, navigate, course_id]);

	// ตรวจสอบการเปลี่ยนแปลงของช่วงวันที่
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		// ตรวจสอบความถูกต้องของวันที่เมื่อมีการเปลี่ยนแปลง
		const newErrors = { ...dateErrors };

		if (formState.enroll_start) {
			Object.assign(newErrors, validateDates('enroll_start', formState.enroll_start));
		}

		if (formState.enroll_end && !formState.is_always_enroll) {
			Object.assign(newErrors, validateDates('enroll_end', formState.enroll_end));
		}

		if (formState.cycle_start) {
			Object.assign(newErrors, validateDates('cycle_start', formState.cycle_start));
		}

		if (formState.cycle_end && !formState.is_always_open) {
			Object.assign(newErrors, validateDates('cycle_end', formState.cycle_end));
		}

		// ใช้ JSON.stringify เพื่อเปรียบเทียบค่าก่อนอัปเดต State
		if (JSON.stringify(newErrors) !== JSON.stringify(dateErrors)) {
			setDateErrors(newErrors);
		}
	}, [
		formState.enroll_start,
		formState.enroll_end,
		formState.cycle_start,
		formState.cycle_end,
		formState.is_always_enroll,
		formState.is_always_open,
		dateErrors,
	]);

	// ใช้ useEffect เพื่อกำหนดค่าเริ่มต้นสำหรับวันที่
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const now = getCurrentDateTimeForInput();
		setFormState((prev) => ({
			...prev,
			enroll_start: now,
			cycle_start: now,
		}));
	}, []);

	if (!course) {
		return (
			<LMSLayout breadcrumbs={['All Courses', 'Error']}>
				<div className='flex flex-col items-center justify-center p-10'>
					<h1 className='text-2xl font-bold mb-4'>Course not found</h1>
					<Button color='primary' onPress={() => navigate('/courses')}>
						Back to Courses
					</Button>
				</div>
			</LMSLayout>
		);
	}

	return (
		<LMSLayout breadcrumbs={['All Courses', course.name, 'Create Cycle']}>
			<div className='w-full max-w-5xl mx-auto p-4'>
				<Card className='w-full shadow-md'>
					<CardHeader className='flex justify-between items-center'>
						<div>
							<h1 className='text-2xl font-bold'>Create New Course Cycle</h1>
							<p className='text-gray-500 mt-1'>Add a new learning cycle for course</p>
						</div>
						<Chip color='primary' variant='flat' className='text-sm'>
							{course.name}
						</Chip>
					</CardHeader>

					<Divider />

					<CardBody>
						{/* {cycleFetcher.data && cycleFetcher.data.status !== 200 && (
              <div className="p-4 mb-4 bg-danger-50 border border-danger-200 rounded-medium text-danger-700">
                {cycleFetcher.data.message || "An error occurred while creating the cycle"}
              </div>
            )} */}

						<form id='cycle-create-form' onSubmit={handleSubmit} className='space-y-8'>
							<div>
								<Input
									label='Cycle Name'
									placeholder='Enter cycle name'
									name='name'
									value={formState.name}
									onChange={handleInputChange}
									variant='bordered'
									radius='sm'
									size='lg'
									isRequired
									className='w-full'
									labelPlacement='outside'
								/>
							</div>

							<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
								<Select
									label='Course Type'
									labelPlacement='outside'
									name='course_type'
									selectedKeys={[formState.course_type]}
									onChange={handleInputChange}
									variant='bordered'
									radius='sm'
									size='lg'
									className='w-full justify-self-start'
									placeholder='Select course type'
								>
									<SelectItem key='self-paced' value='self-paced'>
										Public
									</SelectItem>
									<SelectItem key='instructor-led' value='instructor-led'>
										Private
									</SelectItem>
								</Select>
								<div className='space-y-4'>
									<h3 className='text-lg font-medium'>Enrollment Options</h3>

									<div className='space-y-3 pl-1'>
										<Checkbox
											name='is_always_enroll'
											isSelected={formState.is_always_enroll}
											onValueChange={(isSelected) => handleCheckboxChange('is_always_enroll', isSelected)}
											size='md'
										>
											Always Open for Enrollment
										</Checkbox>

										<Tooltip content='Course remains open indefinitely with no end date'>
											<Checkbox
												name='is_always_open'
												isSelected={formState.is_always_open}
												onValueChange={(isSelected) => handleCheckboxChange('is_always_open', isSelected)}
												size='md'
											>
												Always Open (No End Date)
											</Checkbox>
										</Tooltip>
										<br />
										<Checkbox
											name='is_restrict'
											isSelected={formState.is_restrict}
											onValueChange={(isSelected) => handleCheckboxChange('is_restrict', isSelected)}
											size='md'
										>
											Restrict Enrollment
										</Checkbox>
									</div>
								</div>
							</div>

							<Divider />

							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								<div>
									<Input
										type='number'
										label='Maximum Learners'
										labelPlacement='outside'
										name='max_learner'
										value={String(formState.max_learner)}
										onChange={handleInputChange}
										min='0'
										max={MAX_ALLOWED_LEARNERS}
										placeholder='0 for unlimited'
										variant='bordered'
										radius='sm'
										size='lg'
										startContent={
											<div className='pointer-events-none flex items-center'>
												<span className='text-default-400 text-small'>Max</span>
											</div>
										}
										description={`Set to 0 for unlimited enrollment (Maximum: ${MAX_ALLOWED_LEARNERS})`}
										className='w-full'
									/>
								</div>

								<Select
									label='Status'
									labelPlacement='outside'
									name='status'
									selectedKeys={[formState.status]}
									onChange={handleInputChange}
									variant='bordered'
									radius='sm'
									size='lg'
									className='w-full'
									placeholder='Select status'
								>
									<SelectItem key='published' value='published'>
										Published
									</SelectItem>
									<SelectItem key='archived' value='archived'>
										Hide
									</SelectItem>
								</Select>
							</div>

							<Divider />

							<div>
								<h3 className='text-lg font-medium mb-4'>Enrollment Period</h3>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
									<Input
										type='datetime-local'
										label='Enrollment Start'
										labelPlacement='outside'
										name='enroll_start'
										value={formState.enroll_start}
										onChange={handleInputChange}
										variant='bordered'
										radius='sm'
										size='lg'
										className='w-full'
										isRequired={!formState.is_always_enroll}
										isInvalid={!!dateErrors.enroll_start}
										errorMessage={dateErrors.enroll_start}
										min={getCurrentDateTimeForInput()}
										description='Must be after current date and time'
									/>

									<Input
										type='datetime-local'
										label='Enrollment End'
										labelPlacement='outside'
										name='enroll_end'
										value={formState.enroll_end}
										onChange={handleInputChange}
										variant='bordered'
										radius='sm'
										size='lg'
										className='w-full'
										isDisabled={formState.is_always_enroll}
										isRequired={!formState.is_always_enroll}
										isInvalid={!!dateErrors.enroll_end}
										errorMessage={dateErrors.enroll_end}
										min={formState.enroll_start}
										description={
											formState.is_always_enroll
												? 'Not required when always open for enrollment'
												: 'Must be after enrollment start'
										}
									/>
								</div>
							</div>

							<div>
								<h3 className='text-lg font-medium mb-4'>Cycle Period</h3>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
									<Input
										type='datetime-local'
										label='Cycle Start'
										labelPlacement='outside'
										name='cycle_start'
										value={formState.cycle_start}
										onChange={handleInputChange}
										variant='bordered'
										radius='sm'
										size='lg'
										className='w-full'
										isRequired
										isInvalid={!!dateErrors.cycle_start}
										errorMessage={dateErrors.cycle_start}
										min={getCurrentDateTimeForInput()}
										description='Must be after current date and time'
									/>

									<Input
										type='datetime-local'
										label='Cycle End'
										labelPlacement='outside'
										name='cycle_end'
										value={formState.cycle_end}
										onChange={handleInputChange}
										variant='bordered'
										radius='sm'
										size='lg'
										className='w-full'
										isDisabled={formState.is_always_open}
										isRequired={!formState.is_always_open}
										isInvalid={!!dateErrors.cycle_end}
										errorMessage={dateErrors.cycle_end}
										min={formState.cycle_start}
										description={
											formState.is_always_open ? 'Not required when course is always open' : 'Must be after cycle start'
										}
									/>
								</div>
							</div>
						</form>
					</CardBody>

					<Divider />

					<CardFooter className='flex justify-between'>
						<Button color='danger' variant='light' onPress={() => navigate(`/courses/${course_id}`)} size='lg'>
							Cancel
						</Button>
						<Button
							color='primary'
							type='submit'
							form='cycle-create-form'
							isLoading={cycleFetcher.state === 'submitting'}
							isDisabled={!isFormValid()}
							size='lg'
						>
							Create Cycle
						</Button>
					</CardFooter>
				</Card>
			</div>
		</LMSLayout>
	);
}
