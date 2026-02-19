import { Button } from '@/components/global/shadcn/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/global/shadcn/dropdown-menu';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import type { CourseCategory } from '@shared/types/courses/course.model';
import type { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router';

export const columns: ColumnDef<CourseCategory>[] = [
	{
		accessorFn: (row) => `${row.name}`,
		id: 'name',
		header: 'Name',
		enableSorting: true,
		cell: ({ getValue }) => <div className='capitalize'>{getValue<string>()}</div>,
	},
	{
		accessorKey: 'created_at',
		header: 'Created At',
		enableSorting: true,
		cell: ({ getValue }) => {
			const date = new Date(getValue<string>());
			const formattedDate = date.toLocaleDateString('en-GB', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
			});
			return <div>{formattedDate}</div>;
		},
	},
	{
		accessorKey: 'updated_at',
		header: 'Updated At',
		enableSorting: true,
		cell: ({ getValue }) => {
			const date = new Date(getValue<string>());
			const formattedDate = date.toLocaleDateString('en-GB', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
			});
			return <div>{formattedDate}</div>;
		},
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
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
