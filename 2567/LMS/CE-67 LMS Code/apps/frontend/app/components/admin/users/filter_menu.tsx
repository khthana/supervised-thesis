import { Button } from '@/components/global/shadcn/button';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/global/shadcn/dropdown-menu';
import { Input } from '@/components/global/shadcn/input';
import type { Table } from '@tanstack/react-table';
import { useMemo } from 'react';

interface FilterMenuProps<TData> {
	table: Table<TData>;
}

// ปรับปรุงให้ใช้ useMemo เพื่อลดการรีเรนเดอร์ที่ไม่จำเป็น
export function FilterMenu<TData>({ table }: FilterMenuProps<TData>) {
	// Memoize filter options to prevent recreation on each render
	const filterOptions = useMemo(
		() => [
			{
				id: 'email',
				label: 'Email',
				type: 'select',
				options: [
					{ value: '@gmail.com', label: 'Gmail' },
					{ value: '@kmitl.ac.th', label: 'KMITL Mail' },
				],
			},
			{
				id: 'is_verified',
				label: 'Verification',
				type: 'select',
				options: [
					{ value: 'true', label: 'Verified' },
					{ value: 'false', label: 'Unverified' },
				],
			},
		],
		[],
	);

	// Memoize sort options to prevent recreation on each render
	const sortOptions = useMemo(
		() => [
			{
				id: 'fullName_en',
				label: 'Name',
				options: [
					{
						value: 'asc',
						label: 'A to Z',
						icon: <span className='material-symbols-outlined'>arrow_upward</span>,
					},
					{
						value: 'desc',
						label: 'Z to A',
						icon: <span className='material-symbols-outlined'>arrow_downward</span>,
					},
				],
			},
			{
				id: 'is_verified',
				label: 'Verified',
				options: [
					{
						value: 'asc',
						label: 'Verified first',
						icon: <span className='material-symbols-outlined'>check</span>,
					},
					{
						value: 'desc',
						label: 'Unverified first',
						icon: <span className='material-symbols-outlined'>close</span>,
					},
				],
			},
		],
		[],
	);

	// Get the current email filter value
	const emailFilterValue = (table.getColumn('email')?.getFilterValue() as string) ?? '';

	// Handler for email filter change
	const handleEmailFilterChange = (value: string) => {
		table.getColumn('email')?.setFilterValue(value);
	};

	// ใช้ memoized handlers เพื่อป้องกันการสร้างฟังก์ชันใหม่ทุกครั้งที่มีการ render
	const handleFilterChange = (columnId: string, value: string) => {
		const column = table.getColumn(columnId);
		if (column) {
			const currentValue = column.getFilterValue();
			column.setFilterValue(currentValue === value ? undefined : value);
		}
	};

	const handleSortChange = (columnId: string, desc: boolean) => {
		const column = table.getColumn(columnId);
		if (column) {
			column.toggleSorting(desc);
		}
	};

	const handleColumnVisibilityChange = (columnId: string, isVisible: boolean) => {
		const column = table.getColumn(columnId);
		if (column) {
			column.toggleVisibility(isVisible);
		}
	};

	const handlePageSizeChange = (pageSize: number) => {
		table.setPageSize(pageSize);
	};

	return (
		<div>
			<div className='grid grid-cols-2 items-center pb-4'>
				<Input
					placeholder='Filter emails...'
					value={emailFilterValue}
					onChange={(event) => handleEmailFilterChange(event.target.value)}
					className='max-w-sm'
				/>
				<div className='flex items-center justify-end space-x-2'>
					{/* Filter */}
					<DropdownMenu>
						<DropdownMenuTrigger>
							<Button variant='outline'>
								<span className='material-symbols-outlined'>filter_alt</span>
								<span className='ml-2'>Filter</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end'>
							{filterOptions.map((option) => (
								<DropdownMenuSub key={option.id}>
									<DropdownMenuSubTrigger>{option.label}</DropdownMenuSubTrigger>
									<DropdownMenuSubContent>
										{option.type === 'select' ? (
											option.options?.map((item) => (
												<DropdownMenuCheckboxItem
													key={item.value}
													checked={table.getColumn(option.id)?.getFilterValue() === item.value}
													onCheckedChange={() => handleFilterChange(option.id, item.value)}
												>
													{item.label}
												</DropdownMenuCheckboxItem>
											))
										) : (
											<Input
												value={table.getColumn(option.id)?.getFilterValue() as string}
												onChange={(event) => {
													table.getColumn(option.id)?.setFilterValue(event.target.value);
												}}
											/>
										)}
									</DropdownMenuSubContent>
								</DropdownMenuSub>
							))}
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Sort by */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='outline' className='w-fit border border-gray-200 rounded-md py-1 px-4'>
								<span className={'material-symbols-outlined'}>sort</span>
								<span className='ml-2 items-center text-sm text-muted-foreground'>Sort by</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end'>
							{sortOptions.map((option) => (
								<DropdownMenuSub key={option.id}>
									<DropdownMenuSubTrigger className='capitalize pl-2'>{option.label}</DropdownMenuSubTrigger>
									<DropdownMenuSubContent>
										{option.options.map((sortOption) => (
											<DropdownMenuCheckboxItem
												key={sortOption.value}
												checked={table.getColumn(option.id)?.getIsSorted() === sortOption.value}
												onCheckedChange={() => handleSortChange(option.id, sortOption.value === 'desc')}
												className='flex items-center'
											>
												{sortOption.icon}
												<span className='ml-2'>{sortOption.label}</span>
											</DropdownMenuCheckboxItem>
										))}
									</DropdownMenuSubContent>
								</DropdownMenuSub>
							))}
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Column Showing */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='outline' className='ml-auto'>
								<span className='material-symbols-outlined'>view_column</span>
								<span className='ml-2 items-center text-sm text-muted-foreground'>Column</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end'>
							{table
								.getAllColumns()
								.filter((column) => column.getCanHide())
								.map((column) => {
									return (
										<DropdownMenuCheckboxItem
											key={column.id}
											className='capitalize'
											checked={column.getIsVisible()}
											onCheckedChange={(value) => handleColumnVisibilityChange(column.id, !!value)}
										>
											{column.id}
										</DropdownMenuCheckboxItem>
									);
								})}
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Row Pagination */}
					<DropdownMenu>
						<DropdownMenuTrigger>
							<Button variant='outline'>
								<span className='material-symbols-outlined'>table_rows</span>
								<span className='ml-2'>{table.getState().pagination.pageSize} Rows</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							{[6, 12, 24, 48].map((pageSize) => (
								<DropdownMenuCheckboxItem
									key={pageSize}
									checked={table.getState().pagination.pageSize === pageSize}
									onCheckedChange={() => handlePageSizeChange(pageSize)}
								>
									{pageSize} rows
								</DropdownMenuCheckboxItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</div>
	);
}
