import { Card, CardBody, Chip, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react';
import type { Selection } from '@react-types/shared';
import { Code, FileText } from 'lucide-react';
import { useState } from 'react';
import { string } from 'zod';

type WorksheetStatus = 'Late' | 'Turned in';
type CodeStatus = 'Pending' | 'Success' | 'Failed';
type AssignmentType = 'worksheet' | 'code';

interface Assignment {
	id: number;
	date: string;
	day: string;
	title: string;
	type: AssignmentType;
	status?: WorksheetStatus | CodeStatus;
	dueDate: string;
	description: string;
}

const mockData = {
	upcoming: [
		{
			id: 1,
			date: 'Oct 25, 2024',
			day: 'Friday',
			title: 'การเขียนผังงาน (Flowchart)',
			type: 'worksheet' as const,
			dueDate: 'Oct 31, 2024 : 23:59',
			description: 'ให้นักเรียนเขียนผังงานอธิบายขั้นตอนการทำงานของโปรแกรมคำนวณเกรด',
		},
		{
			id: 2,
			date: 'Oct 26, 2024',
			day: 'Saturday',
			title: 'โปรแกรมคำนวณพื้นที่สามเหลี่ยม',
			type: 'code' as const,
			status: 'Pending' as const,
			dueDate: 'Oct 28, 2024 : 12:00',
			description: 'เขียนโปรแกรมคำนวณพื้นที่สามเหลี่ยมโดยรับค่าฐานและความสูงจากผู้ใช้',
		},
		{
			id: 3,
			date: 'Oct 27, 2024',
			day: 'Sunday',
			title: 'การใช้งาน Array',
			type: 'code' as const,
			status: 'Pending' as const,
			dueDate: 'Nov 1, 2024 : 23:59',
			description: 'เขียนโปรแกรมจัดการข้อมูลใน Array พร้อมทำการเรียงลำดับข้อมูล',
		},
		{
			id: 4,
			date: 'Oct 28, 2024',
			day: 'Monday',
			title: 'แบบฝึกหัด Function',
			type: 'worksheet' as const,
			dueDate: 'Nov 3, 2024 : 23:59',
			description: 'ทำแบบฝึกหัดเรื่องการสร้างและเรียกใช้ Function',
		},
	],
	pastDue: [
		{
			id: 5,
			date: 'Oct 20, 2024',
			day: 'Sunday',
			title: 'แบบฝึกหัด If-Else',
			type: 'worksheet' as const,
			status: 'Late' as const,
			dueDate: 'Oct 23, 2024 : 23:59',
			description: 'ทำแบบฝึกหัดเรื่องการใช้คำสั่ง If-Else ในการตัดสินใจ',
		},
		{
			id: 6,
			date: 'Oct 21, 2024',
			day: 'Monday',
			title: 'โปรแกรมคำนวณเกรด',
			type: 'code' as const,
			status: 'Failed' as const,
			dueDate: 'Oct 24, 2024 : 23:59',
			description: 'เขียนโปรแกรมคำนวณเกรดโดยใช้ If-Else จากคะแนนที่รับเข้ามา',
		},
	],
	complete: [
		{
			id: 7,
			date: 'Oct 15, 2024',
			day: 'Tuesday',
			title: 'โปรแกรม Hello World',
			type: 'code' as const,
			status: 'Success' as const,
			dueDate: 'Oct 18, 2024 : 23:59',
			description: 'เขียนโปรแกรมแสดงข้อความ Hello World บนหน้าจอ',
		},
		{
			id: 8,
			date: 'Oct 16, 2024',
			day: 'Wednesday',
			title: 'สรุปประเภทตัวแปร',
			type: 'worksheet' as const,
			status: 'Turned in' as const,
			dueDate: 'Oct 19, 2024 : 23:59',
			description: 'สรุปความรู้เรื่องประเภทของตัวแปรในภาษา Python',
		},
		{
			id: 9,
			date: 'Oct 17, 2024',
			day: 'Thursday',
			title: 'โปรแกรมคำนวณพื้นที่วงกลม',
			type: 'code' as const,
			status: 'Success' as const,
			dueDate: 'Oct 20, 2024 : 23:59',
			description: 'เขียนโปรแกรมคำนวณพื้นที่วงกลมโดยรับค่ารัศมีจากผู้ใช้',
		},
	],
};

const AssignmentTable = () => {
	const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
	const [selectedId, setSelectedId] = useState<number | null>(null);

	const getTypeIcon = (type: AssignmentType) => {
		const iconProps = {
			size: 20,
			className: 'text-default-500',
		};

		return type === 'worksheet' ? <FileText {...iconProps} /> : <Code {...iconProps} />;
	};

	function isWorksheetStatus(status: WorksheetStatus | CodeStatus, type: AssignmentType): status is WorksheetStatus {
		return type === 'worksheet';
	}

	function isCodeStatus(status: WorksheetStatus | CodeStatus, type: AssignmentType): status is CodeStatus {
		return type === 'code';
	}

	const getStatusChip = (assignment: Assignment) => {
		if (!assignment.status) return null;

		if (isWorksheetStatus(assignment.status, assignment.type)) {
			const colorMap: Record<WorksheetStatus, string> = {
				Late: 'bg-red-100 text-red-800',
				'Turned in': 'bg-green-100 text-green-800',
			};
			return (
				<Chip size='sm' color='default' variant='flat' className={colorMap[assignment.status]}>
					{assignment.status}
				</Chip>
			);
		}

		const status = assignment.status;
		const colorMap: Record<CodeStatus, string> = {
			Pending: 'bg-yellow-100 text-yellow-800',
			Success: 'bg-green-100 text-green-800',
			Failed: 'bg-red-100 text-red-800',
		};
		return (
			<Chip size='sm' color='default' variant='flat' className={colorMap[status]}>
				{status}
			</Chip>
		);
	};

	const allAssignments = [...mockData.upcoming, ...mockData.pastDue, ...mockData.complete];

	const handleSelectionChange = (keys: Selection) => {
		setSelectedKeys(keys as unknown as Set<string>);
		const selectedId = Array.from(keys as unknown as Set<string>)[0];
		const selectedAssignment = allAssignments.find((a) => a.id.toString() === selectedId);
		if (selectedAssignment) {
			console.log('Selected assignment:', selectedAssignment);
		}
	};

	return (
		<div className='p-4'>
			<Card
				classNames={{
					base: 'bg-transparent shadow-none', // ลบพื้นหลังและเงา
					body: 'p-0', // ลบ padding
				}}
			>
				<CardBody>
					<Table
						aria-label='Assignments table'
						selectionMode='single'
						selectedKeys={selectedKeys}
						onSelectionChange={handleSelectionChange}
						classNames={{
							th: 'bg-default-100',
							td: 'py-3',
							tr: 'cursor-pointer transition-colors hover:bg-default-100',
						}}
					>
						<TableHeader>
							<TableColumn width={50}> </TableColumn>
							<TableColumn>TITLE</TableColumn>
							<TableColumn>DATE</TableColumn>
							<TableColumn>DESCRIPTION</TableColumn>
							<TableColumn>DUE DATE</TableColumn>
							<TableColumn>STATUS</TableColumn>
						</TableHeader>
						<TableBody>
							{allAssignments.map((assignment) => (
								<TableRow key={assignment.id}>
									<TableCell>{getTypeIcon(assignment.type)}</TableCell>
									<TableCell>
										<span className='font-medium'>{assignment.title}</span>
									</TableCell>
									<TableCell>
										<div>{assignment.date}</div>
										<div className='text-sm text-default-500'>{assignment.day}</div>
									</TableCell>
									<TableCell className='max-w-md truncate'>{assignment.description}</TableCell>
									<TableCell>{assignment.dueDate || '-'}</TableCell>
									<TableCell>{getStatusChip(assignment)}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardBody>
			</Card>
		</div>
	);
};

export default AssignmentTable;
