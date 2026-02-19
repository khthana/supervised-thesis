import { Button } from '@/components/global/shadcn/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/global/shadcn/dropdown-menu';
import { createCommonColumns } from '@/lib/commonColumn';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import type { CourseCategory } from '@shared/types/courses/course.model';
import type { ColumnDef } from '@tanstack/react-table';

export const createActionDropdown = (
	original: CourseCategory,
	menuLabel: string,
	copyLabel: string,
	additionalMenuItems: React.ReactNode,
) => {
	return <span className='material-symbols-outlined'>delete</span>;
};

export function createSubColumns(mainCategories: CourseCategory[]): ColumnDef<CourseCategory>[] {
	const mainCategoryMap = new Map<number | string, string>();
	for (const category of mainCategories) {
		mainCategoryMap.set(category.category_id, category.name);
	}

	const commonColumns = createCommonColumns<CourseCategory>();
	const finalColumns = [...commonColumns];

	finalColumns.splice(2, 0, {
		accessorKey: 'category_id',
		header: 'Main Category',
		enableSorting: true,
		cell: ({ getValue }) => {
			const parentId = getValue<number | string>();
			const parentName = parentId ? mainCategoryMap.get(parentId) || `ID: ${parentId}` : 'None';
			return <div className='capitalize'>{parentName}</div>;
		},
	});

	// เพิ่มคอลัมน์ actions ที่ท้ายสุด
	finalColumns.push({
		id: 'actions',
		cell: ({ row }) => {
			const cate = row.original;

			return createActionDropdown(
				cate,
				'Sub Category Actions',
				'Copy subcategory ID',
				<>
					<DropdownMenuItem>View subcategory details</DropdownMenuItem>
					<DropdownMenuItem>Move to different parent</DropdownMenuItem>
				</>,
			);
		},
	});

	return finalColumns;
}
