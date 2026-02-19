import { studentsDetailedData } from '@/components/mockup/Progress';
import type { UserTypes } from '@/interfaces/sharetype';
import type { ParentLoaderData } from '@/routes/_lnf';
import { Badge, Button, Card, CardBody } from '@heroui/react';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { AlertTriangle, Download } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// Types
interface Quiz {
	chapter: number;
	score: number;
}

interface Assignment {
	name: string;
	score: number;
}

interface Student {
	id: number;
	studentId: string;
	name: string;
	quizzes: Quiz[];
	assignments: Assignment[];
}

interface StudentScores {
	quizTotal: number;
	assignmentTotal: number;
	total: number;
}

interface Stats {
	total: {
		average: number;
		max: number;
		min: number;
		median: number;
		passing: number;
		failing: number;
		totalStudents: number;
	};
	quiz: {
		average: number;
		max: number;
		min: number;
	};
	assignment: {
		average: number;
		max: number;
		min: number;
	};
}

// ประเภทข้อมูลสำหรับแถวของตารางในมุมมองผู้สอน
interface StudentGradeRow {
	studentId: string;
	name: string;
	quizTotal: number;
	assignmentTotal: number;
	total: number;
}

// Constants
const QUIZ_MAX_SCORE = 30;
const ASSIGNMENT_MAX_SCORE = 40;
const TOTAL_MAX_SCORE = 70;
const PASSING_SCORE = 35;

