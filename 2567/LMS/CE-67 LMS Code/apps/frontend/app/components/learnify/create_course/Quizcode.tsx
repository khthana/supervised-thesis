import {
	Button,
	Card,
	CardBody,
	Checkbox,
	Divider,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Progress,
	Radio,
	RadioGroup,
	Switch,
	Tab,
	Tabs,
	useDisclosure,
} from '@heroui/react';
import { BarChart, BookOpen, Eye, GripVertical, Image as ImageIcon, Plus, Save, Trash2, Users, X } from 'lucide-react';
import { useCallback, useState } from 'react';

import { mockQuiz } from '@/components/mockup/mockupdata';
import { QuestionTypes } from '@/components/mockup/mockupdata';
import ImageUploadPreview from './ImageUploadPreview';
import QuizResponseReview from './QuizResponseReview';
import QuizSettings from './Quizsetting';

/* =======================================================
  	Type Interfaces ที่ใช้ใน Quiz
======================================================= */
interface QuizImage {
	imageData: string;
	dimensions: {
		width: number;
		height: number;
	};
}

interface Question {
	id: number;
	question: string;
	type: 'radio' | 'checkbox' | 'shortAnswer';
	correctAnswer: string | string[];
	options?: { id: number; text: string }[];
	questionImage?: string | null;
}

interface MockQuiz {
	questions: Question[];
	pointsPerQuestion: Record<number, number>;
}

export interface QuizOption {
	id: string;
	text: string;
	image: QuizImage | null;
}

export interface MultipleChoiceQuestion {
	id: number;
	type: 'radio';
	question: string;
	questionImage: QuizImage | null;
	options: QuizOption[];
	correctAnswer: string;
}

export interface MultipleAnswerQuestion {
	id: number;
	type: 'checkbox';
	question: string;
	questionImage: QuizImage | null;
	options: QuizOption[];
	correctAnswer: string[];
}

export interface ShortAnswerQuestion {
	id: number;
	type: 'short_answer';
	question: string;
	questionImage: QuizImage | null;
	options: QuizOption[]; // ปกติจะเป็น array ว่าง
	correctAnswer: string;
}

export type QuizQuestion = MultipleChoiceQuestion | MultipleAnswerQuestion | ShortAnswerQuestion;

export interface Settings {
	randomizeQuestions: boolean;
	randomizeOptions: boolean;
	showScoreImmediately: boolean;
	showIncorrectAnswers: boolean;
	allowReview: boolean;
	enableTimer: boolean;
	onChange?: (newSettings: Settings) => void;
	onSave?: () => void;
}

interface QuizCodeProps {
	onSave: (quizData: { code: string; image: string | null; selectedTest: number | null }) => void;
	existingContent?: string;
}

