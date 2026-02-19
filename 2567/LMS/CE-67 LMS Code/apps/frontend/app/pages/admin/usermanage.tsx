import { ContentLayout } from '@/components/admin/ContentLayout';
import { Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react';
// import { Users } from '@/components/mockup/user';
// import type { IUser } from '@/interfaces/user';
import { type Row, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

const user = {
	id: 1,
	firstname_en: 'Thana',
	lastname_en: 'Hongsuwan',
	firstname_th: 'ธนา',
	lastname_th: 'หงสุวรรณ',
	email: 'khthana@kmitl.ac.th',
	user_role: ['Instructor', 'Admin'],
	courses: [
		// { id: 1, name: 'Program Fundamental' },
		{ id: 2, name: 'Computer Organization' },
	],
};

const UserManage = () => {
	const columns = [
		{ accessorKey: 'id', header: 'No.' },
		{ accessorKey: 'name', header: 'Course Name' },
		{
			accessorKey: 'actions',
			header: 'Actions',
			cell: ({ row }: { row: Row<(typeof user.courses)[number]> }) => (
				<Dropdown>
					<DropdownTrigger asChild>
						<Button variant='flat'>...</Button>
					</DropdownTrigger>
					<DropdownMenu>
						<DropdownItem key='View'>View</DropdownItem>
						<DropdownItem key='Edit'>Edit</DropdownItem>
						<DropdownItem key='Delete'>Delete</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			),
		},
	];

	const table = useReactTable({
		data: user.courses,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div>
			<ContentLayout>
				<div className='grid grid-cols-[0.3fr_1fr] gap-4 my-4'>
					<div className='flex justify-center items-center'>
						<Avatar className='w-32 h-32' />
					</div>
					<div className='space-y-3'>
						<p className='text-2xl font-bold'>
							{user.firstname_en} {user.lastname_en}
						</p>
						<p className='text-lg'>
							{' '}
							Name : {user.firstname_th} {user.lastname_th}
						</p>
						<p className='text-lg'> Email : {user.email}</p>
						<p className='text-lg'> Role : {user.user_role.join(', ')}</p>
					</div>
				</div>
				<div className='flex space-x-2'>
					<Button color='primary'>Edit Profile</Button>
					<Button variant='solid'>Reset Password</Button>
					<Button color='danger'>Delete User</Button>
				</div>
				<div>
					<h3 className='text-lg font-semibold'>Courses Enrolled</h3>
					<table className='mt-4 w-full border border-gray-300'>
						<thead>
							<tr>
								{table.getHeaderGroups().map((headerGroup) =>
									headerGroup.headers.map((header) => (
										<th key={header.id} className='border p-2 text-left'>
											{flexRender(header.column.columnDef.header, header.getContext())}
										</th>
									)),
								)}
							</tr>
						</thead>
						<tbody>
							{table.getRowModel().rows.map((row) => (
								<tr key={row.id}>
									{row.getVisibleCells().map((cell) => (
										<td key={cell.id} className='border p-2'>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</ContentLayout>
		</div>
	);
};

export default UserManage;
