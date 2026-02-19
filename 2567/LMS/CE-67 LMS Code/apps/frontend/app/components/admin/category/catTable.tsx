import type { CourseCategory } from '@shared/types/courses/course.model';
import type { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import CatDataTable from './table';
import type { CategoryType } from './table';
import { columns as defaultColumns } from './tablecat';

interface RoleTableProps {
	Categories: CourseCategory[];
	CategoryType: CategoryType;
	editable?: boolean;
	columns?: ColumnDef<CourseCategory>[];
	mainCategories?: CourseCategory[]; // Main categories for dropdown selection
}

export default function CatTable({
	Categories: initialUsers,
	CategoryType,
	editable = false,
	columns = defaultColumns,
	mainCategories = [],
}: RoleTableProps) {
	const [category, setCategory] = useState<CourseCategory[]>(initialUsers);

	const handleUserDataChange = (updatedCategory: CourseCategory[]) => {
		setCategory(updatedCategory);
	};

	return (
		<CatDataTable
			categories={category}
			CategoryType={CategoryType}
			editable={editable}
			columns={columns}
			onUserDataChange={handleUserDataChange}
			mainCategories={mainCategories} // Pass main categories for dropdown
		/>
	);
}
