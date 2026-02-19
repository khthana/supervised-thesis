import type { CourseCategory } from '@shared/types/courses/course.model';
import CatTable from './catTable';
import { mainColumns } from './mainColumns';

export default function MainTable({ catgories }: { catgories: CourseCategory[] }) {
	return <CatTable Categories={catgories} CategoryType='Main' editable={true} columns={mainColumns} />;
}
