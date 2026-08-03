import type { Row } from "@tanstack/react-table";
import { Edit2, Trash2 } from "lucide-react";
import { Button } from "./Button";

interface DataTableRowActionsProps<TData> {
	row: Row<TData>;
	onEdit: (value: TData) => void;
	onDelete: (value: TData) => void;
}

export function DataTableRowActions<TData>({
	row,
	onEdit,
	onDelete,
}: DataTableRowActionsProps<TData>) {
	return (
		<div className="flex items-center justify-end gap-2">
			<Button
				variant="secondary"
				size="icon"
				onClick={() => onEdit(row.original)}
				className="h-8 w-8 text-primary-600 hover:bg-primary-100/50 hover:text-primary-700"
			>
				<Edit2 className="h-4 w-4" />
				<span className="sr-only">Edit</span>
			</Button>
			<Button
				variant="secondary"
				size="icon"
				onClick={() => onDelete(row.original)}
				className="h-8 w-8 text-danger-600 hover:bg-danger-100/50 hover:text-danger-700"
			>
				<Trash2 className="h-4 w-4" />
				<span className="sr-only">Hapus</span>
			</Button>
		</div>
	);
}
