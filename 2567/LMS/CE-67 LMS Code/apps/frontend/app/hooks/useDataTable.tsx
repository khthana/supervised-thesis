import {
	type ColumnDef,
	type ColumnFiltersState,
	type SortingState,
	type Table,
	type VisibilityState,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';

interface UseDataTableOptions<TData> {
	data: TData[];
	columns: ColumnDef<TData, unknown>[];
	initialPageSize?: number;
	initialSorting?: SortingState;
	initialColumnFilters?: ColumnFiltersState;
	initialColumnVisibility?: VisibilityState;
	enableRowSelection?: boolean;
	enableMultiRowSelection?: boolean;
	manualPagination?: boolean;
	manualSorting?: boolean;
	manualFiltering?: boolean;
	debugMode?: boolean;
}

export function useDataTable<TData>({
	data,
	columns,
	initialPageSize = 6,
	initialSorting = [],
	initialColumnFilters = [],
	initialColumnVisibility = {},
	enableRowSelection = false,
	enableMultiRowSelection = false,
	manualPagination = false,
	manualSorting = false,
	manualFiltering = false,
	debugMode = false,
}: UseDataTableOptions<TData>): Table<TData> {
	// Table state
	const [sorting, setSorting] = useState<SortingState>(initialSorting);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(initialColumnFilters);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialColumnVisibility);
	const [rowSelection, setRowSelection] = useState({});
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: initialPageSize,
	});

	if (debugMode) {
		useMemo(() => {
			console.log('Table State:', {
				sorting,
				columnFilters,
				columnVisibility,
				rowSelection,
				pagination,
			});
		}, [sorting, columnFilters, columnVisibility, rowSelection, pagination]);
	}

	return useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			pagination,
		},
		enableRowSelection,
		enableMultiRowSelection,
		manualPagination,
		manualSorting,
		manualFiltering,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: enableRowSelection ? setRowSelection : undefined,
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: manualFiltering ? undefined : getFilteredRowModel(),
		getPaginationRowModel: manualPagination ? undefined : getPaginationRowModel(),
		getSortedRowModel: manualSorting ? undefined : getSortedRowModel(),
		// Debug info in development
		debugTable: debugMode,
		debugHeaders: debugMode,
		debugColumns: debugMode,
	});
}
