import { createFileRoute, useRouter } from "@tanstack/react-router";
import {
	useSuspenseQuery,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { ruanganQueries } from "../../../data/ruanganQueries";
import { DataTable } from "../../../components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Warehouse, Plus } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { DataTableColumnHeader } from "../../../components/ui/DataTableColumnHeader";
import { DataTableRowActions } from "../../../components/ui/DataTableRowActions";
import { Dialog } from "../../../components/ui/Dialog";
import { RuanganForm } from "../../../components/inventory/RuanganForm";
import {
	createRuangan,
	updateRuangan,
	deleteRuangan,
} from "../../../server/functions/ruangan";
import { PageHeader } from "../../../components/ui/PageHeader";

import * as React from "react";
import { TablePageSkeleton } from "../../../components/ui/TablePageSkeleton";

export const Route = createFileRoute("/_authenticated/ruangan/")({
	loader: ({ context }) =>
		context.queryClient.ensureQueryData(ruanganQueries.list()),
	component: RuanganListPage,
	pendingComponent: () => (
		<TablePageSkeleton title="Daftar" gradientTitle="Ruangan" />
	),
});

function RuanganListPage() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { data: items } = useSuspenseQuery(ruanganQueries.list());

	const [isAddOpen, setIsAddOpen] = React.useState(false);
	const [editingItem, setEditingItem] = React.useState<any>(null);
	const [deletingItem, setDeletingItem] = React.useState<any>(null);

	const createMutation = useMutation({
		mutationFn: createRuangan,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ruanganQueries.all() });
			await router.invalidate();
			setIsAddOpen(false);
		},
	});

	const updateMutation = useMutation({
		mutationFn: updateRuangan,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ruanganQueries.all() });
			await router.invalidate();
			setEditingItem(null);
		},
	});

	const deleteMutation = useMutation({
		mutationFn: deleteRuangan,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ruanganQueries.all() });
			await router.invalidate();
			setDeletingItem(null);
		},
	});

	const columns: ColumnDef<any>[] = [
		{
			accessorKey: "kodeRuangan",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Kode Ruangan" />
			),
			cell: ({ row }) => (
				<div className="w-[120px] font-mono text-xs font-semibold text-primary-600">
					{row.getValue("kodeRuangan")}
				</div>
			),
		},
		{
			accessorKey: "nama",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Nama Ruangan" />
			),
			cell: ({ row }) => (
				<div className="font-medium text-surface-900">
					{row.getValue("nama")}
				</div>
			),
		},
		{
			accessorKey: "tipe",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Tipe" />
			),
			cell: ({ row }) => (
				<div className="text-surface-600 capitalize">
					{row.getValue("tipe")}
				</div>
			),
		},
		{
			accessorKey: "gedung",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Gedung" />
			),
			cell: ({ row }) => (
				<div className="text-surface-600 uppercase">
					{row.getValue("gedung")}
				</div>
			),
		},
		{
			id: "actions",
			cell: ({ row }) => (
				<DataTableRowActions
					row={row}
					onEdit={(item) => setEditingItem(item)}
					onDelete={(item) => setDeletingItem(item)}
				/>
			),
		},
	];



	return (
		<div className="space-y-6">
			<PageHeader
				title="Daftar"
				gradientTitle="Ruangan"
				actions={
					<>

						<Button
							onClick={() => setIsAddOpen(true)}
							className="glass-button flex items-center gap-2"
						>
							<Plus className="h-4 w-4" />
							Tambah Ruangan
						</Button>
					</>
				}
			/>

			<div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-surface-200/50 shadow-sm stagger-2">
				<div className="flex items-center gap-2 mb-4">
					<Warehouse className="h-5 w-5 text-primary-500" />
					<h3 className="text-lg font-semibold text-surface-900">
						Semua Ruangan
					</h3>
				</div>

				<DataTable
					columns={columns}
					data={items}
					searchPlaceholder="Cari ruangan..."
					searchColumn="nama"
				/>
			</div>

			{/* Add Modal */}
			<Dialog
				isOpen={isAddOpen}
				onClose={() => setIsAddOpen(false)}
				title="Tambah Ruangan Baru"
			>
				<RuanganForm
					onSubmit={(data) => createMutation.mutate({ data })}
					onCancel={() => setIsAddOpen(false)}
					isLoading={createMutation.isPending}
				/>
			</Dialog>

			{/* Edit Modal */}
			<Dialog
				isOpen={!!editingItem}
				onClose={() => setEditingItem(null)}
				title="Edit Ruangan"
			>
				{editingItem && (
					<RuanganForm
						initialData={editingItem}
						onSubmit={(data) =>
							updateMutation.mutate({ data: { ...data, id: editingItem.id } })
						}
						onCancel={() => setEditingItem(null)}
						isLoading={updateMutation.isPending}
					/>
				)}
			</Dialog>

			{/* Delete Confirmation */}
			<Dialog
				isOpen={!!deletingItem}
				onClose={() => setDeletingItem(null)}
				title="Hapus Ruangan"
			>
				{deletingItem && (
					<div className="space-y-4">
						<p className="text-surface-600">
							Apakah Anda yakin ingin menghapus ruangan{" "}
							<span className="font-bold text-surface-900">
								{deletingItem.nama}
							</span>
							? Tindakan ini tidak dapat dibatalkan.
						</p>
						<div className="flex justify-end gap-3">
							<Button variant="ghost" onClick={() => setDeletingItem(null)}>
								Batal
							</Button>
							<Button
								variant="destructive"
								onClick={() =>
									deleteMutation.mutate({ data: { id: deletingItem.id } })
								}
								disabled={deleteMutation.isPending}
							>
								{deleteMutation.isPending ? "Menghapus..." : "Hapus Ruangan"}
							</Button>
						</div>
					</div>
				)}
			</Dialog>
		</div>
	);
}
