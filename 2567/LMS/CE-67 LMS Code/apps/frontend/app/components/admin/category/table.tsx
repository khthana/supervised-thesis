import { Button } from '@/components/global/shadcn/button';
import { Input } from '@/components/global/shadcn/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/global/shadcn/table';
import { useDataTable } from '@/hooks/useDataTable';
import { getPublicEnv } from '@/lib/env.client';
import type { CourseCategory } from '@shared/types/courses/course.model';
import type { Cell, ColumnDef } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Form, useActionData, useFetcher, useNavigation, useSubmit } from 'react-router-dom';
import { columns as defaultColumns } from './tablecat';

export type CategoryType = 'Main' | 'Sub';

interface UserDataTableProps {
	categories: CourseCategory[];
	CategoryType: CategoryType;
	editable?: boolean;
	onUserDataChange?: (updatedUsers: CourseCategory[]) => void;
	columns?: ColumnDef<CourseCategory>[];
	mainCategories?: CourseCategory[]; // Add main categories for selection in sub category
}

export default function CatDataTable({
	categories,
	CategoryType,
	editable = false,
	onUserDataChange,
	columns = defaultColumns, // Use the default columns if none provided
	mainCategories = [], // Default to empty array
}: UserDataTableProps) {
	const [tableConfig, setTableConfig] = useState({
		sorting: [],
		columnFilters: [],
		columnVisibility: {},
	});

	const [filteredUsers, setFilteredUsers] = useState(categories);
	const [isAddingNewRow, setIsAddingNewRow] = useState(false);
	const [newCategoryName, setNewCategoryName] = useState('');
	const [selectedMainCategory, setSelectedMainCategory] = useState<string | null>(null);
	const [submitError, setSubmitError] = useState<string | null>(null);

	const fetcher = useFetcher();
	const navigation = useNavigation();
	const actionData = useActionData() as { status: number; message: string; category: CourseCategory } | undefined;
	const isSubmitting = navigation.state === 'submitting' || fetcher.state === 'submitting';

	// Single state for all editing-related data
	const [editState, setEditState] = useState({
		cell: null as { rowId: number; columnId: string } | null,
		value: '',
		error: null as string | null,
	});

	const inputRef = useRef<HTMLInputElement>(null);
	const newRowInputRef = useRef<HTMLInputElement>(null);

	// Update filtered users when categories prop changes
	useEffect(() => {
		setFilteredUsers(categories);
	}, [categories]);

	// Combined validator functions
	const validators = useMemo(
		() => ({
			Name: {
				validate: (name: string) => {
					return {
						valid: name.trim() !== '',
						message: 'Category name cannot be empty',
					};
				},
			},
		}),
		[],
	);

	// Auto-focus when entering edit mode
	useEffect(() => {
		if (editState.cell && inputRef.current) {
			inputRef.current.focus();
		}
	}, [editState.cell]);

	// Auto-focus when adding new row
	useEffect(() => {
		if (isAddingNewRow && newRowInputRef.current) {
			newRowInputRef.current.focus();
		}
	}, [isAddingNewRow]);

	// Set first main category as default when in sub category mode
	useEffect(() => {
		if (isAddingNewRow && CategoryType === 'Sub' && mainCategories.length > 0 && !selectedMainCategory) {
			setSelectedMainCategory(mainCategories[0].category_id.toString());
		}
	}, [isAddingNewRow, CategoryType, mainCategories, selectedMainCategory]);

	useEffect(() => {
		if (fetcher.data) {
			const data = fetcher.data as { status: number; message: string; category: CourseCategory };

			if (data.status === 200) {
				console.log('Category created successfully:', data.category);

				setNewCategoryName('');
				setSelectedMainCategory(null);
				setIsAddingNewRow(false);
				setSubmitError(null);

				setTimeout(() => {
					window.location.reload();
				}, 500);
			} else {
				setSubmitError(data.message);
			}
		}
	}, [fetcher.data]);

	// Enter edit mode handler - memoized to avoid recreation
	const handleInlineEdit = useCallback(
		(cell: Cell<CourseCategory, unknown>) => {
			if (!editable) return;

			setEditState({
				cell: { rowId: cell.row.original.category_id, columnId: cell.column.id },
				value: cell.getValue() as string,
				error: null,
			});
		},
		[editable],
	);

	// Cancel editing
	const cancelEditing = useCallback(() => {
		setEditState({
			cell: null,
			value: '',
			error: null,
		});
	}, []);

	// Handle adding a new category
	const handleAddCategory = useCallback(() => {
		if (isAddingNewRow) {
			// Validate form data
			if (newCategoryName.trim() === '') {
				setSubmitError('Category name cannot be empty');
				return;
			}

			// For Sub category, validate that a main category is selected
			if (CategoryType === 'Sub' && !selectedMainCategory) {
				setSubmitError('Please select a main category');
				return;
			}

			const formData = new FormData();
			formData.append('name', newCategoryName);

			if (CategoryType === 'Sub') {
				formData.append('category_id', selectedMainCategory || '0');
			}

			fetcher.submit(formData, {
				method: 'post',
				action: CategoryType === 'Main' ? '/action/adm/createCat' : '/action/adm/createSubCat',
			});
		} else {
			// เปิดโหมดเพิ่ม category
			setIsAddingNewRow(true);
			setNewCategoryName('');
			setSelectedMainCategory(null);
			setSubmitError(null);
		}
	}, [isAddingNewRow, newCategoryName, selectedMainCategory, CategoryType, fetcher]);

	// Create the request body
	// const requestBody =
	// 	CategoryType === 'Main'
	// 		? { name: newCategoryName }
	// 		: {
	// 				name: newCategoryName,
	// 				category_id: Number.parseInt(selectedMainCategory || '0', 10),
	// 			};

	// Cancel adding new category
	const cancelAddCategory = useCallback(() => {
		setIsAddingNewRow(false);
		setNewCategoryName('');
		setSelectedMainCategory(null);
		setSubmitError(null);
	}, []);

	// Create table instance with memoized data
	const table = useDataTable({
		data: filteredUsers,
		columns: columns, // Use the provided columns
		initialPageSize: 6,
		initialSorting: tableConfig.sorting,
		initialColumnFilters: tableConfig.columnFilters,
		initialColumnVisibility: tableConfig.columnVisibility,
		enableRowSelection: true,
		enableMultiRowSelection: true,
	});

	// Render cell content - memoized to avoid recreation on each render
	const renderCellContent = useCallback(
		(cell: Cell<CourseCategory, unknown>) => {
			const { cell: editingCell, value: editedValue, error } = editState;
			const rowId = cell.row.original.category_id;
			const columnId = cell.column.id;

			if (editingCell?.rowId === rowId && editingCell?.columnId === columnId) {
				return (
					<Input
						ref={inputRef}
						type='text'
						value={editedValue}
						onChange={(e) => setEditState((prev) => ({ ...prev, value: e.target.value }))}
						className='w-full'
					/>
				);
			}

			return flexRender(cell.column.columnDef.cell, cell.getContext());
		},
		[editState],
	);

	// Get column count for new row display
	const columnCount = useMemo(() => {
		// Get visible columns from the table
		return table.getAllColumns().filter((col) => col.getIsVisible()).length;
	}, [table]);

	return (
		<div className='w-full'>
			{(editState.error || submitError) && (
				<div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4' role='alert'>
					<span className='block sm:inline'>{editState.error || submitError}</span>
				</div>
			)}

			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.original.category_id || `row-${row.id}`}
									data-state={row.getIsSelected() && 'selected'}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell
											key={cell.id}
											onDoubleClick={cell.column.id === 'actions' ? undefined : () => handleInlineEdit(cell)}
											className={editable ? 'cursor-pointer hover:bg-gray-50' : ''}
											onKeyDown={(e) => {
												if (cell.column.id === 'actions') return;

												if (e.key === 'Enter') {
													handleInlineEdit(cell);
												}
												if (e.key === 'Escape') {
													cancelEditing();
												}
												if (e.key === 'Tab') {
													cancelEditing();
												}
											}}
										>
											{renderCellContent(cell)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columnCount} className='h-24 text-center'>
									No results.
								</TableCell>
							</TableRow>
						)}

						{/* Add new category row */}
						{isAddingNewRow && (
							<TableRow className='bg-gray-50'>
								{/* Map dynamic columns to display appropriate fields */}
								{table
									.getAllColumns()
									.filter((col) => col.getIsVisible())
									.map((column) => {
										// ID column (usually first)
										if (column.id === 'rowNumber') {
											return (
												<TableCell key={`new-cell-${column.id}`}>
													<span className='text-gray-400'>Auto</span>
												</TableCell>
											);
										}

										// Name column
										if (column.id === 'name' || (column.id === 'category_id' && CategoryType === 'Main')) {
											return (
												<TableCell key={`new-cell-${column.id}`}>
													<Input
														ref={newRowInputRef}
														type='text'
														placeholder='Enter category name'
														value={newCategoryName}
														onChange={(e) => setNewCategoryName(e.target.value)}
														className={`w-full ${submitError?.includes('name') ? 'border-red-500' : ''}`}
													/>
												</TableCell>
											);
										}

										// For selecting main category when column id is 'parent_category' or similar
										if (column.id === 'category_id') {
											return (
												<TableCell key={`new-cell-${column.id}`}>
													<select
														value={selectedMainCategory || ''}
														onChange={(e) => setSelectedMainCategory(e.target.value)}
														className={`w-full p-2 border rounded ${submitError?.includes('main category') ? 'border-red-500' : ''}`}
													>
														<option value='' disabled>
															Select main category
														</option>
														{mainCategories.map((category) => (
															<option key={category.category_id} value={category.category_id.toString()}>
																{category.name}
															</option>
														))}
													</select>
												</TableCell>
											);
										}

										return (
											<TableCell key={`new-cell-${column.id}`}>
												<span className='text-gray-400'>Auto</span>
											</TableCell>
										);
									})}
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Add/Save button */}
			<div className='flex justify-end space-x-2 py-4'>
				<Button
					className={`${isAddingNewRow ? 'bg-green-600' : 'bg-blue-600'} rounded text-white`}
					variant='ghost'
					size='sm'
					onClick={handleAddCategory}
					disabled={isSubmitting}
				>
					{isSubmitting ? 'Saving...' : isAddingNewRow ? 'Save' : 'Add'}
				</Button>

				{isAddingNewRow && (
					<Button
						className='bg-gray-500 rounded text-white'
						variant='ghost'
						size='sm'
						onClick={cancelAddCategory}
						disabled={isSubmitting}
					>
						Cancel
					</Button>
				)}
			</div>

			<div className='flex items-center justify-end space-x-2 py-4'>
				<div className='flex-1 text-sm text-muted-foreground'>
					{table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected
				</div>
				<div className='space-x-2'>
					<Button
						variant='outline'
						size='sm'
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>
					<Button variant='outline' size='sm' onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}
