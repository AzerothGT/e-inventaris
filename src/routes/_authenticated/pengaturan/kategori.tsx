import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus, Tag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { KategoriForm } from "../../../components/kategori/KategoriForm";
import { KategoriTableActions } from "../../../components/kategori/KategoriTableActions";
import { Button } from "../../../components/ui/Button";
import { DataTable } from "../../../components/ui/DataTable";
import { DataTableColumnHeader } from "../../../components/ui/DataTableColumnHeader";
import { Dialog } from "../../../components/ui/Dialog";
import { IconBox } from "../../../components/ui/IconBox";
import { PageHeader } from "../../../components/ui/PageHeader";
import { TablePageSkeleton } from "../../../components/ui/TablePageSkeleton";
import {
	createKategori,
	getKategoriList,
} from "../../../server/functions/kategori";

export const Route = createFileRoute("/_authenticated/pengaturan/kategori")({
	loader: async ({ context }) => {
		return context.queryClient.ensureQueryData({
			queryKey: ["kategori"],
			queryFn: () => getKategoriList(),
		});
	},
	component: KategoriPage,
	pendingComponent: () => (
		<TablePageSkeleton title="Manajemen" gradientTitle="Kategori Barang" />
	),
});

function KategoriPage() {
	const queryClient = useQueryClient();
	const { data: kategoriList } = useSuspenseQuery({
		queryKey: ["kategori"],
		queryFn: () => getKategoriList(),
	});

	const [isAddOpen, setIsAddOpen] = useState(false);

	const createMutation = useMutation({
		mutationFn: createKategori,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["kategori"] });
			toast.success("Kategori berhasil ditambahkan");
			setIsAddOpen(false);
		},
		onError: (error: Error) => {
			toast.error(error.message || "Gagal menambahkan kategori");
		},
	});

	const columns: ColumnDef<Record<string, unknown>>[] = [
		{
			accessorKey: "nama",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Nama Kategori" />
			),
			cell: ({ row }) => (
				<div className="font-medium text-surface-900">
					{row.getValue("nama")}
				</div>
			),
		},
		{
			accessorKey: "deskripsi",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Deskripsi" />
			),
			cell: ({ row }) => (
				<div className="max-w-md truncate text-surface-500">
					{row.getValue("deskripsi") || "-"}
				</div>
			),
		},
		{
			id: "actions",
			cell: ({ row }) => <KategoriTableActions kategori={row.original as { id: string; nama: string; deskripsi: string | null }} />,
		},
	];

	return (
		<div className="space-y-6">
			<PageHeader
				title="Manajemen"
				gradientTitle="Kategori Barang"
				actions={
					<Button
						onClick={() => setIsAddOpen(true)}
						className="glass-button flex items-center gap-2"
					>
						<Plus className="h-4 w-4" />
						Tambah Kategori
					</Button>
				}
			/>

			<div className="stagger-2 rounded-xl border border-surface-200/50 bg-white/50 p-6 shadow-sm backdrop-blur-sm">
				<div className="mb-4 flex items-center gap-2">
					<IconBox icon={Tag} variant="primary" size={20} />
					<h3 className="font-semibold text-lg text-surface-900">
						Daftar Kategori
					</h3>
				</div>

				<DataTable
					columns={columns}
					data={kategoriList || []}
					searchPlaceholder="Cari kategori..."
					searchColumn="nama"
				/>
			</div>

			<Dialog
				isOpen={isAddOpen}
				onClose={() => setIsAddOpen(false)}
				title="Tambah Kategori Baru"
			>
				<div className="py-2">
					<KategoriForm
						onSubmit={(data) => createMutation.mutate({ data })}
						isLoading={createMutation.isPending}
						onCancel={() => setIsAddOpen(false)}
					/>
				</div>
			</Dialog>
		</div>
	);
}