const StudentGradesComponent = () => {
	const { loaderData } = useOutletContext<{ loaderData: ParentLoaderData }>();
	const { user } = loaderData;

	const [progressData, setProgressData] = useState<Student[]>([]);

	// ใช้ useCallback เพื่อให้ calculateScores มี reference คงที่
	const calculateScores = useCallback((student: Student): StudentScores => {
		const quizTotal = student.quizzes.reduce((sum: number, quiz: Quiz) => sum + quiz.score, 0);
		const assignmentTotal = student.assignments.reduce(
			(sum: number, assignment: Assignment) => sum + assignment.score,
			0,
		);
		return { quizTotal, assignmentTotal, total: quizTotal + assignmentTotal };
	}, []);

	// ดึงข้อมูล (ในที่นี้ใช้ mockup data)
	useEffect(() => {
		const fetchProgressData = async () => {
			try {
				// เปลี่ยนเป็น API endpoint จริงในอนาคต
				// const response = await fetch('/api/progress');
				// const data = await response.json();
				// setProgressData(data);

				setProgressData(studentsDetailedData);
			} catch (error) {
				console.error('Error fetching progress data:', error);
			}
		};

		fetchProgressData();
	}, []);

	// คำนวณสถิติ (เพิ่ม calculateScores ใน dependency)
	const stats = useMemo<Stats>(() => {
		if (!progressData.length)
			return {
				total: {
					average: 0,
					max: 0,
					min: 0,
					median: 0,
					passing: 0,
					failing: 0,
					totalStudents: 0,
				},
				quiz: { average: 0, max: 0, min: 0 },
				assignment: { average: 0, max: 0, min: 0 },
			};

		const scores = progressData.map(calculateScores);

		return {
			total: {
				average: scores.reduce((sum: number, s: StudentScores) => sum + s.total, 0) / scores.length,
				max: Math.max(...scores.map((s) => s.total)),
				min: Math.min(...scores.map((s) => s.total)),
				median: [...scores.map((s) => s.total)].sort((a, b) => a - b)[Math.floor(scores.length / 2)],
				passing: scores.filter((s) => s.total >= PASSING_SCORE).length,
				failing: scores.filter((s) => s.total < PASSING_SCORE).length,
				totalStudents: scores.length,
			},
			quiz: {
				average: scores.reduce((sum: number, s: StudentScores) => sum + s.quizTotal, 0) / scores.length,
				max: Math.max(...scores.map((s) => s.quizTotal)),
				min: Math.min(...scores.map((s) => s.quizTotal)),
			},
			assignment: {
				average: scores.reduce((sum: number, s: StudentScores) => sum + s.assignmentTotal, 0) / scores.length,
				max: Math.max(...scores.map((s) => s.assignmentTotal)),
				min: Math.min(...scores.map((s) => s.assignmentTotal)),
			},
		};
	}, [progressData, calculateScores]);

	// console.log('User ID', user?.id);

	// มุมมองสำหรับนักศึกษา (Student View)
	const StudentView = () => {
		if (!user?.user_id) {
			return (
				<Card>
					<CardBody>
						<div className='text-center p-4'>
							<p className='text-gray-600'>ไม่พบข้อมูลนักศึกษา</p>
							<p className='text-gray-600'>กรุณาติดต่อผู้ดูแลระบบ</p>
						</div>
					</CardBody>
				</Card>
			);
		}

		const currentStudent = progressData.find((student) => student.studentId === user.user_id.toString());

		if (!currentStudent) return null;

		const scores = calculateScores(currentStudent);

		return (
			<div className='space-y-6'>
				<Card>
					<CardBody>
						<h3 className='text-lg font-semibold mb-4'>คะแนน Quiz รายบท (คะแนนเต็ม 3)</h3>
						<table className='min-w-full divide-y divide-gray-200'>
							<thead className='bg-gray-50'>
								<tr>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										บทที่
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										คะแนน
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										เต็ม
									</th>
								</tr>
							</thead>
							<tbody className='bg-white divide-y divide-gray-200'>
								{currentStudent.quizzes.map((quiz) => (
									<tr key={quiz.chapter}>
										<td className='px-6 py-4 whitespace-nowrap'>{`บทที่ ${quiz.chapter}`}</td>
										<td className='px-6 py-4 whitespace-nowrap'>{quiz.score}</td>
										<td className='px-6 py-4 whitespace-nowrap'>3</td>
									</tr>
								))}
							</tbody>
						</table>
					</CardBody>
				</Card>

				<Card>
					<CardBody>
						<h3 className='text-lg font-semibold mb-4'>คะแนนรวม</h3>
						<div className='text-right text-xl font-bold'>{`${scores.total}/${TOTAL_MAX_SCORE}`}</div>
					</CardBody>
				</Card>
			</div>
		);
	};

	// Component สำหรับแสดงกราฟคะแนน
	const ScoreDistributionChart = () => {
		const ranges = [0, 10, 20, 30, 40, 50, 60, 70].map((min, i, arr) => ({
			min,
			max: arr[i + 1] || min + 10,
			label: `${min}-${arr[i + 1] || min + 10}`,
		}));

		const data = ranges.map((range) => ({
			range: range.label,
			count: progressData.filter((student) => {
				const score = calculateScores(student).total;
				return score >= range.min && score < range.max;
			}).length,
		}));

		return (
			<div className='h-64'>
				<ResponsiveContainer>
					<BarChart data={data}>
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis dataKey='range' label={{ value: 'ช่วงคะแนน', position: 'bottom' }} />
						<YAxis
							label={{
								value: 'จำนวนนักศึกษา',
								angle: -90,
								position: 'insideLeft',
							}}
						/>
						<Tooltip />
						<Bar dataKey='count' fill='#8884d8' name='จำนวนนักศึกษา' />
					</BarChart>
				</ResponsiveContainer>
			</div>
		);
	};

	// Component สำหรับกราฟในมุมมองผู้สอน
	const GradeCharts = () => (
		<div className='space-y-6'>
			<Card>
				<CardBody>
					<h3 className='text-lg font-semibold mb-4'>การกระจายคะแนนรวม</h3>
					<ScoreDistributionChart />
				</CardBody>
			</Card>

			<Card>
				<CardBody>
					<h3 className='text-lg font-semibold mb-4'>คะแนนรวมรายบุคคล</h3>
					<div className='h-96'>
						<ResponsiveContainer>
							<BarChart
								data={progressData.map((student) => ({
									name: student.name.split(' ')[0],
									total: calculateScores(student).total,
								}))}
								margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
							>
								<CartesianGrid strokeDasharray='3 3' />
								<XAxis dataKey='name' angle={-45} textAnchor='end' height={60} />
								<YAxis domain={[0, TOTAL_MAX_SCORE]} />
								<Tooltip />
								<Bar dataKey='total' name='คะแนนรวม'>
									{progressData.map((student) => (
										<Cell
											key={student.id}
											fill={calculateScores(student).total < PASSING_SCORE ? '#ff4d4f' : '#52c41a'}
										/>
									))}
								</Bar>
							</BarChart>
						</ResponsiveContainer>
					</div>
				</CardBody>
			</Card>
		</div>
	);

	// มุมมองสำหรับผู้สอน (Instructor View) ที่ refactor ตารางโดยใช้ Tanstack React Table
	const InstructorView = () => {
		// ฟังก์ชัน export เป็น CSV
		const handleExport = () => {
			const csvContent = [
				['รหัสนักศึกษา', 'ชื่อ-นามสกุล', 'Quiz', 'Assignment', 'รวม', 'สถานะ'].join(','),
				...progressData.map((student) => {
					const scores = calculateScores(student);
					return [
						student.studentId,
						student.name,
						scores.quizTotal,
						scores.assignmentTotal,
						scores.total,
						scores.total < PASSING_SCORE ? 'ต้องปรับปรุง' : 'ผ่าน',
					].join(',');
				}),
			].join('\n');

			const blob = new Blob([`\uFEFF${csvContent}`], {
				type: 'text/csv;charset=utf-8',
			});
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = `grades_${new Date().toISOString().slice(0, 10)}.csv`;
			link.click();
			URL.revokeObjectURL(url);
		};

		// เตรียมข้อมูลสำหรับตาราง (แปลงข้อมูล progressData เป็น StudentGradeRow)
		// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
		const tableData: StudentGradeRow[] = useMemo(() => {
			return progressData.map((student) => {
				const scores = calculateScores(student);
				return {
					studentId: student.studentId,
					name: student.name,
					quizTotal: scores.quizTotal,
					assignmentTotal: scores.assignmentTotal,
					total: scores.total,
				};
			});
		}, [progressData]);

		// นิยามคอลัมน์สำหรับตารางตามแบบในไฟล์ที่แนบมา
		const columns = useMemo<ColumnDef<StudentGradeRow>[]>(
			() => [
				{
					accessorKey: 'studentId',
					header: 'รหัสนักศึกษา',
				},
				{
					accessorKey: 'name',
					header: 'ชื่อ-นามสกุล',
				},
				{
					accessorKey: 'quizTotal',
					header: `Quiz (${QUIZ_MAX_SCORE})`,
				},
				{
					accessorKey: 'assignmentTotal',
					header: `Assignment (${ASSIGNMENT_MAX_SCORE})`,
				},
				{
					accessorKey: 'total',
					header: `รวม (${TOTAL_MAX_SCORE})`,
				},
				{
					id: 'status',
					header: 'สถานะ',
					cell: ({ row }) => {
						const total = row.original.total;
						return total < PASSING_SCORE ? (
							<div className='flex items-center gap-2 text-danger'>
								<AlertTriangle size={16} />
								<span>ต้องปรับปรุง</span>
							</div>
						) : (
							<Badge color='success'>ผ่าน</Badge>
						);
					},
				},
			],
			[],
		);

		// สร้าง table instance โดยใช้ Tanstack React Table
		const table = useReactTable({
			data: tableData,
			columns,
			getCoreRowModel: getCoreRowModel(),
		});

		return (
			<div className='space-y-6'>
				<div className='flex justify-between items-center'>
					<div className='grid grid-cols-2 md:grid-cols-4 gap-4 w-full'>
						<div className='p-4 bg-success-50 rounded-lg'>
							<div className='text-sm text-gray-600'>จำนวนผู้ผ่านเกณฑ์</div>
							<div className='text-xl font-bold text-success'>{`${stats.total.passing} คน`}</div>
						</div>
						<div className='p-4 bg-danger-50 rounded-lg'>
							<div className='text-sm text-gray-600'>จำนวนผู้ไม่ผ่านเกณฑ์</div>
							<div className='text-xl font-bold text-danger'>{`${stats.total.failing} คน`}</div>
						</div>
						<div className='p-4 bg-warning-50 rounded-lg'>
							<div className='text-sm text-gray-600'>คะแนนเฉลี่ย</div>
							<div className='text-xl font-bold'>{stats.total.average.toFixed(2)}</div>
						</div>
						<div className='p-4 bg-primary-50 rounded-lg'>
							<div className='text-sm text-gray-600'>คะแนนมัธยฐาน</div>
							<div className='text-xl font-bold'>{stats.total.median}</div>
						</div>
					</div>
					<Button color='primary' endContent={<Download size={20} />} onPress={handleExport} className='ml-4'>
						Export คะแนน
					</Button>
				</div>

				<GradeCharts />

				<Card>
					<CardBody>
						{/* ตารางคะแนนนักศึกษาแบบ Tanstack React Table */}
						<table className='min-w-full divide-y divide-gray-200'>
							<thead className='bg-gray-50'>
								{table.getHeaderGroups().map((headerGroup) => (
									<tr key={headerGroup.id}>
										{headerGroup.headers.map((header) => (
											<th
												key={header.id}
												className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
											>
												{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
											</th>
										))}
									</tr>
								))}
							</thead>
							<tbody className='bg-white divide-y divide-gray-200'>
								{table.getRowModel().rows.map((row) => (
									<tr key={row.id}>
										{row.getVisibleCells().map((cell) => (
											<td key={cell.id} className='px-6 py-4 whitespace-nowrap'>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</CardBody>
				</Card>
			</div>
		);
	};

	if (!user) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-gray-50'>
				<Card>
					<CardBody>
						<div className='text-center p-4'>
							<p className='text-gray-600'>กรุณาเข้าสู่ระบบ</p>
						</div>
					</CardBody>
				</Card>
			</div>
		);
	}

	return (
		<div className='min-h-screen flex flex-col bg-gray-50'>
			<div className='w-full max-w-7xl mx-auto px-4 py-8'>
				<h1 className='text-2xl font-bold mb-6'>รายงานคะแนนนักศึกษา</h1>
				{user.user_role.includes('INSTRUCTOR') || user.user_role.includes('ANNOUNCER') ? (
					<InstructorView />
				) : (
					<StudentView />
				)}
			</div>
		</div>
	);
};

export default StudentGradesComponent;
