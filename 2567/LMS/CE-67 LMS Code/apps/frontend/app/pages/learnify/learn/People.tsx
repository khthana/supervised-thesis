import type { IUserData } from '@/interfaces/user';
import type { ParentLoaderData } from '@/routes/_lnf';
import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react';
import { useOutletContext } from 'react-router';
import type { UserTypes } from '~/app/interfaces/sharetype';

interface Person {
	id: string;
	firstName: string;
	lastName: string;
	role: string;
	email: string;
}

const InstructorTATable = ({
	data,
	user,
}: {
	data: Person[];
	user: UserTypes;
}) => (
	<div className='overflow-x-auto bg-white shadow-lg rounded-lg overflow-hidden px-6 pb-6'>
		<Table aria-label='Instructor and TAs table' className='min-w-full table-auto border-collapse'>
			<TableHeader>
				<TableColumn className='w-[200px] border-b border-gray-200 font-bold bg-gray-100 text-left px-6 py-3'>
					ID
				</TableColumn>
				<TableColumn className='w-[200px] border-b border-gray-200 font-bold bg-gray-100 text-left px-6 py-3'>
					FIRST NAME
				</TableColumn>
				<TableColumn className='w-[200px] border-b border-gray-200 font-bold bg-gray-100 text-left px-6 py-3'>
					LAST NAME
				</TableColumn>
				<TableColumn className='w-[200px] border-b border-gray-200 font-bold bg-gray-100 text-left px-6 py-3'>
					EMAIL
				</TableColumn>
				<TableColumn className='w-[200px] border-b border-gray-200 font-bold bg-gray-100 text-left px-6 py-3'>
					ROLE
				</TableColumn>
			</TableHeader>
			<TableBody>
				{data.map((person) => (
					<TableRow key={person.email} className='border-b border-gray-200 hover:bg-gray-50 transition-colors'>
						<TableCell className='px-6 py-3'>{person.id}</TableCell>
						<TableCell className='px-6 py-3'>{person.firstName}</TableCell>
						<TableCell className='px-6 py-3'>{person.lastName}</TableCell>
						<TableCell className='px-6 py-3'>{person.email}</TableCell>
						<TableCell className='px-6 py-3'>{person.role}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
		{user.user_role.includes('INSTRUCTOR') && (
			<div className='flex justify-end'>
				<Button color='primary' variant='solid' className='m-6'>
					Add TA
				</Button>
			</div>
		)}
	</div>
);

const ClassmateTable = ({ data, user }: { data: Person[]; user: UserTypes }) => (
	<div className='overflow-x-auto bg-white shadow-lg rounded-lg overflow-hidden px-6 pb-6'>
		<Table aria-label='Classmate table' className='min-w-full table-auto border-collapse'>
			<TableHeader>
				<TableColumn className='w-[200px] border-b border-gray-200 font-bold bg-gray-100 text-left px-6 py-3'>
					ID
				</TableColumn>
				<TableColumn className='w-[200px] border-b border-gray-200 font-bold bg-gray-100 text-left px-6 py-3'>
					FIRST NAME
				</TableColumn>
				<TableColumn className='w-[200px] border-b border-gray-200 font-bold bg-gray-100 text-left px-6 py-3'>
					LAST NAME
				</TableColumn>
				<TableColumn className='w-[200px] border-b border-gray-200 font-bold bg-gray-100 text-left px-6 py-3'>
					EMAIL
				</TableColumn>
				<TableColumn className='w-[200px] border-b border-gray-200 font-bold bg-gray-100 text-left px-6 py-3'>
					ROLE
				</TableColumn>
			</TableHeader>
			<TableBody>
				{data.map((student) => (
					<TableRow key={student.id} className='border-b border-gray-200 hover:bg-gray-50 transition-colors'>
						<TableCell className='px-6 py-3'>{student.id}</TableCell>
						<TableCell className='px-6 py-3'>{student.firstName}</TableCell>
						<TableCell className='px-6 py-3'>{student.lastName}</TableCell>
						<TableCell className='px-6 py-3'>{student.email}</TableCell>
						<TableCell className='px-6 py-3'>{student.role}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
		{user.user_role.includes('INSTRUCTOR') && (
			<div className='flex justify-end'>
				<Button color='primary' variant='solid' className='m-6'>
					Import Learner
				</Button>
			</div>
		)}
	</div>
);

export default function CourseTables() {
	const { loaderData } = useOutletContext<{ loaderData: ParentLoaderData }>();
	const { user } = loaderData;
	if (!user) {
		return 'Loading...';
	}

	const instructorTAsData: Person[] = [
		{
			id: '1',
			firstName: 'Thana',
			lastName: 'Hongsuwan',
			role: 'INSTRUCTOR',
			email: 'khthana@kmitl.ac.th',
		},
		{
			id: '2',
			firstName: 'Thanunchai',
			lastName: 'Threepak',
			role: 'INSTRUCTOR',
			email: 'thanunchai.th@kmitl.ac.th',
		},
	];

	const classmateData: Person[] = [
		{
			id: '65015077',
			firstName: 'Thiraphat',
			lastName: 'Suksamosorn',
			role: 'LEARNER',
			email: '65015077@kmitl.ac.th',
		},
		{
			id: '65015143',
			firstName: 'Wiraphat',
			lastName: 'Prasomphong',
			role: 'LEARNER',
			email: '65015143@kmitl.ac.th',
		},
		{
			id: '65015144',
			firstName: 'Veerapod',
			lastName: 'ChuChat',
			role: 'LEARNER',
			email: '65015144@kmitl.ac.th',
		},
	];

	return (
		<div className='w-full max-w-8xl sm:px-6 lg:px-8 space-y-8'>
			<div className='bg-white shadow-lg rounded-lg overflow-hidden'>
				<h2 className='text-2xl font-bold p-6 border-b border-gray-200'>Instructor</h2>
				<InstructorTATable data={instructorTAsData} user={user} />
			</div>

			<div className='bg-white shadow-lg rounded-lg overflow-hidden'>
				<h2 className='text-2xl font-bold p-6 border-b border-gray-200'>Learner</h2>
				<ClassmateTable data={classmateData} user={user} />
			</div>
		</div>
	);
}
