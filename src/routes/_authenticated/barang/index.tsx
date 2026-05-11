import { createFileRoute } from "@tanstack/react-router";
import {
	useSuspenseQuery,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { barangQueries } from "../../../data/barangQueries";
import { ruanganQueries } from "../../../data/ruanganQueries";
import { kategoriQueries } from "../../../data/kategoriQueries";
import { DataTable } from "../../../components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../../../components/ui/Badge";
import { Package, Plus, ShieldCheck, ShieldAlert, Shield } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { DataTableColumnHeader } from "../../../components/ui/DataTableColumnHeader";
import { DataTableRowActions } from "../../../components/ui/DataTableRowActions";
import { Dialog } from "../../../components/ui/Dialog";
import { BarangForm } from "../../../components/inventory/BarangForm";
import {
	createBarang,
	updateBarang,
	deleteBarang,
} from "../../../server/functions/barang";
import { PageHeader } from "../../../components/ui/PageHeader";


import * as React from "react";

import { TablePageSkeleton } from "../../../components/ui/TablePageSkeleton";

export const Route = createFileRoute("/_authenticated/barang/")({
	loader: ({ context }) => {
		return Promise.all([
			context.queryClient.ensureQueryData(barangQueries.list()),
			context.queryClient.ensureQueryData(ruanganQueries.list()),
			context.queryClient.ensureQueryData(kategoriQueries.list()),
		]);
	},
	component: BarangListPage,
	pendingComponent: () => (
		<TablePageSkeleton title="Daftar" gradientTitle="Inventaris" />
	),
});

import { useRouter } from "@tanstack/react-router";

function BarangListPage() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { data: items } = useSuspenseQuery(barangQueries.list());
	const { data: rooms } = useSuspenseQuery(ruanganQueries.list());
	const { data: categories } = useSuspenseQuery(kategoriQueries.list());

	const [isAddOpen, setIsAddOpen] = React.useState(false);
	const [editingItem, setEditingItem] = React.useState<any>(null);
	const [deletingItem, setDeletingItem] = React.useState<any>(null);

	const createMutation = useMutation({
		mutationFn: createBarang,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: barangQueries.all() });
			await router.invalidate();
			setIsAddOpen(false);
		},
	});

	const updateMutation = useMutation({
		mutationFn: updateBarang,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: barangQueries.all() });
			await router.invalidate();
			setEditingItem(null);
		},
	});

	const deleteMutation = useMutation({
		mutationFn: deleteBarang,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: barangQueries.all() });
			await router.invalidate();
			setDeletingItem(null);
		},
	});

	const columns: ColumnDef<any>[] = [
		{
			accessorKey: "kodeBarang",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Kode" />
			),
			cell: ({ row }) => (
				<div className="w-[80px] font-mono text-xs font-semibold text-primary-600">
					{row.getValue("kodeBarang")}
				</div>
			),
		},
		{
			accessorKey: "nama",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Nama Barang" />
			),
			cell: ({ row }) => (
				<div className="font-medium text-surface-900">
					{row.getValue("nama")}
				</div>
			),
		},
		{
			accessorKey: "kategori",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Kategori" />
			),
			cell: ({ row }) => (
				<div className="text-surface-600">{row.getValue("kategori")}</div>
			),
		},
		{
			accessorKey: "merek",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Merek" />
			),
			cell: ({ row }) => (
				<div className="text-surface-600">{row.getValue("merek")}</div>
			),
		},
		{
			accessorKey: "namaRuangan",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Ruangan" />
			),
			cell: ({ row }) => (
				<div className="text-surface-600">
					{row.getValue("namaRuangan") || "-"}
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
					{row.getValue("gedung") || "-"}
				</div>
			),
		},
		{
			accessorKey: "jumlah",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Jumlah"
					className="justify-center"
				/>
			),
			cell: ({ row }) => (
				<div className="text-center font-bold text-surface-900">
					{row.getValue("jumlah")}
				</div>
			),
		},
		{
			accessorKey: "status",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Status" />
			),
			cell: ({ row }) => {
				const status = row.getValue("status") as string;
				const getStatusColor = (
					s: string,
				): "success" | "warning" | "destructive" | "secondary" => {
					switch (s) {
						case "baik":
							return "success";
						case "rusak_ringan":
							return "warning";
						case "rusak_berat":
							return "destructive";
						default:
							return "secondary";
					}
				};
				const formatStatus = (s: string) => s.replace("_", " ").toUpperCase();

				return (
					<Badge variant={getStatusColor(status)}>{formatStatus(status)}</Badge>
				);
			},
			filterFn: (row, id, value) => {
				return value.includes(row.getValue(id));
			},
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
				gradientTitle="Inventaris"
				actions={
					<>

						<Button
							onClick={() => setIsAddOpen(true)}
							className="glass-button flex items-center gap-2"
						>
							<Plus className="h-4 w-4" />
							Tambah Barang
						</Button>
					</>
				}
			/>

			<div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-surface-200/50 shadow-sm stagger-2">
				<div className="flex items-center gap-2 mb-4">
					<Package className="h-5 w-5 text-primary-500" />
					<h3 className="text-lg font-semibold text-surface-900">
						Semua Barang
					</h3>
				</div>

				<DataTable
					columns={columns}
					data={items}
					searchPlaceholder="Cari barang..."
					searchColumn="nama"
					facetedFilters={[
						{
							columnId: "status",
							title: "Status",
							options: [
								{ label: "Baik", value: "baik", icon: ShieldCheck },
								{ label: "Rusak Ringan", value: "rusak_ringan", icon: Shield },
								{
									label: "Rusak Berat",
									value: "rusak_berat",
									icon: ShieldAlert,
								},
							],
						},
					]}
				/>
			</div>

			{/* Add Modal */}
			<Dialog
				isOpen={isAddOpen}
				onClose={() => setIsAddOpen(false)}
				title="Tambah Barang Baru"
			>
				<BarangForm
					ruanganOptions={rooms}
					kategoriOptions={categories}
					onSubmit={(data) => createMutation.mutate({ data })}
					onCancel={() => setIsAddOpen(false)}
					isLoading={createMutation.isPending}
				/>
			</Dialog>

			{/* Edit Modal */}
			<Dialog
				isOpen={!!editingItem}
				onClose={() => setEditingItem(null)}
				title="Edit Barang"
			>
				{editingItem && (
					<BarangForm
						initialData={editingItem}
						ruanganOptions={rooms}
						kategoriOptions={categories}
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
				title="Hapus Barang"
			>
				{deletingItem && (
					<div className="space-y-4">
						<p className="text-surface-600">
							Apakah Anda yakin ingin menghapus barang{" "}
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
								{deleteMutation.isPending ? "Menghapus..." : "Hapus Barang"}
							</Button>
						</div>
					</div>
				)}
			</Dialog>
		</div>
	);
}
