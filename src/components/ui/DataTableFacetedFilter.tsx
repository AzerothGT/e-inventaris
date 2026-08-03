import type { Column } from "@tanstack/react-table";
import { Check, PlusCircle } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/utils";
import { Badge } from "./Badge";
import { Button } from "./Button";

interface DataTableFacetedFilterProps<TData, TValue> {
	column?: Column<TData, TValue>;
	title?: string;
	options: {
		label: string;
		value: string;
		icon?: React.ComponentType<{ className?: string }>;
	}[];
}

export function DataTableFacetedFilter<TData, TValue>({
	column,
	title,
	options,
}: DataTableFacetedFilterProps<TData, TValue>) {
	const [isOpen, setIsOpen] = React.useState(false);
	const facets = column?.getFacetedUniqueValues();
	const selectedValues = new Set(column?.getFilterValue() as string[]);

	return (
		<div className="relative">
			<Button
				variant="outline"
				size="sm"
				className="h-8 border-dashed"
				onClick={() => setIsOpen(!isOpen)}
			>
				<PlusCircle className="mr-2 h-4 w-4" />
				{title}
				{selectedValues?.size > 0 && (
					<>
						<div className="mx-2 h-4 w-[1px] bg-surface-200" />
						<div className="flex space-x-1">
							{selectedValues.size > 2 ? (
								<Badge
									variant="secondary"
									className="rounded-sm px-1 font-normal"
								>
									{selectedValues.size} dipilih
								</Badge>
							) : (
								options
									.filter((option) => selectedValues.has(option.value))
									.map((option) => (
										<Badge
											variant="secondary"
											key={option.value}
											className="rounded-sm px-1 font-normal"
										>
											{option.label}
										</Badge>
									))
							)}
						</div>
					</>
				)}
			</Button>
			{isOpen && (
				<>
					<div
						className="fixed inset-0 z-40"
						onClick={() => setIsOpen(false)}
					/>
					<div className="absolute left-0 z-50 mt-2 w-48 rounded-xl border border-surface-200 bg-white p-1 shadow-lg">
						{options.map((option) => {
							const isSelected = selectedValues.has(option.value);
							return (
								<button
									key={option.value}
									className={cn(
										"relative flex w-full cursor-default select-none items-center rounded-lg px-2 py-1.5 text-sm outline-none hover:bg-surface-100",
										isSelected
											? "bg-surface-50 text-primary-600"
											: "text-surface-600",
									)}
									onClick={() => {
										if (isSelected) {
											selectedValues.delete(option.value);
										} else {
											selectedValues.add(option.value);
										}
										const filterValues = Array.from(selectedValues);
										column?.setFilterValue(
											filterValues.length ? filterValues : undefined,
										);
									}}
								>
									<div
										className={cn(
											"mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary-500",
											isSelected
												? "bg-primary-500 text-white"
												: "opacity-50 [&_svg]:invisible",
										)}
									>
										<Check className={cn("h-4 w-4")} />
									</div>
									{option.icon && (
										<option.icon className="mr-2 h-4 w-4 text-surface-400" />
									)}
									<span>{option.label}</span>
									{facets?.get(option.value) && (
										<span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-[10px]">
											{facets.get(option.value)}
										</span>
									)}
								</button>
							);
						})}
						{selectedValues.size > 0 && (
							<>
								<div className="my-1 h-[1px] bg-surface-100" />
								<button
									onClick={() => column?.setFilterValue(undefined)}
									className="relative flex w-full cursor-default select-none items-center justify-center rounded-lg px-2 py-1.5 text-center font-medium text-danger-500 text-sm hover:bg-surface-100"
								>
									Hapus Filter
								</button>
							</>
						)}
					</div>
				</>
			)}
		</div>
	);
}
