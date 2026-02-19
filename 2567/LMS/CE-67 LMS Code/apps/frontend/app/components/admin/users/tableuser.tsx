import { Button } from '@/components/global/shadcn/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/global/shadcn/dropdown-menu';
import type { UserTypes } from '@/interfaces/sharetype';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import type { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router';

export const columns: ColumnDef<UserTypes>[] = [
	{
		id: 'rowNumber',
		header: 'No.',
		enableSorting: false,
		enableHiding: false,
		cell: ({ row }) => {
			return <div>{row.index + 1}</div>;
		},
	},
	{
		accessorFn: (row) => `${row.firstname_en} ${row.lastname_en}`,
		id: 'fullName_en',
		header: 'English Name',
		enableSorting: true,
		cell: ({ getValue }) => <div className='capitalize'>{getValue<string>()}</div>,
	},
	{
		accessorFn: (row) => `${row.firstname_th} ${row.lastname_th}`,
		id: 'fullName_th',
		header: 'Thai Name',
		enableSorting: true,
		cell: ({ getValue }) => <div className='capitalize'>{getValue<string>()}</div>,
	},
	{
		accessorKey: 'email',
		header: 'Email',
		enableSorting: true,
		cell: ({ row }) => <div className='lowercase'>{row.getValue('email')}</div>,
	},
	{
		accessorKey: 'user_role',
		enableColumnFilter: true,
		filterFn: 'includesString',
		header: 'Role',
		cell: ({ row }) => {
			return <div>{row.getValue('user_role')}</div>;
		},
	},
	{
		accessorKey: 'is_verified',
		header: 'Verified',
		enableColumnFilter: true,
		enableSorting: true,
		filterFn: (row, id, value) => {
			return value === (row.getValue(id) as boolean).toString();
		},
		cell: ({ row }) => <div>{row.getValue<boolean>('is_verified') ? 'Yes' : 'No'}</div>,
	},
	{
		accessorKey: 'is_active',
		header: 'Active',
		enableSorting: true,
		enableColumnFilter: true,
		cell: ({ row }) => <div>{row.getValue<boolean>('is_active') ? 'Yes' : 'No'}</div>,
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const user = row.original;
			const navigate = useNavigate();

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' className='h-8 w-8 p-0'>
							<span className='sr-only'>Open menu</span>
							<DotsHorizontalIcon className='h-4 w-4' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.user_id.toString())}>
							Copy user ID
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>View user details</DropdownMenuItem>
						<DropdownMenuItem onClick={() => navigate('/management/usermanage')}>Open User</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
