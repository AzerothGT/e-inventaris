import { Row } from "@tanstack/react-table"
import { Edit2, Trash2 } from "lucide-react"
import { Button } from "./Button"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  onEdit: (value: TData) => void
  onDelete: (value: TData) => void
}

export function DataTableRowActions<TData>({
  row,
  onEdit,
  onDelete,
}: DataTableRowActionsProps<TData>) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onEdit(row.original)}
        className="h-8 w-8 p-0 text-primary-600 hover:text-primary-700 hover:bg-primary-50"
      >
        <Edit2 className="h-4 w-4" />
        <span className="sr-only">Edit</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(row.original)}
        className="h-8 w-8 p-0 text-danger-600 hover:text-danger-700 hover:bg-danger-50"
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Hapus</span>
      </Button>
    </div>
  )
}
