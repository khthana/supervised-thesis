import type { CourseCategory } from '@shared/types/courses/course.model';
import type { ColumnDef } from '@tanstack/react-table';
import { formatDate } from './formatting';

export const createCommonColumns = <T extends CourseCategory>(): ColumnDef<T>[] => [
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
		cell: ({ getValue }) => <div>{formatDate(getValue<string>())}</div>,
	},
	{
		accessorKey: 'updated_at',
		header: 'Updated At',
		enableSorting: true,
		cell: ({ getValue }) => <div>{formatDate(getValue<string>())}</div>,
	},
];
