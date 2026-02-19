import type { Attachment } from '@/interfaces/sharetype';
import { Button, Card, CardBody } from '@heroui/react';
import { FileText, Image as ImageIcon, Upload, X } from 'lucide-react';
import { type ChangeEvent, type DragEvent, useRef, useState } from 'react';

interface FileUploadProps {
	onSave: (fileData: {
		id: string;
		title: string;
		type: 'file';
		attachments: Attachment[];
	}) => void;
	existingId?: string;
	existingTitle?: string;
	existingAttachments?: Attachment[];
}

interface FileObject {
	file: File;
	preview: string | null;
	id: string;
}

interface UploadProgress {
	[key: string]: number;
}

const FileUploadComponent = ({ onSave, existingId, existingTitle, existingAttachments }: FileUploadProps) => {
	const [files, setFiles] = useState<FileObject[]>([]);
	const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const selectedFiles = Array.from(event.target.files || []);
		addNewFiles(selectedFiles);
	};

	const handleDragOver = (event: DragEvent) => {
		event.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = (event: DragEvent) => {
		event.preventDefault();
		setIsDragging(false);
	};

	const handleDrop = (event: DragEvent) => {
		event.preventDefault();
		setIsDragging(false);
		const droppedFiles = Array.from(event.dataTransfer.files);
		addNewFiles(droppedFiles);
	};

	const addNewFiles = (newFiles: File[]) => {
		const updatedFiles = newFiles.map((file) => ({
			file,
			preview: getFilePreview(file),
			id: Math.random().toString(36).substr(2, 9),
		}));
		setFiles((prevFiles) => [...prevFiles, ...updatedFiles]);
	};

	const getFilePreview = (file: File): string | null => {
		if (file.type.startsWith('image/')) {
			return URL.createObjectURL(file);
		}
		return null;
	};

	const removeFile = (id: string) => {
		setFiles((prevFiles) => {
			const fileToRemove = prevFiles.find((f) => f.id === id);
			if (fileToRemove?.preview) {
				URL.revokeObjectURL(fileToRemove.preview);
			}
			return prevFiles.filter((file) => file.id !== id);
		});

		setUploadProgress((prev) => {
			const newProgress = { ...prev };
			delete newProgress[id];
			return newProgress;
		});
	};

	const formatFileSize = (bytes: number): string => {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
	};

	const getFileIcon = (fileType: string) => {
		if (fileType.startsWith('image/')) return <ImageIcon className='w-12 h-12' />;
		return <FileText className='w-12 h-12' />;
	};

	const handleSave = async () => {
		// Simulate file upload progress
		for (const fileObj of files) {
			setUploadProgress((prev) => ({ ...prev, [fileObj.id]: 0 }));

			// Simulate upload progress
			for (let i = 0; i <= 100; i += 10) {
				setUploadProgress((prev) => ({
					...prev,
					[fileObj.id]: i,
				}));
				await new Promise((resolve) => setTimeout(resolve, 100));
			}
		}

		// Convert files to attachments
		const attachments: Attachment[] = files.map((fileObj, index) => ({
			id: index + 1,
			title: fileObj.file.name,
			type: fileObj.file.type.includes('pdf') ? 'pdf' : 'docx',
			url: fileObj.preview || '',
			description: `Uploaded file: ${fileObj.file.name}`,
			size: formatFileSize(fileObj.file.size),
		}));

		// Call onSave with the processed data
		onSave({
			id: existingId || `file-${Date.now()}`,
			title: existingTitle || 'Uploaded Files',
			type: 'file',
			attachments,
		});

		// Reset state
		setFiles([]);
		setUploadProgress({});
	};

	return (
		<Card className='w-full'>
			<CardBody className='space-y-4'>
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
								ref={fileInputRef}
								className='hidden'
								multiple
								onChange={handleFileChange}
								accept='.pdf,.docx,.xlsx,.csv,.jpg,.jpeg,.png'
							/>
							<Button as='span' color='primary' variant='flat' className='cursor-pointer'>
								Browse Files
							</Button>
						</label>
					</div>
				</div>

				{/* File Preview */}
				{files.length > 0 && (
					<div className='space-y-3'>
						{files.map((file) => (
							<div key={file.id} className='flex items-center gap-4 p-4 bg-default-100 rounded-lg'>
								{file.preview ? (
									<img src={file.preview} alt={file.file.name} className='w-12 h-12 object-cover rounded' />
								) : (
									getFileIcon(file.file.type)
								)}
								<div className='flex-1'>
									<p className='text-sm font-medium'>{file.file.name}</p>
									<p className='text-sm text-default-500'>{formatFileSize(file.file.size)}</p>
									{uploadProgress[file.id] !== undefined && (
										<div className='w-full bg-default-200 rounded-full h-1.5 mt-2'>
											<div
												className='bg-primary h-1.5 rounded-full transition-all duration-300'
												style={{ width: `${uploadProgress[file.id]}%` }}
											/>
										</div>
									)}
								</div>
								<Button isIconOnly color='danger' variant='light' onPress={() => removeFile(file.id)}>
									<X size={20} />
								</Button>
							</div>
						))}
					</div>
				)}

				{files.length > 0 && (
					<div className='flex justify-end'>
						<Button color='primary' onPress={handleSave}>
							Upload Files
						</Button>
					</div>
				)}
			</CardBody>
		</Card>
	);
};

export default FileUploadComponent;
