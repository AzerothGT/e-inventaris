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
import { MultipleBarangForm } from "../../../components/inventory/MultipleBarangForm";
import {
	createBarang,
	createMultipleBarang,
	updateBarang,
	deleteBarang,
} from "../../../server/functions/barang";
import { PageHeader } from "../../../components/ui/PageHeader";
import { IconBox } from "../../../components/ui/IconBox";
import { ExportButton } from "../../../components/ui/ExportButton";
import { toast } from "sonner";
import { cn } from "../../../lib/utils";


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

const barangExportColumns = [
	{ key: "kodeBarang", label: "Kode Barang" },
	{ key: "nama", label: "Nama Barang" },
	{ key: "kategori", label: "Kategori" },
	{ key: "merek", label: "Merek" },
	{ key: "noSeri", label: "No Seri" },
	{ key: "tahunPengadaan", label: "Tahun" },
	{ key: "jumlah", label: "Jumlah" },
	{
		key: "status",
		label: "Kondisi",
		formatter: (v: string) => (v ? v.replace("_", " ").toLowerCase() : ""),
	},
	{ key: "namaRuangan", label: "Ruangan" },
];

function BarangListPage() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { data: items } = useSuspenseQuery(barangQueries.list());
	const { data: rooms } = useSuspenseQuery(ruanganQueries.list());
	const { data: categories } = useSuspenseQuery(kategoriQueries.list());

	const [isAddOpen, setIsAddOpen] = React.useState(false);
	const [formMode, setFormMode] = React.useState<"single" | "multiple">("single");
	const [editingItem, setEditingItem] = React.useState<any>(null);
	const [deletingItem, setDeletingItem] = React.useState<any>(null);
	const [filteredItems, setFilteredItems] = React.useState<any[]>(items);

	const createMutation = useMutation({
		mutationFn: createBarang,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: barangQueries.all() });
			await router.invalidate();
			setIsAddOpen(false);
			toast.success("Barang berhasil ditambahkan");
		},
		onError: (error: any) => {
			toast.error(error.message || "Gagal menambahkan barang");
		},
	});

	const createMultipleMutation = useMutation({
		mutationFn: createMultipleBarang,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: barangQueries.all() });
			await router.invalidate();
			setIsAddOpen(false);
			setFormMode("single");
			toast.success("Semua barang berhasil ditambahkan");
		},
		onError: (error: any) => {
			toast.error(error.message || "Gagal menambahkan barang");
		},
	});

	const updateMutation = useMutation({
		mutationFn: updateBarang,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: barangQueries.all() });
			await router.invalidate();
			setEditingItem(null);
			toast.success("Barang berhasil diperbarui");
		},
		onError: (error: any) => {
			toast.error(error.message || "Gagal memperbarui barang");
		},
	});

	const deleteMutation = useMutation({
		mutationFn: deleteBarang,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: barangQueries.all() });
			await router.invalidate();
			setDeletingItem(null);
			toast.success("Barang berhasil dihapus");
		},
		onError: (error: any) => {
			toast.error(error.message || "Gagal menghapus barang");
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
			<div className="font-medium text-surface-900 capitalize">
				{(row.getValue("nama") as string)?.toLowerCase()}
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
			filterFn: (row, id, value) => {
				return value.includes(row.getValue(id));
			},
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
			filterFn: (row, id, value) => {
				return value.includes(row.getValue(id));
			},
		},
		{
			accessorKey: "gedung",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Gedung" />
			),
			cell: ({ row }) => (
				<div className="text-surface-600">
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
				const formatStatus = (s: string) => s.replace("_", " ").toLowerCase();

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
					<div className="flex items-center gap-2">
						<ExportButton
							data={filteredItems}
							columns={barangExportColumns}
							filename={`daftar-inventaris-${new Date().toISOString().split("T")[0]}`}
							title="Daftar Inventaris Barang"
							subtitle={`Diekspor pada: ${new Date().toLocaleString("id-ID")}`}
						/>
						<Button
							onClick={() => setIsAddOpen(true)}
							className="glass-button flex items-center gap-2"
						>
							<Plus className="h-4 w-4" />
							Tambah Barang
						</Button>
					</div>
				}
			/>

			<div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-surface-200/50 shadow-sm stagger-2">
				<div className="flex items-center gap-2 mb-4">
					<IconBox icon={Package} variant="primary" size={20} />
					<h3 className="text-lg font-semibold text-surface-900">
						Semua Barang
					</h3>
				</div>

				<DataTable
					columns={columns}
					data={items}
					onFilteredDataChange={setFilteredItems}
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
						{
							columnId: "kategori",
							title: "Kategori",
							options: categories.map((c) => ({
								label: c.nama,
								value: c.nama,
							})),
						},
						{
							columnId: "namaRuangan",
							title: "Ruangan",
							options: rooms.map((r) => ({
								label: r.nama,
								value: r.nama,
							})),
						},
					]}
				/>
			</div>

			{/* Add Modal */}
			<Dialog
				isOpen={isAddOpen}
				onClose={() => {
					setIsAddOpen(false);
					setFormMode("single");
				}}
				title="Tambah Barang Baru"
				size={formMode === "single" ? "lg" : "xl"}
			>
				<div className="space-y-6">
					<div className="flex justify-center">
						<div className="flex bg-surface-100 p-1 rounded-xl border border-surface-200/50">
							<button
								type="button"
								onClick={() => setFormMode("single")}
								className={cn(
									"px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
									formMode === "single"
										? "bg-white text-surface-900 shadow-sm"
										: "text-surface-500 hover:text-surface-900"
								)}
							>
								Satu Barang
							</button>
							<button
								type="button"
								onClick={() => setFormMode("multiple")}
								className={cn(
									"px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
									formMode === "multiple"
										? "bg-white text-surface-900 shadow-sm"
										: "text-surface-500 hover:text-surface-900"
								)}
							>
								Banyak Barang
							</button>
						</div>
					</div>

					{formMode === "single" ? (
						<BarangForm
							ruanganOptions={rooms}
							kategoriOptions={categories}
							onSubmit={(data) => createMutation.mutate({ data })}
							onCancel={() => {
								setIsAddOpen(false);
								setFormMode("single");
							}}
							isLoading={createMutation.isPending}
						/>
					) : (
						<MultipleBarangForm
							ruanganOptions={rooms}
							kategoriOptions={categories}
							onSubmit={(data) => createMultipleMutation.mutate({ data })}
							onCancel={() => {
								setIsAddOpen(false);
								setFormMode("single");
							}}
							isLoading={createMultipleMutation.isPending}
						/>
					)}
				</div>
			</Dialog>

			{/* Edit Modal */}
			<Dialog
				isOpen={!!editingItem}
				onClose={() => setEditingItem(null)}
				title="Edit Barang"
				size="lg"
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
