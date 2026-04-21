import { createFileRoute } from "@tanstack/react-router";
import {
	useSuspenseQuery,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import {
	getPermintaanList,
	createPermintaan,
} from "../../../server/functions/permintaan";
import { getKategoriList } from "../../../server/functions/kategori";
import { PermintaanStatusBadge } from "../../../components/permintaan/PermintaanStatusBadge";
import { PermintaanActionButtons } from "../../../components/permintaan/PermintaanActionButtons";
import { DataTable } from "../../../components/ui/DataTable";
import { DataTableColumnHeader } from "../../../components/ui/DataTableColumnHeader";
import { ColumnDef } from "@tanstack/react-table";
import { PermintaanStatus, UserRole } from "../../../lib/approvals";
import { getCurrentUser } from "../../../server/functions/auth";
import { PageHeader } from "../../../components/ui/PageHeader";
import { Dialog } from "../../../components/ui/Dialog";
import { ApprovalLogTable } from "../../../components/permintaan/ApprovalLogTable";
import { PermintaanForm } from "../../../components/permintaan/PermintaanForm";
import { useState } from "react";
import { ExportButton } from "../../../components/ui/ExportButton";
import { History, ClipboardList, Plus, Eye } from "lucide-react";
import { PermintaanDetail } from "../../../components/permintaan/PermintaanDetail";
import { Button } from "../../../components/ui/Button";
import { toast } from "sonner";
import { TablePageSkeleton } from "../../../components/ui/TablePageSkeleton";

export const Route = createFileRoute("/_authenticated/permintaan/")({
	loader: async ({ context }) => {
		return Promise.all([
			context.queryClient.ensureQueryData({
				queryKey: ["session"],
				queryFn: () => getCurrentUser(),
			}),
			context.queryClient.ensureQueryData({
				queryKey: ["permintaan"],
				queryFn: () => getPermintaanList(),
			}),
			context.queryClient.ensureQueryData({
				queryKey: ["kategori"],
				queryFn: () => getKategoriList(),
			}),
		]);
	},
	component: PermintaanListPage,
	pendingComponent: () => (
		<TablePageSkeleton title="Daftar" gradientTitle="Permintaan Barang" />
	),
});

import { useRouter } from "@tanstack/react-router";

function PermintaanListPage() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { data: user } = useSuspenseQuery({
		queryKey: ["session"],
		queryFn: () => getCurrentUser(),
	});

	const { data: permintaanList } = useSuspenseQuery({
		queryKey: ["permintaan"],
		queryFn: () => getPermintaanList(),
	});

	const { data: kategoriList } = useSuspenseQuery({
		queryKey: ["kategori"],
		queryFn: () => getKategoriList(),
	});

	const [selectedPermintaanId, setSelectedPermintaanId] = useState<
		string | null
	>(null);
	const [selectedDetailId, setSelectedDetailId] = useState<string | null>(null);
	const [isAddOpen, setIsAddOpen] = useState(false);

	const createMutation = useMutation({
		mutationFn: createPermintaan,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["permintaan"] });
			await router.invalidate();
			toast.success("Permintaan barang berhasil dikirim!");
			setIsAddOpen(false);
		},
		onError: (error: any) => {
			toast.error(error.message || "Gagal mengirim permintaan");
		},
	});

	const userRole = (user?.role as UserRole) || "penjaga_lab";

	const columns: ColumnDef<any>[] = [
		{
			accessorKey: "namaBarang",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Nama Barang" />
			),
			cell: ({ row }) => (
				<div className="font-medium text-surface-900">
					{row.getValue("namaBarang")}
				</div>
			),
		},
		{
			accessorKey: "jumlah",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Jumlah" />
			),
			cell: ({ row }) => (
				<div className="font-medium text-surface-600">
					{row.getValue("jumlah")}
				</div>
			),
		},
		{
			accessorKey: "prioritas",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Prioritas" />
			),
			cell: ({ row }) => {
				const prioritas = row.getValue("prioritas") as string;
				return (
					<span
						className={`capitalize font-medium ${
							prioritas === "tinggi"
								? "text-red-500"
								: prioritas === "sedang"
									? "text-yellow-500"
									: "text-green-500"
						}`}
					>
						{prioritas}
					</span>
				);
			},
		},
		{
			accessorKey: "status",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Status" />
			),
			cell: ({ row }) => (
				<PermintaanStatusBadge
					status={row.getValue("status") as PermintaanStatus}
				/>
			),
		},
		{
			id: "actions",
			cell: ({ row }) => {
				const item = row.original;
				return (
					<div className="flex justify-end items-center gap-2">
						<Button
							variant="secondary"
							size="icon"
							title="Detail"
							onClick={() => setSelectedDetailId(item.id)}
							className="h-9 w-9"
						>
							<Eye className="h-4 w-4" />
						</Button>

						<Button
							variant="secondary"
							size="icon"
							title="Riwayat"
							onClick={() => setSelectedPermintaanId(item.id)}
							className="h-9 w-9"
						>
							<History className="h-4 w-4" />
						</Button>

						<PermintaanActionButtons
							permintaanId={item.id}
							currentStatus={item.status as PermintaanStatus}
							userRole={userRole}
						/>
					</div>
				);
			},
		},
	];

	const exportColumns = [
		{ key: "namaBarang", label: "Nama Barang" },
		{ key: "merek", label: "Merek" },
		{ key: "kategori", label: "Kategori" },
		{ key: "jumlah", label: "Jumlah" },
		{ key: "prioritas", label: "Prioritas" },
		{
			key: "status",
			label: "Status",
			formatter: (value: string) => value.replace("_", " ").toUpperCase(),
		},
		{ key: "deskripsi", label: "Deskripsi" },
		{
			key: "createdAt",
			label: "Tanggal Pengajuan",
			formatter: (value: string) => new Date(value).toLocaleDateString("id-ID"),
		},
	];

	return (
		<div className="space-y-6">
			<PageHeader
				title="Daftar"
				gradientTitle="Permintaan Barang"
				actions={
					<>
						<ExportButton
							data={permintaanList || []}
							columns={exportColumns}
							filename="permintaan-barang"
							title="Permintaan Barang"
							subtitle={`Total: ${permintaanList?.length || 0} permintaan`}
						/>
						<Button
							onClick={() => setIsAddOpen(true)}
							className="glass-button flex items-center gap-2"
						>
							<Plus className="h-4 w-4" />
							Tambah Permintaan
						</Button>
					</>
				}
			/>

			<div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-surface-200/50 shadow-sm stagger-2">
				<div className="flex items-center gap-2 mb-4">
					<ClipboardList className="h-5 w-5 text-primary-500" />
					<h3 className="text-lg font-semibold text-surface-900">
						Semua Permintaan
					</h3>
				</div>

				<DataTable
					columns={columns}
					data={permintaanList || []}
					searchPlaceholder="Cari permintaan..."
					searchColumn="namaBarang"
				/>
			</div>

			<Dialog
				isOpen={isAddOpen}
				onClose={() => setIsAddOpen(false)}
				title="Buat Permintaan Barang"
			>
				<PermintaanForm
					onSubmit={(data) => createMutation.mutate({ data })}
					isLoading={createMutation.isPending}
					onCancel={() => setIsAddOpen(false)}
					kategoriOptions={kategoriList}
				/>
			</Dialog>

			<Dialog
				isOpen={selectedDetailId !== null}
				onClose={() => setSelectedDetailId(null)}
				title="Detail Permintaan"
				size="lg"
			>
				<div className="py-2">
					{selectedDetailId && (
						<PermintaanDetail
							data={permintaanList?.find((p) => p.id === selectedDetailId)}
						/>
					)}
				</div>
			</Dialog>

			<Dialog
				isOpen={selectedPermintaanId !== null}
				onClose={() => setSelectedPermintaanId(null)}
				title="Riwayat Persetujuan"
				size="lg"
			>
				<div className="py-2">
					{selectedPermintaanId && (
						<ApprovalLogTable permintaanId={selectedPermintaanId} />
					)}
				</div>
			</Dialog>
		</div>
	);
}