/* =======================================================
   Component ย่อย: CustomInput
======================================================= */
interface CustomInputProps {
	value: string;
	onChange: (value: string) => void;
	placeholder: string;
	label?: string;
	labelPlacement?: 'inside' | 'outside';
	className?: string;
	disabled?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
	value,
	onChange,
	placeholder,
	label,
	labelPlacement = 'inside',
	className = '',
	disabled = false,
}) => {
	return (
		<div className={`relative ${className}`}>
			{labelPlacement === 'outside' && label && (
				<label htmlFor={placeholder} className='block text-sm font-medium text-gray-700 mb-1'>
					{label}
				</label>
			)}
			<input
				id={placeholder}
				type='text'
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				disabled={disabled}
				className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
					disabled ? 'bg-gray-100' : ''
				}`}
			/>
			{labelPlacement === 'inside' && label && (
				<label htmlFor={placeholder} className='absolute left-2 top-2 text-sm text-gray-500'>
					{label}
				</label>
			)}
		</div>
	);
};

/* =======================================================
   Component ย่อย: QuestionOption
======================================================= */
interface QuestionOptionProps {
	question: QuizQuestion;
	option: QuizOption;
	onOptionChange: (questionId: number, optionId: string, value: string) => void;
	onImageUpload: (
		questionId: number,
		optionId: string | null,
		imageData: { imageData: string; dimensions: { width: number; height: number } },
	) => void;
	onRemoveImage: (questionId: number, optionId: string | null) => void;
	onRemoveOption: (questionId: number, optionId: string) => void;
	isCorrectAnswer: boolean;
	onAnswerChange: (value: boolean) => void;
	previewMode: boolean;
}

const QuestionOption: React.FC<QuestionOptionProps> = ({
	question,
	option,
	onOptionChange,
	onImageUpload,
	onRemoveImage,
	onRemoveOption,
	isCorrectAnswer,
	onAnswerChange,
	previewMode,
}) => {
	const [imageDimensions, setImageDimensions] = useState({ width: 300, height: 200 });

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				onImageUpload(question.id, option.id, {
					imageData: reader.result as string,
					dimensions: imageDimensions,
				});
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className='space-y-2'>
			<div className='flex items-center gap-4'>
				<div className='w-8'>
					{question.type === QuestionTypes.RADIO ? (
						<Radio value={option.id} checked={isCorrectAnswer} isDisabled={previewMode}>
							{option.id}
						</Radio>
					) : (
						<Checkbox
							value={option.id}
							isSelected={isCorrectAnswer}
							onValueChange={(checked) => onAnswerChange(checked)}
							isDisabled={previewMode}
						>
							{option.id}
						</Checkbox>
					)}
				</div>
				<CustomInput
					value={option.text}
					onChange={(value) => onOptionChange(question.id, option.id, value)}
					placeholder={`Option ${option.id}`}
					className='flex-1'
					disabled={previewMode}
				/>
				<div className={`flex gap-2 ${previewMode ? 'hidden' : ''}`}>
					<input
						type='file'
						accept='image/*'
						onChange={handleImageUpload}
						className='hidden'
						id={`option-image-${question.id}-${option.id}`}
					/>
					<Button
						isIconOnly
						color='primary'
						variant='light'
						onClick={() => {
							const inputElement = document.getElementById(`option-image-${question.id}-${option.id}`);
							if (inputElement) inputElement.click();
						}}
					>
						<ImageIcon className='h-4 w-4' />
					</Button>
					{question.options.length > 2 && (
						<Button isIconOnly color='danger' variant='light' onClick={() => onRemoveOption(question.id, option.id)}>
							<X className='h-4 w-4' />
						</Button>
					)}
				</div>
			</div>
			{option.image && (
				<div className='ml-12'>
					<ImageUploadPreview
						src={option.image.imageData}
						onRemove={() => onRemoveImage(question.id, option.id)}
						previewMode={previewMode}
						onDimensionsChange={(dimensions) => {
							setImageDimensions(dimensions);
							onImageUpload(question.id, option.id, {
								imageData: option.image?.imageData ?? '',
								dimensions,
							});
						}}
						initialDimensions={option.image.dimensions || imageDimensions}
					/>
				</div>
			)}
		</div>
	);
};

/* =======================================================
   Component หลัก: QuizCreator
======================================================= */
const QuizCode: React.FC<QuizCodeProps> = ({ onSave, existingContent }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [summaryMode, setSummaryMode] = useState(false);
	const [selectedTab, setSelectedTab] = useState('edit');
	const [quizTitle, setQuizTitle] = useState(mockQuiz.title);
	const [questions, setQuestions] = useState<QuizQuestion[]>(
		mockQuiz.questions.map((q) => {
			// Convert the mockQuiz questions to the proper QuizQuestion type
			if (q.type === 'radio') {
				return {
					id: q.id,
					type: 'radio' as const,
					question: q.question,
					questionImage: q.questionImage
						? {
								imageData: q.questionImage,
								dimensions: { width: 300, height: 200 },
							}
						: null,
					options:
						q.options?.map((opt) => ({
							id: String.fromCharCode(64 + Number(opt.id)), // Convert numeric ID to letter (1 -> A, 2 -> B, etc)
							text: opt.text,
							image: null,
						})) || [],
					correctAnswer: typeof q.correctAnswer === 'string' ? q.correctAnswer : '',
				};
			}

			if (q.type === 'checkbox') {
				return {
					id: q.id,
					type: 'checkbox' as const,
					question: q.question,
					questionImage: q.questionImage
						? {
								imageData: q.questionImage,
								dimensions: { width: 300, height: 200 },
							}
						: null,
					options:
						q.options?.map((opt) => ({
							id: String.fromCharCode(64 + Number(opt.id)),
							text: opt.text,
							image: null,
						})) || [],
					correctAnswer: Array.isArray(q.correctAnswer) ? q.correctAnswer : [],
				};
			}

			// shortAnswer type (default case)
			return {
				id: q.id,
				type: 'short_answer' as const,
				question: q.question,
				questionImage: q.questionImage
					? {
							imageData: q.questionImage,
							dimensions: { width: 300, height: 200 },
						}
					: null,
				options: [],
				correctAnswer: typeof q.correctAnswer === 'string' ? q.correctAnswer : '',
			};
		}),
	);
	const [pointsPerQuestion, setPointsPerQuestion] = useState<{ [key: string]: number }>({
		...mockQuiz.pointsPerQuestion,
	});
	const [previewMode, setPreviewMode] = useState(false);

	const [responses] = useState([
		{
			studentId: 'STD001',
			studentName: 'John Doe',
			submittedAt: new Date().toISOString(),
			answers: {
				'1': 'A',
				'2': ['A', 'B'],
				'3': 'This is a short answer response',
			},
			timeSpent: 1200,
		},
	]);

	// Helper function สำหรับ update ข้อมูลของ question ทีละตัว
	const updateQuestion = useCallback((questionId: number, updater: (q: QuizQuestion) => QuizQuestion) => {
		setQuestions((prev) => prev.map((q) => (q.id === questionId ? updater(q) : q)));
	}, []);

	const handleSingleAnswerChange = (questionId: number, value: string): void => {
		updateQuestion(questionId, (q) =>
			q.type === 'radio' || q.type === 'short_answer' ? { ...q, correctAnswer: value } : q,
		);
	};

	const handleCheckboxAnswerChange = (questionId: number, optionId: string, isChecked: boolean): void => {
		updateQuestion(questionId, (q) => {
			if (q.type === 'checkbox') {
				const currentAnswers = Array.isArray(q.correctAnswer) ? q.correctAnswer : [];
				const newAnswers = isChecked ? [...currentAnswers, optionId] : currentAnswers.filter((a) => a !== optionId);
				return { ...q, correctAnswer: newAnswers };
			}
			return q;
		});
	};

	const handleOptionChange = (questionId: number, optionId: string, value: string): void => {
		updateQuestion(questionId, (q) => ({
			...q,
			options: q.options.map((opt) => (opt.id === optionId ? { ...opt, text: value } : opt)),
		}));
	};

	const handleImageUpload = (
		questionId: number,
		optionId: string | null,
		imageData: { imageData: string; dimensions: { width: number; height: number } },
	): void => {
		updateQuestion(questionId, (q) => {
			if (optionId === null) {
				return { ...q, questionImage: imageData };
			}
			return {
				...q,
				options: q.options.map((opt) => (opt.id === optionId ? { ...opt, image: imageData } : opt)),
			};
		});
	};

	const removeImage = (questionId: number, optionId: string | null = null): void => {
		updateQuestion(questionId, (q) => {
			if (optionId === null) {
				return { ...q, questionImage: null };
			}
			return {
				...q,
				options: q.options.map((opt) => (opt.id === optionId ? { ...opt, image: null } : opt)),
			};
		});
	};

	const addOption = (questionId: number): void => {
		updateQuestion(questionId, (q) => {
			if (q.type !== QuestionTypes.SHORT_ANSWER && q.options.length < 26) {
				const newOptionIndex = q.options.length;
				return {
					...q,
					options: [
						...q.options,
						{
							id: String.fromCharCode(65 + newOptionIndex),
							text: '',
							image: null,
						},
					],
				};
			}
			return q;
		});
	};

	const removeOption = (questionId: number, optionId: string): void => {
		updateQuestion(questionId, (q) => {
			if (q.type !== 'short_answer' && q.options.length > 2) {
				const newOptions = q.options
					.filter((opt) => opt.id !== optionId)
					.map((opt, index) => ({ ...opt, id: String.fromCharCode(65 + index) }));
				if (q.type === 'checkbox') {
					const newCorrectAnswer = (q.correctAnswer as string[]).filter((a) => a !== optionId);
					return { ...q, options: newOptions, correctAnswer: newCorrectAnswer } as MultipleAnswerQuestion;
				}
				const newCorrectAnswer = q.correctAnswer === optionId ? '' : q.correctAnswer;
				return { ...q, options: newOptions, correctAnswer: newCorrectAnswer } as MultipleChoiceQuestion;
			}
			return q;
		});
	};

	const handleQuestionImageDimensionsChange = (questionId: number, dimensions: { width: number; height: number }) => {
		updateQuestion(questionId, (q) => {
			if (q.questionImage) {
				return { ...q, questionImage: { ...q.questionImage, dimensions } };
			}
			return q;
		});
	};

	interface CreateNewQuestionProps {
		type: keyof typeof QuestionTypes;
		points?: number;
	}

	const createNewQuestion = ({ type, points = 1 }: CreateNewQuestionProps): void => {
		const questionId = questions.length + 1;
		setPointsPerQuestion((prev) => ({
			...prev,
			[questionId.toString()]: points,
		}));

		let newQuestion: QuizQuestion;
		if (type === QuestionTypes.RADIO) {
			newQuestion = {
				id: questionId,
				type: 'radio',
				question: '',
				questionImage: null,
				options: [
					{ id: 'A', text: '', image: null },
					{ id: 'B', text: '', image: null },
				],
				correctAnswer: '',
			};
		} else if (type === QuestionTypes.CHECKBOX) {
			newQuestion = {
				id: questionId,
				type: 'checkbox',
				question: '',
				questionImage: null,
				options: [
					{ id: 'A', text: '', image: null },
					{ id: 'B', text: '', image: null },
				],
				correctAnswer: [],
			};
		} else if (type === QuestionTypes.SHORT_ANSWER) {
			newQuestion = {
				id: questionId,
				type: 'short_answer',
				question: '',
				questionImage: null,
				options: [],
				correctAnswer: '',
			};
		}
		setQuestions((prev) => [...prev, newQuestion]);
		onClose();
	};

	const prepareQuizData = (): MockQuiz => {
		return {
			pointsPerQuestion: Object.keys(pointsPerQuestion).reduce(
				(acc, key) => {
					acc[Number(key)] = pointsPerQuestion[key];
					return acc;
				},
				{} as Record<number, number>,
			),
			questions: questions.map((q) => ({
				id: q.id,
				type: q.type === 'short_answer' ? 'shortAnswer' : q.type,
				question: q.question,
				questionImage: q.questionImage ? q.questionImage.imageData : null,
				options: q.options
					? q.options.map((opt) => ({
							id: opt.id.charCodeAt(0) - 64,
							text: opt.text,
						}))
					: [],
				correctAnswer: q.correctAnswer,
			})),
		};
	};

	const handleSaveQuiz = (): void => {
		const quizData = prepareQuizData();
		console.log('Quiz Data:', JSON.stringify(quizData, null, 2));
	};

	const QuestionTypeSelector = () => (
		<div className='grid grid-cols-1 gap-4'>
			<Button
				color='primary'
				variant='flat'
				onClick={() => createNewQuestion({ type: QuestionTypes.RADIO as 'RADIO' })}
			>
				Multiple Choice Question
			</Button>
			<Button
				color='primary'
				variant='flat'
				onClick={() => createNewQuestion({ type: QuestionTypes.CHECKBOX as 'CHECKBOX' })}
			>
				Multiple Answer Question
			</Button>
			<Button
				color='primary'
				variant='flat'
				onClick={() => createNewQuestion({ type: QuestionTypes.SHORT_ANSWER as 'SHORT_ANSWER' })}
			>
				Short Answer Question
			</Button>
		</div>
	);

	const QuizSummary = () => {
		const totalQuestions = questions.length;
		const questionTypeCount = questions.reduce(
			(acc, q) => {
				acc[q.type] = (acc[q.type] || 0) + 1;
				return acc;
			},
			{} as { [key: string]: number },
		);

		const totalPoints = Object.values(pointsPerQuestion).reduce((sum, p) => sum + p, 0);

		return (
			<div className='space-y-6 p-6'>
				<h2 className='text-2xl font-bold'>Quiz Summary</h2>
				<div className='space-y-4'>
					<div>
						<h3 className='text-lg font-semibold mb-2'>Basic Information</h3>
						<p>Quiz Title: {quizTitle}</p>
						<p>Total Questions: {totalQuestions}</p>
						<p>Total Points: {totalPoints}</p>
					</div>
					<Divider />
					<div>
						<h3 className='text-lg font-semibold mb-2'>Question Types Distribution</h3>
						<div className='space-y-2'>
							<div>
								<p>Multiple Choice Questions: {questionTypeCount[QuestionTypes.RADIO] || 0}</p>
								<Progress
									value={((questionTypeCount[QuestionTypes.RADIO] || 0) / totalQuestions) * 100}
									color='primary'
									className='mt-1'
								/>
							</div>
							<div>
								<p>Multiple Answer Questions: {questionTypeCount[QuestionTypes.CHECKBOX] || 0}</p>
								<Progress
									value={((questionTypeCount[QuestionTypes.CHECKBOX] || 0) / totalQuestions) * 100}
									color='secondary'
									className='mt-1'
								/>
							</div>
							<div>
								<p>Short Answer Questions: {questionTypeCount[QuestionTypes.SHORT_ANSWER] || 0}</p>
								<Progress
									value={((questionTypeCount[QuestionTypes.SHORT_ANSWER] || 0) / totalQuestions) * 100}
									color='success'
									className='mt-1'
								/>
							</div>
						</div>
					</div>
					<Divider />
					<div>
						<h3 className='text-lg font-semibold mb-2'>Media Content</h3>
						<p>Questions with Images: {questions.filter((q) => q.questionImage).length}</p>
						<p>
							Options with Images:{' '}
							{questions.reduce((count, q) => count + q.options.filter((opt) => opt.image !== null).length, 0)}
						</p>
					</div>
				</div>
			</div>
		);
	};

	const renderQuestionContent = (question: QuizQuestion) => {
		switch (question.type) {
			case QuestionTypes.RADIO:
				return (
					<RadioGroup
						value={question.correctAnswer as string}
						onValueChange={(value: string) => handleSingleAnswerChange(question.id, value)}
						isDisabled={previewMode}
					>
						<div className='space-y-4'>
							{question.options.map((option: QuizOption) => (
								<QuestionOption
									key={option.id}
									question={question}
									option={option}
									onOptionChange={handleOptionChange}
									onImageUpload={handleImageUpload}
									onRemoveImage={removeImage}
									onRemoveOption={removeOption}
									isCorrectAnswer={question.correctAnswer === option.id}
									onAnswerChange={(value: boolean) => handleSingleAnswerChange(question.id, value ? option.id : '')}
									previewMode={previewMode}
								/>
							))}
						</div>
					</RadioGroup>
				);

			case QuestionTypes.CHECKBOX:
				return (
					<div className='space-y-4'>
						{question.options.map((option: QuizOption) => (
							<QuestionOption
								key={option.id}
								question={question}
								option={option}
								onOptionChange={handleOptionChange}
								onImageUpload={handleImageUpload}
								onRemoveImage={removeImage}
								onRemoveOption={removeOption}
								isCorrectAnswer={(question.correctAnswer as string[]).includes(option.id)}
								onAnswerChange={(checked: boolean) => handleCheckboxAnswerChange(question.id, option.id, checked)}
								previewMode={previewMode}
							/>
						))}
					</div>
				);

			case QuestionTypes.SHORT_ANSWER:
				return (
					<div className='space-y-4'>
						<CustomInput
							value={question.correctAnswer as string}
							onChange={(value: string) => handleSingleAnswerChange(question.id, value)}
							placeholder='Enter the correct answer'
							className='ml-10'
							disabled={previewMode}
						/>
						<p className='text-sm text-gray-500 ml-10'>
							Note: Short answers will require manual grading for partial credit
						</p>
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<div className='min-h-screen bg-gray-50 p-6'>
			<div className='max-w-4xl mx-auto space-y-6'>
				<Tabs
					selectedKey={selectedTab}
					onSelectionChange={(key: React.Key) => setSelectedTab(String(key))}
					className='flex justify-center mb-6'
				>
					<Tab
						key='edit'
						title={
							<div className='flex items-center gap-2'>
								<BookOpen className='h-4 w-4' />
								<span>Edit Quiz</span>
							</div>
						}
					/>
					<Tab
						key='responses'
						title={
							<div className='flex items-center gap-2'>
								<Users className='h-4 w-4' />
								<span>Review Responses</span>
							</div>
						}
					/>
					<Tab
						key='settings'
						title={
							<div className='flex items-center gap-2'>
								<Users className='h-4 w-4' />
								<span>Setting</span>
							</div>
						}
					/>
				</Tabs>

				{selectedTab === 'edit' ? (
					<>
						<div className='flex gap-4 items-center'>
							<div className='flex items-center gap-2'>
								<Eye className='h-5 w-5' />
								<span>Preview Mode</span>
								<Switch isSelected={previewMode} onValueChange={setPreviewMode} />
							</div>
							<Button color='secondary' variant='flat' startContent={<BarChart />} onClick={() => setSummaryMode(true)}>
								Quiz Summary
							</Button>
						</div>

						<Card>
							<CardBody className='p-6'>
								<CustomInput
									value={quizTitle}
									onChange={setQuizTitle}
									placeholder='Enter quiz title'
									label='Quiz Title'
									labelPlacement='outside'
									className='mb-4'
									disabled={previewMode}
								/>
							</CardBody>
						</Card>

						{questions.map((question: QuizQuestion) => (
							<Card key={question.id} className='w-full'>
								<CardBody className='p-6'>
									<div className='flex items-center gap-4 mb-4'>
										{!previewMode && (
											<div>
												<GripVertical className='text-gray-400 cursor-move' />
											</div>
										)}
										<div className='flex-1'>
											<CustomInput
												value={question.question}
												onChange={(value: string) => updateQuestion(question.id, (q) => ({ ...q, question: value }))}
												placeholder='Enter your question'
												labelPlacement='outside'
												disabled={previewMode}
											/>
										</div>
										<div className='flex items-center gap-2'>
											<input
												type='number'
												min='1'
												value={pointsPerQuestion[question.id.toString()] || 1}
												onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
													setPointsPerQuestion({
														...pointsPerQuestion,
														[question.id.toString()]: Math.max(1, Number.parseInt(e.target.value) || 1),
													})
												}
												className={`w-16 p-2 border rounded-md ${previewMode ? 'bg-gray-100' : ''}`}
												disabled={previewMode}
											/>
											<span className='text-sm text-gray-500'>points</span>
										</div>
										{!previewMode && (
											<div className='flex gap-2'>
												<input
													type='file'
													accept='image/*'
													onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
														const file = e.target.files?.[0];
														if (file) {
															const reader = new FileReader();
															reader.onloadend = () => {
																handleImageUpload(question.id, null, {
																	imageData: reader.result as string,
																	dimensions: { width: 300, height: 200 },
																});
															};
															reader.readAsDataURL(file);
														}
													}}
													className='hidden'
													id={`question-image-${question.id}`}
												/>
												<Button
													isIconOnly
													color='primary'
													variant='light'
													onClick={() => document.getElementById(`question-image-${question.id}`)?.click()}
												>
													<ImageIcon className='h-5 w-5' />
												</Button>
												<Button
													isIconOnly
													color='danger'
													variant='light'
													onClick={() => setQuestions((prev) => prev.filter((q) => q.id !== question.id))}
												>
													<Trash2 className='h-5 w-5' />
												</Button>
											</div>
										)}
									</div>

									{question.questionImage && (
										<div className='ml-10 mb-4'>
											<ImageUploadPreview
												src={question.questionImage.imageData}
												onRemove={() => removeImage(question.id)}
												previewMode={previewMode}
												onDimensionsChange={(dimensions: { width: number; height: number }) =>
													handleQuestionImageDimensionsChange(question.id, dimensions)
												}
												initialDimensions={
													question.questionImage.dimensions || {
														width: 300,
														height: 200,
													}
												}
											/>
										</div>
									)}

									<div className='space-y-4'>
										{renderQuestionContent(question)}
										{!previewMode &&
											(question.type === QuestionTypes.RADIO || question.type === QuestionTypes.CHECKBOX) &&
											question.options.length < 26 && (
												<Button
													size='sm'
													variant='flat'
													color='primary'
													onClick={() => addOption(question.id)}
													startContent={<Plus className='h-4 w-4' />}
													className='ml-10'
												>
													Add Option
												</Button>
											)}
									</div>
								</CardBody>
							</Card>
						))}

						{!previewMode && (
							<div className='space-y-4'>
								<Button
									color='primary'
									startContent={<Plus className='h-5 w-5' />}
									onClick={onOpen}
									className='w-full'
									size='lg'
								>
									Add Question
								</Button>
								<Button color='success' className='w-full' size='lg' startContent={<Save />} onClick={handleSaveQuiz}>
									Save Quiz
								</Button>
							</div>
						)}

						<Modal isOpen={isOpen} onClose={onClose}>
							<ModalContent>
								<ModalHeader>Select Question Type</ModalHeader>
								<ModalBody>
									<QuestionTypeSelector />
								</ModalBody>
								<ModalFooter>
									<Button color='danger' variant='light' onClick={onClose}>
										Cancel
									</Button>
								</ModalFooter>
							</ModalContent>
						</Modal>

						<Modal isOpen={summaryMode} onClose={() => setSummaryMode(false)} size='2xl'>
							<ModalContent>
								<ModalHeader>Quiz Summary</ModalHeader>
								<ModalBody>
									<QuizSummary />
								</ModalBody>
								<ModalFooter>
									<Button color='danger' variant='light' onClick={() => setSummaryMode(false)}>
										Close Summary
									</Button>
								</ModalFooter>
							</ModalContent>
						</Modal>
					</>
				) : selectedTab === 'responses' ? (
					<QuizResponseReview quizData={prepareQuizData()} responses={responses} />
				) : selectedTab === 'settings' ? (
					<QuizSettings
						settings={{
							...{
								randomizeQuestions: false,
								randomizeOptions: false,
								showScoreImmediately: false,
								showIncorrectAnswers: false,
								allowReview: false,
								enableTimer: false,
							},
							onChange: (key: string, value: boolean) => {
								console.log('Setting changed', key, value);
							},
							onSave: () => {
								console.log('Settings saved');
							},
						}}
					/>
				) : null}
			</div>
		</div>
	);
};

export default QuizCode;
