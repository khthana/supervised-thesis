import { Button } from '@/components/global/shadcn/button';
import { createCommonColumns } from '@/lib/commonColumn';
import type { CourseCategory } from '@shared/types/courses/course.model';
import type { ColumnDef } from '@tanstack/react-table';
import { useFetcher } from 'react-router-dom';

export const mainColumns: ColumnDef<CourseCategory>[] = [
	...createCommonColumns<CourseCategory>(),
	{
		id: 'actions',
		cell: ({ row }) => {
			const category = row.original;

			// ใช้ hook ต้องอยู่ในฟังก์ชัน component เท่านั้น
			function DeleteButton() {
				const fetcher = useFetcher();

				function handleDelete() {
					if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบหมวดหมู่ "${category.name}"?`)) {
						const formData = new FormData();
						formData.append('category_id', category.category_id.toString());

						fetcher.submit(formData, {
							method: 'post',
							action: '/action/adm/deleteCat',
						});
					}
				}

				return (
					<Button
						variant='ghost'
						className='h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-100'
						onClick={handleDelete}
						disabled={fetcher.state === 'submitting'}
					>
						{fetcher.state === 'submitting' ? (
							<div className='h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent'>
								<span className='sr-only'>Loading...</span>
							</div>
						) : (
							<span className='material-symbols-outlined'>delete</span>
						)}
					</Button>
				);
			}

			return <DeleteButton />;
		},
	},
];
