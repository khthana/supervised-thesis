import type { Attachment, Subtopic } from '@/interfaces/sharetype';
import { Button, Card, CardBody, Input, Textarea } from '@heroui/react';
import { FileText, Upload, X } from 'lucide-react';
import { type ChangeEvent, useState } from 'react';

interface AssignWorkProps {
	subtopic: Subtopic;
}

interface FileUpload {
	id: string;
	file: File;
	name: string;
	size: string;
	type: string;
	preview: string | null;
}

const AssignWork = ({ subtopic }: AssignWorkProps) => {
	const [files, setFiles] = useState<FileUpload[]>([]);
	const [answer, setAnswer] = useState<string>('');
	const [isDragging, setIsDragging] = useState<boolean>(false);

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
		const droppedFiles = Array.from(e.dataTransfer.files);
		handleFiles(droppedFiles);
	};

	const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const selectedFiles = Array.from(e.target.files);
			handleFiles(selectedFiles);
		}
	};

	const handleFiles = (newFiles: File[]) => {
		const processedFiles: FileUpload[] = newFiles.map((file) => ({
			file,
			id: Math.random().toString(36).substring(2, 11),
			name: file.name,
			size: formatFileSize(file.size),
			type: file.type,
			preview: null,
		}));

		for (const fileObj of processedFiles) {
			if (fileObj.file.type.startsWith('image/')) {
				const reader = new FileReader();
				reader.onload = (e) => {
					if (e.target?.result) {
						setFiles((prevFiles) =>
							prevFiles.map((f) => (f.id === fileObj.id ? { ...f, preview: e.target?.result as string } : f)),
						);
					}
				};
				reader.readAsDataURL(fileObj.file);
			}
		}

		setFiles((prev) => [...prev, ...processedFiles]);
	};

	const removeFile = (fileId: string) => {
		setFiles((prev) => prev.filter((file) => file.id !== fileId));
	};

	const formatFileSize = (bytes: number): string => {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
	};

	const handleSubmit = () => {
		// Implement submission logic here
		console.log('Submitting assignment:', {
			answer,
			files,
		});
	};

	const renderAttachments = (attachments: Attachment[]) => (
		<div className='space-y-2'>
			<h3 className='text-lg font-semibold'>Assignment Files</h3>
			{attachments.map((attachment) => (
				<div key={attachment.id} className='flex items-center gap-2 p-3 bg-default-100 rounded-lg'>
					<FileText className='text-default-500' size={20} />
					<div className='flex-1'>
						<p className='text-sm font-medium'>{attachment.title}</p>
						{attachment.size && <p className='text-xs text-default-500'>{attachment.size}</p>}
					</div>
					<Button
						as='a'
						href={attachment.url}
						target='_blank'
						rel='noopener noreferrer'
						size='sm'
						color='primary'
						variant='flat'
					>
						Download
					</Button>
				</div>
			))}
		</div>
	);

	return (
		<div className='space-y-6'>
			{/* Assignment Details */}
			<Card>
				<CardBody className='space-y-4'>
					<div className='flex justify-between items-start'>
						<div>
							<h2 className='text-xl font-bold'>{subtopic.title}</h2>
							{subtopic.assignmentContent?.dueDate && (
								<p className='text-default-500'>
									Due: {new Date(subtopic.assignmentContent.dueDate).toLocaleDateString()}
								</p>
							)}
						</div>
						<div className='text-right'>
							<p className='text-lg font-semibold'>{subtopic.assignmentContent?.maxScore} Points</p>
						</div>
					</div>

					<div className='prose max-w-none'>
						<p>{subtopic.assignmentContent?.description}</p>
					</div>

					{subtopic.assignmentContent?.attachments && subtopic.assignmentContent.attachments.length > 0 && (
						<div className='mt-4'>{renderAttachments(subtopic.assignmentContent.attachments)}</div>
					)}
				</CardBody>
			</Card>

			{/* Your Work */}
			<Card>
				<CardBody className='space-y-4'>
					<h3 className='text-lg font-semibold'>Your Work</h3>

					<Textarea
						label='Answer'
						placeholder='Type your answer here...'
						value={answer}
						onChange={(e) => setAnswer(e.target.value)}
						minRows={4}
					/>

					{/* File Upload Area */}
					<div
						className={`border-2 rounded-xl p-8 transition-colors
              ${isDragging ? 'border-primary border-dashed bg-primary-50' : 'border-dashed border-default-200'}
              ${files.length > 0 ? 'border-solid' : 'border-dashed'}`}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
					>
						<div className='flex flex-col items-center justify-center space-y-4'>
							<Upload size={48} className={isDragging ? 'text-primary' : 'text-default-400'} />
							<div className='text-center'>
								<p className='text-lg font-semibold text-default-700'>
									{isDragging ? 'Drop files here' : 'Drag and drop files here'}
								</p>
								<p className='text-sm text-default-500'>Supported files: PDF, DOCX, XLSX, CSV, JPG, PNG</p>
							</div>
							<label>
								<input
									type='file'
									className='hidden'
									multiple
									onChange={handleFileInput}
									accept='.pdf,.docx,.xlsx,.csv,.jpg,.jpeg,.png'
								/>
								<Button as='span' color='primary' variant='flat' className='cursor-pointer'>
									Browse Files
								</Button>
							</label>
						</div>
					</div>

					{/* Uploaded Files Preview */}
					{files.length > 0 && (
						<div className='space-y-3'>
							{files.map((file) => (
								<div key={file.id} className='flex items-center gap-4 p-4 bg-default-100 rounded-lg'>
									{file.preview ? (
										<img src={file.preview} alt={file.name} className='w-12 h-12 object-cover rounded' />
									) : (
										<FileText className='w-12 h-12 text-default-500' />
									)}
									<div className='flex-1'>
										<p className='text-sm font-medium'>{file.name}</p>
										<p className='text-sm text-default-500'>{file.size}</p>
									</div>
									<Button isIconOnly color='danger' variant='light' onPress={() => removeFile(file.id)}>
										<X size={20} />
									</Button>
								</div>
							))}
						</div>
					)}

					{/* Submit Button */}
					<div className='flex justify-end'>
						<Button color='primary' size='lg' onPress={handleSubmit}>
							Submit Assignment
						</Button>
					</div>
				</CardBody>
			</Card>
		</div>
	);
};

export default AssignWork;
