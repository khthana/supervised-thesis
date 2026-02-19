import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	Snippet,
	Tab,
	Tabs,
} from '@heroui/react';
import { Check, Copy, Upload, X } from 'lucide-react';
import { useCallback, useState } from 'react';

type AddPeopleProps = {
	onClose: () => void;
};

export default function AddPeople({ onClose }: AddPeopleProps) {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [studentId, setStudentId] = useState('');
	const [staffId, setStaffId] = useState('');
	const [isDragging, setIsDragging] = useState(false);
	const [showAlert, setShowAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState('');
	const inviteCode = 'STU24XY';

	const handleDrag = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === 'dragenter' || e.type === 'dragover') {
			setIsDragging(true);
		} else if (e.type === 'dragleave') {
			setIsDragging(false);
		}
	}, []);

	const handleDrop = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);

		const file = e.dataTransfer.files[0];
		if (file) {
			const extension = file.name.split('.').pop()?.toLowerCase();
			if (extension && ['csv', 'xlsx'].includes(extension)) {
				setSelectedFile(file);
			} else {
				alert('Please upload only CSV or XLSX files');
			}
		}
	}, []);

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const extension = file.name.split('.').pop()?.toLowerCase();
			if (extension && ['csv', 'xlsx'].includes(extension)) {
				setSelectedFile(file);
			} else {
				alert('Please upload only CSV or XLSX files');
			}
		}
	};

	const handleUploadFile = () => {
		if (selectedFile) {
			console.log('Uploading file:', selectedFile);
		}
	};

	const handleStudentIdSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (studentId.trim()) {
			setAlertMessage(`Successfully added student with ID: ${studentId}`);
			setShowAlert(true);
			setStudentId('');
			setTimeout(() => {
				setShowAlert(false);
				onClose();
			}, 3000);
		}
	};

	const handleStaffIdSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (staffId.trim()) {
			setAlertMessage(`Successfully added staff with ID: ${staffId}`);
			setShowAlert(true);
			setStaffId('');
			setTimeout(() => {
				setShowAlert(false);
				onClose();
			}, 3000);
		}
	};

	return (
		<div className='space-y-6'>
			{/* Alert Notification */}
			<Modal
				isOpen={showAlert}
				onClose={() => setShowAlert(false)}
				placement='top'
				backdrop='transparent'
				className='bg-success'
				classNames={{
					wrapper: 'items-start pt-4',
				}}
				motionProps={{
					variants: {
						enter: {
							y: 0,
							opacity: 1,
							transition: { duration: 0.3 },
						},
						exit: {
							y: -20,
							opacity: 0,
							transition: { duration: 0.2 },
						},
					},
				}}
			>
				<ModalContent>
					<ModalBody className='py-3'>
						<div className='flex items-center gap-2 text-white'>
							<Check size={18} />
							<p>{alertMessage}</p>
						</div>
					</ModalBody>
				</ModalContent>
			</Modal>

			<Tabs aria-label='Upload options' className='w-full' size='lg'>
				<Tab key='student' title='Student' className='w-full'>
					<div className='space-y-6 py-4'>
						{/* Individual Student Upload */}
						<Card>
							<CardHeader className='px-6 py-4'>
								<h2 className='text-xl font-semibold'>Add Individual Student</h2>
							</CardHeader>
							<CardBody className='px-6 py-4'>
								<form onSubmit={handleStudentIdSubmit} className='flex gap-4'>
									<Input
										placeholder='Student ID'
										value={studentId}
										onChange={(e) => setStudentId(e.target.value)}
										className='flex-1'
									/>
									<Button color='primary' type='submit'>
										Add Student
									</Button>
								</form>
							</CardBody>
						</Card>

						{/* Bulk Upload */}
						<Card>
							<CardHeader className='px-6 py-4'>
								<h2 className='text-xl font-semibold'>File Upload</h2>
							</CardHeader>
							<CardBody className='px-6 py-4'>
								<div
									onDragEnter={handleDrag}
									onDragLeave={handleDrag}
									onDragOver={handleDrag}
									onDrop={handleDrop}
									className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
										isDragging ? 'border-primary bg-primary-50' : 'border-gray-300 hover:border-gray-400'
									}`}
								>
									<input
										type='file'
										onChange={handleFileSelect}
										accept='.csv,.xlsx'
										className='hidden'
										id='fileInput'
									/>
									<label htmlFor='fileInput' className='cursor-pointer'>
										<Upload className='mx-auto h-12 w-12 text-gray-400' />
										<p className='mt-2 text-sm text-gray-600'>
											Drag and drop your file here, or <span className='text-primary'>browse</span>
										</p>
										<p className='mt-1 text-xs text-gray-500'>Supports CSV and XLSX files</p>
									</label>
								</div>

								{selectedFile && (
									<div className='mt-4 flex items-center justify-between bg-default-100 p-3 rounded-lg'>
										<span className='text-sm'>{selectedFile.name}</span>
										<div className='flex gap-2'>
											<Button color='primary' size='sm' onPress={handleUploadFile}>
												Upload
											</Button>
											<Button isIconOnly variant='light' size='sm' onPress={() => setSelectedFile(null)}>
												<X size={16} />
											</Button>
										</div>
									</div>
								)}
							</CardBody>
						</Card>

						{/* Invite Code */}
						{/* <Card>
                <CardHeader className="px-6 py-4">
                    <h2 className="text-xl font-semibold">Invite Code</h2>
                </CardHeader>
                <CardBody className="px-6 py-4">
                    <div className="space-y-4">
                    <Snippet
                        symbol=""
                        variant="bordered"
                        className="text-center text-xl"
                        copyIcon={<Copy size={18} />}
                        checkIcon={<Check size={18} />}
                    >
                        {inviteCode}
                    </Snippet>
                    <p className="text-sm text-gray-500 text-center">
                        Share this code with students to invite them
                    </p>
                    </div>
                </CardBody>
                </Card> */}
					</div>
				</Tab>

				<Tab key='staff' title='Staff'>
					<div className='py-4'>
						{/* Individual Staff Upload */}
						<Card>
							<CardHeader className='px-6 py-4'>
								<h2 className='text-xl font-semibold'>Add Individual Student</h2>
							</CardHeader>
							<CardBody className='px-6 py-4'>
								<form onSubmit={handleStaffIdSubmit} className='flex gap-4'>
									<Input
										placeholder='Staff ID'
										value={staffId}
										onChange={(e) => setStaffId(e.target.value)}
										className='flex-1'
									/>
									<Button color='primary' type='submit'>
										Add Staff
									</Button>
								</form>
							</CardBody>
						</Card>
					</div>
				</Tab>
			</Tabs>
		</div>
	);
}
