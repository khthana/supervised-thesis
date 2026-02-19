import type { Attachment } from '@/interfaces/sharetype';
import { Button, Card, CardBody, Input, Select, SelectItem, Tab, Tabs, Textarea } from '@heroui/react';
import { BookOpen, Code, FileText, Upload, X } from 'lucide-react';
import { useState } from 'react';

interface AssignmentViewProps {
	onSave: (assignmentData: {
		type: 'work' | 'code';
		description: string;
		dueDate: string;
		maxScore: number;
		attachments?: Attachment[];
		testCases?: TestCase[];
		programmingLanguage?: string;
	}) => void;
	existingAssignment?: {
		type: 'work' | 'code';
		description: string;
		dueDate: string;
		maxScore: number;
		attachments?: Attachment[];
		testCases?: TestCase[];
		programmingLanguage?: string;
	};
}

interface TestCase {
	id: number;
	name: string;
	input: string;
	language: string;
}

const PROGRAMMING_LANGUAGES = [
	{ label: 'Python', value: 'python' },
	{ label: 'Java', value: 'java' },
	{ label: 'C++', value: 'cpp' },
];

const AssignmentCreator: React.FC<AssignmentViewProps> = ({ onSave, existingAssignment }) => {
	const [selectedType, setSelectedType] = useState<'work' | 'code'>(existingAssignment?.type || 'work');
	const [description, setDescription] = useState(existingAssignment?.description || '');
	const [dueDate, setDueDate] = useState(existingAssignment?.dueDate || '');
	const [maxScore, setMaxScore] = useState(existingAssignment?.maxScore?.toString() || '10');
	const [files, setFiles] = useState<Attachment[]>(existingAssignment?.attachments || []);
	const [programmingLanguage, setProgrammingLanguage] = useState(existingAssignment?.programmingLanguage || 'python');
	const [testCases, setTestCases] = useState<TestCase[]>(
		existingAssignment?.testCases || [{ id: 1, name: '', input: '', language: programmingLanguage }],
	);
	const [isDragging, setIsDragging] = useState(false);

	const handleSubmit = () => {
		onSave({
			type: selectedType,
			description,
			dueDate,
			maxScore: Number(maxScore),
			attachments: files,
			testCases: selectedType === 'code' ? testCases : undefined,
			programmingLanguage: selectedType === 'code' ? programmingLanguage : undefined,
		});
	};

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

	const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const selectedFiles = Array.from(e.target.files);
			handleFiles(selectedFiles);
		}
	};

	const handleFiles = (newFiles: File[]) => {
		const processedFiles: Attachment[] = newFiles.map((file, index) => ({
			id: files.length + index + 1,
			title: file.name,
			type: file.type.includes('pdf') ? 'pdf' : 'docx',
			url: URL.createObjectURL(file),
			description: `Uploaded file: ${file.name}`,
			size: formatFileSize(file.size),
		}));

		setFiles((prev) => [...prev, ...processedFiles]);
	};

	const removeFile = (id: number) => {
		setFiles((prev) => prev.filter((file) => file.id !== id));
	};

	const formatFileSize = (bytes: number): string => {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
	};

	const addTestCase = () => {
		setTestCases((prev) => [
			...prev,
			{
				id: prev.length + 1,
				name: '',
				input: '',
				language: programmingLanguage,
			},
		]);
	};

	const removeTestCase = (id: number) => {
		setTestCases((prev) => prev.filter((tc) => tc.id !== id));
	};

	const updateTestCase = (id: number, field: 'name' | 'input', value: string) => {
		setTestCases((prev) => prev.map((tc) => (tc.id === id ? { ...tc, [field]: value } : tc)));
	};

	const renderWorkAssignment = () => (
		<div className='space-y-4'>
			<div className='space-y-4'>
				<Input type='date' label='Due Date' value={dueDate} onChange={(e) => setDueDate(e.target.value)} />

				<Input type='number' label='Maximum Score' value={maxScore} onChange={(e) => setMaxScore(e.target.value)} />

				<Textarea
					label='Description'
					placeholder='Enter assignment description'
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					minRows={4}
				/>
			</div>

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
						<p className='text-sm text-default-500'>Supported files: PDF, DOCX</p>
					</div>
					<label>
						<input type='file' className='hidden' multiple onChange={handleFileInput} accept='.pdf,.docx' />
						<Button as='span' color='primary' variant='flat' className='cursor-pointer'>
							Browse Files
						</Button>
					</label>
				</div>
			</div>

			{files.length > 0 && (
				<div className='space-y-3'>
					{files.map((file) => (
						<div key={file.id} className='flex items-center gap-4 p-4 bg-default-100 rounded-lg'>
							<FileText className='w-12 h-12 text-default-500' />
							<div className='flex-1'>
								<p className='text-sm font-medium'>{file.title}</p>
								<p className='text-sm text-default-500'>{file.size}</p>
							</div>
							<Button isIconOnly color='danger' variant='light' onPress={() => removeFile(file.id)}>
								<X size={20} />
							</Button>
						</div>
					))}
				</div>
			)}
		</div>
	);

	const renderCodeAssignment = () => (
		<div className='space-y-4'>
			<div className='space-y-4'>
				<Input type='date' label='Due Date' value={dueDate} onChange={(e) => setDueDate(e.target.value)} />

				<Input type='number' label='Maximum Score' value={maxScore} onChange={(e) => setMaxScore(e.target.value)} />

				<Select
					label='Programming Language'
					value={programmingLanguage}
					onChange={(e) => setProgrammingLanguage(e.target.value)}
					className='w-full'
				>
					{PROGRAMMING_LANGUAGES.map((lang) => (
						<SelectItem key={lang.value} value={lang.value}>
							{lang.label}
						</SelectItem>
					))}
				</Select>

				<Textarea
					label='Description'
					placeholder='Enter coding assignment description'
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					minRows={4}
				/>

				<div className='space-y-4'>
					<div className='flex justify-between items-center'>
						<h3 className='text-lg font-semibold'>Test Cases</h3>
						<Button color='primary' variant='flat' onPress={addTestCase} size='sm'>
							Add Test Case
						</Button>
					</div>

					{testCases.map((testCase) => (
						<div key={testCase.id} className='p-4 border rounded-lg space-y-3 bg-default-50'>
							<div className='flex justify-between items-center'>
								<h4 className='font-medium'>Test Case {testCase.id}</h4>
								<Button isIconOnly color='danger' variant='light' size='sm' onPress={() => removeTestCase(testCase.id)}>
									<X size={20} />
								</Button>
							</div>
							<Input
								label='Test Case Name'
								placeholder='Enter test case name or description'
								value={testCase.name}
								onChange={(e) => updateTestCase(testCase.id, 'name', e.target.value)}
							/>
							<Textarea
								label='Input'
								placeholder='Enter test case input'
								value={testCase.input}
								onChange={(e) => updateTestCase(testCase.id, 'input', e.target.value)}
								minRows={6}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);

	return (
		<Card>
			<CardBody className='space-y-6'>
				<Tabs selectedKey={selectedType} onSelectionChange={(key) => setSelectedType(key as 'work' | 'code')}>
					<Tab
						key='work'
						title={
							<div className='flex items-center space-x-2'>
								<BookOpen size={18} />
								<span>Assignment Work</span>
							</div>
						}
					>
						{renderWorkAssignment()}
					</Tab>
					<Tab
						key='code'
						title={
							<div className='flex items-center space-x-2'>
								<Code size={18} />
								<span>Coding Assignment</span>
							</div>
						}
					>
						{renderCodeAssignment()}
					</Tab>
				</Tabs>

				<div className='flex justify-end'>
					<Button color='primary' onPress={handleSubmit}>
						{existingAssignment ? 'Update Assignment' : 'Create Assignment'}
					</Button>
				</div>
			</CardBody>
		</Card>
	);
};

export default AssignmentCreator;
