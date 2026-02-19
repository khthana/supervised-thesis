import type { CourseCategory } from '@shared/types/courses/course.model';
import CatTable from './catTable';
import { createSubColumns } from './subColumns';

interface SubTableProps {
	catgories: CourseCategory[];
	mainCategories?: CourseCategory[]; // Main categories for dropdown selection
}

export default function SubTable({ catgories, mainCategories = [] }: SubTableProps) {
	// Generate columns with main category names
	const subColumns = createSubColumns(mainCategories);

	return (
		<CatTable
			Categories={catgories}
			CategoryType='Sub'
			editable={true}
			columns={subColumns}
			mainCategories={mainCategories}
		/>
	);
}
