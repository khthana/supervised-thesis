import {
	Badge,
	Button,
	Card,
	CardBody,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Progress,
	Tab,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	Tabs,
	useDisclosure,
} from '@heroui/react';
import {
	BarChart2,
	CheckCircle,
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	Clock,
	Eye,
	Save,
	User,
	XCircle,
} from 'lucide-react';
import { useState } from 'react';

// นิยาม interface สำหรับข้อมูล Response และ Question
interface Response {
	studentId: string;
	studentName: string;
	submittedAt: string;
	answers: Record<string, string | string[]>;
	timeSpent: number;
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

// กำหนด interface สำหรับ prop ของ QuizResponseReview
interface QuizResponseReviewProps {
	quizData: MockQuiz;
	responses: Response[];
}

const QuizResponseReview: React.FC<QuizResponseReviewProps> = ({ quizData, responses }) => {
	const [selectedStudentIndex, setSelectedStudentIndex] = useState<number | null>(null);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [manualScores, setManualScores] = useState<Record<string, number>>({});
	const [selectedTab, setSelectedTab] = useState('submissions');
	const [reviewedSubmissions, setReviewedSubmissions] = useState<Set<string>>(new Set());

	const formatTime = (seconds: number): string => {
		const minutes = Math.floor(seconds / 60);
		return `${minutes} นาที ${seconds % 60} วินาที`;
	};

	const navigateToStudent = (direction: 'next' | 'prev'): void => {
		if (selectedStudentIndex === null) return;
		const newIndex =
			direction === 'next'
				? Math.min(selectedStudentIndex + 1, responses.length - 1)
				: Math.max(selectedStudentIndex - 1, 0);
		setSelectedStudentIndex(newIndex);
	};

	const calculateScore = (response: Response) => {
		let totalScore = 0;
		let maxScore = 0;

		for (const question of quizData.questions) {
			const points = quizData.pointsPerQuestion[question.id] || 1;
			maxScore += points;

			const manualKey = `${response.studentId}-${question.id}`;
			if (manualScores[manualKey] !== undefined) {
				totalScore += manualScores[manualKey];
				continue;
			}

			const studentAnswer = response.answers[question.id.toString()];
			const correctAnswer = question.correctAnswer;

			switch (question.type) {
				case 'radio':
					if (studentAnswer === correctAnswer) {
						totalScore += points;
					}
					break;
				case 'checkbox':
					if (Array.isArray(studentAnswer) && Array.isArray(correctAnswer)) {
						if (
							studentAnswer.length === correctAnswer.length &&
							studentAnswer.every((ans) => correctAnswer.includes(ans))
						) {
							totalScore += points;
						}
					}
					break;
				case 'shortAnswer':
					// ต้องตรวจด้วยผู้สอน
					break;
			}
		}
		return {
			score: totalScore,
			maxScore,
			percentage: maxScore ? (totalScore / maxScore) * 100 : 0,
		};
	};

	const QuestionReview = ({
		question,
		studentAnswer,
		studentId,
	}: { question: Question; studentAnswer: string | string[]; studentId: string }) => {
		const handleManualScore = (score: number) => {
			setManualScores((prev) => ({
				...prev,
				[`${studentId}-${question.id}`]: Number.parseFloat(score.toString()),
			}));
		};

		const isCorrect = (() => {
			if (question.type === 'shortAnswer') return null;
			if (question.type === 'radio') return studentAnswer === question.correctAnswer;
			if (question.type === 'checkbox') {
				return (
					Array.isArray(studentAnswer) &&
					Array.isArray(question.correctAnswer) &&
					studentAnswer.length === question.correctAnswer.length &&
					studentAnswer.every((ans) => question.correctAnswer.includes(ans))
				);
			}
		})();

		return (
			<Card className='mb-4'>
				<CardBody>
					<div className='space-y-4'>
						<div className='flex justify-between items-start'>
							<div>
								<h3 className='text-lg font-medium'>{question.question}</h3>
							</div>
							{isCorrect !== null && (
								<Badge color={isCorrect ? 'success' : 'danger'}>{isCorrect ? 'ถูกต้อง' : 'ไม่ถูกต้อง'}</Badge>
							)}
						</div>

						{question.questionImage && (
							<img src={question.questionImage} alt='Question' className='max-h-40 object-cover rounded-md' />
						)}

						<div className='pl-4 space-y-2'>
							<div>
								<p className='font-medium'>คำตอบของนักเรียน:</p>
								{question.type === 'shortAnswer' ? (
									<div className='pl-4 space-y-2'>
										<p>{studentAnswer}</p>
										<div className='flex items-center gap-2'>
											<span className='text-sm'>คะแนน (0-{quizData.pointsPerQuestion[question.id] || 1}):</span>
											<input
												type='number'
												min='0'
												max={quizData.pointsPerQuestion[question.id] || 1}
												step='0.5'
												className='w-20 p-1 border rounded'
												defaultValue={manualScores[`${studentId}-${question.id}`] || 0}
												onChange={(e) => handleManualScore(Number.parseFloat(e.target.value))}
											/>
										</div>
									</div>
								) : (
									<div className='pl-4'>
										{Array.isArray(studentAnswer) ? (
											studentAnswer.map((ans) => (
												<Badge key={ans} color='primary' variant='flat' className='mr-2'>
													{ans}
												</Badge>
											))
										) : (
											<Badge color='primary' variant='flat'>
												{studentAnswer}
											</Badge>
										)}
									</div>
								)}
							</div>

							<div>
								<p className='font-medium'>เฉลย:</p>
								<div className='pl-4'>
									{question.type === 'shortAnswer' ? (
										<p>{question.correctAnswer}</p>
									) : Array.isArray(question.correctAnswer) ? (
										question.correctAnswer.map((ans) => (
											<Badge key={ans} color='success' variant='flat' className='mr-2'>
												{ans}
											</Badge>
										))
									) : (
										<Badge color='success' variant='flat'>
											{question.correctAnswer}
										</Badge>
									)}
								</div>
							</div>
						</div>
					</div>
				</CardBody>
			</Card>
		);
	};

	const StudentResponseDetail = ({ response }: { response: Response }) => {
		const scoreData = calculateScore(response);
		const { score, maxScore, percentage } = scoreData;

		return (
			<div className='space-y-6'>
				<div className='flex justify-between items-center'>
					<div>
						<h2 className='text-2xl font-bold'>{response.studentName}</h2>
						<p className='text-sm text-gray-500'>รหัสนักศึกษา: {response.studentId}</p>
					</div>
					<Badge color='primary' variant='flat'>
						คะแนน: {score}/{maxScore} ({percentage.toFixed(1)}%)
					</Badge>
				</div>

				<Card>
					<CardBody>
						<div className='grid grid-cols-2 gap-4'>
							<div className='flex items-center gap-2'>
								<Clock className='h-5 w-5 text-primary' />
								<div>
									<p className='text-sm text-gray-500'>เวลาที่ใช้</p>
									<p className='font-medium'>{formatTime(response.timeSpent)}</p>
								</div>
							</div>
							<div className='flex items-center gap-2'>
								<User className='h-5 w-5 text-primary' />
								<div>
									<p className='text-sm text-gray-500'>ส่งเมื่อ</p>
									<p className='font-medium'>{new Date(response.submittedAt).toLocaleString('th-TH')}</p>
								</div>
							</div>
						</div>
					</CardBody>
				</Card>

				<div className='space-y-4'>
					{quizData.questions.map((q) => (
						<QuestionReview
							key={q.id}
							question={q}
							studentAnswer={response.answers[q.id.toString()]}
							studentId={response.studentId}
						/>
					))}
				</div>
			</div>
		);
	};

	const QuestionAnalysis = () => {
		const stats = responses.reduce(
			(acc: Record<string, { correct: number; incorrect: number; total: number; needsReview?: boolean }>, response) => {
				for (const question of quizData.questions) {
					const key = question.id.toString();
					if (!acc[key]) {
						acc[key] = {
							correct: 0,
							incorrect: 0,
							total: responses.length,
						};
					}

					const studentAnswer = response.answers[key];
					if (question.type === 'shortAnswer') {
						acc[key].needsReview = true;
						continue;
					}

					let isCorrect = false;
					if (question.type === 'radio') {
						isCorrect = studentAnswer === question.correctAnswer;
					} else if (question.type === 'checkbox') {
						isCorrect =
							Array.isArray(studentAnswer) &&
							Array.isArray(question.correctAnswer) &&
							studentAnswer.length === question.correctAnswer.length &&
							studentAnswer.every((ans) => question.correctAnswer.includes(ans));
					}

					if (isCorrect) {
						acc[key].correct++;
					} else {
						acc[key].incorrect++;
					}
				}
				return acc;
			},
			{} as Record<string, { correct: number; incorrect: number; total: number; needsReview?: boolean }>,
		);

		const convertPointsPerQuestion = (id: number): number => {
			const points = quizData.pointsPerQuestion[id];
			return points !== undefined ? points : 1;
		};

		return (
			<div className='space-y-6'>
				<h2 className='text-2xl font-bold'>การวิเคราะห์รายข้อ</h2>

				{quizData.questions.map((question, index) => (
					<Card key={question.id}>
						<CardBody>
							<div className='space-y-4'>
								<div className='flex justify-between items-start'>
									<div>
										<h3 className='font-medium'>ข้อที่ {index + 1}</h3>
										<p>{question.question}</p>
									</div>
									<Badge color='primary' variant='flat'>
										{convertPointsPerQuestion(question.id)} คะแนน
									</Badge>
								</div>

								{stats[question.id.toString()].needsReview ? (
									<div className='text-center p-4'>
										<p className='text-gray-500'>ต้องตรวจด้วยผู้สอน</p>
									</div>
								) : (
									<>
										<div className='flex items-center gap-4'>
											<div className='flex items-center gap-2'>
												<CheckCircle2 className='text-success' />
												<span>ตอบถูก: {stats[question.id.toString()].correct} คน</span>
											</div>
											<div className='flex items-center gap-2'>
												<XCircle className='text-danger' />
												<span>ตอบผิด: {stats[question.id.toString()].incorrect} คน</span>
											</div>
										</div>
										<Progress
											value={(stats[question.id.toString()].correct / stats[question.id.toString()].total) * 100}
											color='success'
											size='md'
										/>
									</>
								)}
							</div>
						</CardBody>
					</Card>
				))}
			</div>
		);
	};

	const handleSaveScores = (studentId: string) => {
		setReviewedSubmissions((prev) => new Set([...prev, studentId]));

		if (selectedStudentIndex !== null && selectedStudentIndex < responses.length - 1) {
			navigateToStudent('next');
		} else {
			onClose();
		}
	};

	return (
		<div className='space-y-6'>
			<Tabs selectedKey={selectedTab} onSelectionChange={(key) => setSelectedTab(String(key))}>
				<Tab
					key='submissions'
					title={
						<div className='flex items-center gap-2'>
							<User className='h-4 w-4' />
							<span>การส่งงาน</span>
						</div>
					}
				>
					<Card>
						<CardBody>
							<Table aria-label='Student submissions'>
								<TableHeader>
									<TableColumn>นักศึกษา</TableColumn>
									<TableColumn>เวลาที่ใช้</TableColumn>
									<TableColumn>คะแนน</TableColumn>
									<TableColumn>ดำเนินการ</TableColumn>
								</TableHeader>
								<TableBody>
									{responses.map((response, index) => {
										const { score, maxScore, percentage } = calculateScore(response);
										const isReviewed = reviewedSubmissions.has(response.studentId);

										return (
											<TableRow key={response.studentId}>
												<TableCell>
													<div>
														<p className='font-medium'>{response.studentName}</p>
														<p className='text-sm text-gray-500'>{response.studentId}</p>
													</div>
												</TableCell>
												<TableCell>
													<div className='flex items-center gap-2'>
														<Clock className='h-4 w-4' />
														{formatTime(response.timeSpent)}
													</div>
												</TableCell>
												<TableCell>
													<div>
														<p className='font-medium'>
															{score}/{maxScore}
														</p>
														<Progress value={percentage} color='primary' size='sm' />
													</div>
												</TableCell>
												<TableCell>
													<Button
														color={isReviewed ? 'success' : 'primary'}
														variant='light'
														startContent={isReviewed ? <CheckCircle /> : <Eye />}
														onClick={() => {
															setSelectedStudentIndex(index);
															onOpen();
														}}
													>
														{isReviewed ? 'ตรวจข้อสอบแล้ว' : 'ตรวจข้อสอบ'}
													</Button>
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</CardBody>
					</Card>
				</Tab>

				<Tab
					key='analysis'
					title={
						<div className='flex items-center gap-2'>
							<BarChart2 className='h-4 w-4' />
							<span>วิเคราะห์ข้อสอบ</span>
						</div>
					}
				>
					<QuestionAnalysis />
				</Tab>
			</Tabs>

			<Modal isOpen={isOpen} onClose={onClose} size='3xl' scrollBehavior='inside'>
				<ModalContent>
					<ModalHeader className='flex justify-between items-center'>
						<span>ตรวจข้อสอบ</span>
						<div className='flex items-center gap-2'>
							<Button
								isIconOnly
								variant='light'
								onPress={() => navigateToStudent('prev')}
								isDisabled={selectedStudentIndex === 0}
							>
								<ChevronLeft className='h-4 w-4' />
							</Button>
							<span className='text-sm'>
								{selectedStudentIndex !== null ? selectedStudentIndex + 1 : 0} / {responses.length}
							</span>
							<Button
								isIconOnly
								variant='light'
								onPress={() => navigateToStudent('next')}
								isDisabled={selectedStudentIndex === responses.length - 1}
							>
								<ChevronRight className='h-4 w-4' />
							</Button>
						</div>
					</ModalHeader>
					<ModalBody>
						{selectedStudentIndex !== null && <StudentResponseDetail response={responses[selectedStudentIndex]} />}
					</ModalBody>
					<ModalFooter>
						<Button
							color='success'
							startContent={<Save />}
							onClick={() => {
								if (selectedStudentIndex !== null) {
									handleSaveScores(responses[selectedStudentIndex].studentId);
								}
							}}
							className='mr-2'
						>
							บันทึกคะแนน
						</Button>
						<Button color='danger' variant='light' onPress={onClose}>
							ปิด
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
};

export default QuizResponseReview;
