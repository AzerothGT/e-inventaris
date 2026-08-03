import {
	type ColumnDef,
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table";
import { Search, X } from "lucide-react";
import * as React from "react";
import { Button } from "./Button";
import { DataTableFacetedFilter } from "./DataTableFacetedFilter";
import { DataTablePagination } from "./DataTablePagination";
import { Input } from "./Input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./Table";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	searchPlaceholder?: string;
	searchColumn?: string;
	facetedFilters?: {
		columnId: string;
		title: string;
		options: {
			label: string;
			value: string;
			icon?: React.ComponentType<{ className?: string }>;
		}[];
	}[];
	onFilteredDataChange?: (data: TData[]) => void;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	searchPlaceholder = "Cari data...",
	searchColumn = "nama",
	facetedFilters = [],
	onFilteredDataChange,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

	const filteredData = React.useMemo(() => {
		return table.getFilteredRowModel().rows.map((row) => row.original);
	}, [table.getFilteredRowModel]);

	React.useEffect(() => {
		if (onFilteredDataChange) {
			const timer = setTimeout(() => {
				onFilteredDataChange(filteredData);
			}, 0);
			return () => clearTimeout(timer);
		}
	}, [filteredData, onFilteredDataChange]);

	return (
		<div className="space-y-4">
			<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
				<div className="flex flex-1 flex-wrap items-center gap-2">
					<div className="relative w-full max-w-sm">
						<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-surface-400" />
						<Input
							type="search"
							name="search"
							autoComplete="new-password"
							data-lpignore="true"
							data-1p-ignore
							placeholder={searchPlaceholder}
							value={
								(table.getColumn(searchColumn)?.getFilterValue() as string) ??
								""
							}
							onChange={(event) =>
								table
									.getColumn(searchColumn)
									?.setFilterValue(event.target.value)
							}
							className="glass-input h-9 pl-10"
						/>
					</div>
					{facetedFilters.map((filter) => (
						<DataTableFacetedFilter
							key={filter.columnId}
							column={table.getColumn(filter.columnId)}
							title={filter.title}
							options={filter.options}
						/>
					))}
					{columnFilters.length > 0 && (
						<Button
							variant="ghost"
							onClick={() => table.resetColumnFilters()}
							className="h-8 px-2 text-xs lg:px-3"
						>
							Reset
							<X className="ml-2 h-4 w-4" />
						</Button>
					)}
				</div>
			</div>
			<div className="overflow-hidden border-surface-200 border-y bg-white">
				<Table>
					<TableHeader className="bg-surface-100">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow
								key={headerGroup.id}
								className="border-surface-100 hover:bg-transparent"
							>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id} className="py-3">
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
									className="border-surface-100/50"
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className="py-3">
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-32 text-center text-surface-500"
								>
									Tidak ada hasil ditemukan.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<DataTablePagination table={table} />
		</div>
	);
}
