import { createFileRoute } from "@tanstack/react-router";
import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getPengadaanEventList,
  createPengadaanEvent,
} from "../../../server/functions/permintaan";
import { getKategoriList } from "../../../server/functions/kategori";
import { PermintaanStatusBadge } from "../../../components/permintaan/PermintaanStatusBadge";
import { PermintaanActionButtons } from "../../../components/permintaan/PermintaanActionButtons";
import { DataTable } from "../../../components/ui/DataTable";
import { DataTableColumnHeader } from "../../../components/ui/DataTableColumnHeader";
import { ColumnDef } from "@tanstack/react-table";
import { PermintaanStatus, UserRole, STATUS_METADATA } from "../../../lib/approvals";
import { ExportButton } from "../../../components/ui/ExportButton";
import { getCurrentUser } from "../../../server/functions/auth";
import { PageHeader } from "../../../components/ui/PageHeader";
import { Dialog } from "../../../components/ui/Dialog";
import { ApprovalLogTable } from "../../../components/permintaan/ApprovalLogTable";
import { PengadaanEventForm } from "../../../components/permintaan/PengadaanEventForm";
import { PengadaanEventDetail } from "../../../components/permintaan/PengadaanEventDetail";
import { IconBox } from "../../../components/ui/IconBox";
import { useState } from "react";
import { History, ClipboardList, Plus, Eye, Package } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { toast } from "sonner";
import { TablePageSkeleton } from "../../../components/ui/TablePageSkeleton";
import { useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/permintaan/")({
  loader: async ({ context }) => {
    return Promise.all([
      context.queryClient.ensureQueryData({
        queryKey: ["session"],
        queryFn: () => getCurrentUser(),
      }),
      context.queryClient.ensureQueryData({
        queryKey: ["permintaan"],
        queryFn: () => getPengadaanEventList(),
      }),
      context.queryClient.ensureQueryData({
        queryKey: ["kategori"],
        queryFn: () => getKategoriList(),
      }),
    ]);
  },
  component: PermintaanListPage,
  pendingComponent: () => (
    <TablePageSkeleton title="Pengajuan" gradientTitle="Permintaan Barang" />
  ),
});

const permintaanExportColumns = [
  { key: "kodePengadaan", label: "Nomor Pengajuan" },
  { key: "namaEvent", label: "Nama Event" },
  { key: "deskripsi", label: "Deskripsi" },
  {
    key: "prioritas",
    label: "Prioritas",
    formatter: (v: string) => (v ? v.toUpperCase() : ""),
  },
  {
    key: "status",
    label: "Status",
    formatter: (v: string) =>
      v ? (STATUS_METADATA[v as PermintaanStatus]?.label || v).toUpperCase() : "",
  },
  {
    key: "items",
    label: "Barang",
    formatter: (items: any[]) =>
      items
        ? items
            .map((i) => `${i.namaBarang} (${i.jumlah} ${i.satuan || "Unit"})`)
            .join(", ")
        : "",
  },
  { key: "requesterName", label: "Pengaju" },
  {
    key: "createdAt",
    label: "Tanggal Pengajuan",
    formatter: (v: any) =>
      v ? new Date(v).toLocaleDateString("id-ID") : "",
  },
];

function PermintaanListPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: user } = useSuspenseQuery({
    queryKey: ["session"],
    queryFn: () => getCurrentUser(),
  });

  const { data: eventList } = useSuspenseQuery({
    queryKey: ["permintaan"],
    queryFn: () => getPengadaanEventList(),
  });

  const { data: kategoriList } = useSuspenseQuery({
    queryKey: ["kategori"],
    queryFn: () => getKategoriList(),
  });

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedDetailId, setSelectedDetailId] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [filteredItems, setFilteredItems] = useState<any[]>(eventList || []);

  const createMutation = useMutation({
    mutationFn: createPengadaanEvent,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["permintaan"] });
      await router.invalidate();
      toast.success("Permintaan pengadaan berhasil dikirim!");
      setIsAddOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Gagal mengirim permintaan");
    },
  });

  const userRole = (user?.role as UserRole) || "penjaga_lab";

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "kodePengadaan",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nomor Pengajuan" />
      ),
      cell: ({ row }) => (
        <span className="font-mono text-xs text-surface-600">
          {row.getValue("kodePengadaan") || "-"}
        </span>
      ),
    },
    {
      accessorKey: "namaEvent",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nama Event" />
      ),
      cell: ({ row }) => (
        <div>
          <p className="text-surface-900">
            {row.getValue("namaEvent")}
          </p>
          <p className="text-xs text-surface-400 mt-0.5">
            {row.original.items?.length ?? 0} item
          </p>
        </div>
      ),
    },
    {
      id: "jumlahItem",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Barang" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-surface-600">
          <Package className="h-3.5 w-3.5" />
          <span className="font-medium">
            {row.original.items?.length ?? 0} jenis
          </span>
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
                ? "text-danger-600"
                : prioritas === "sedang"
                ? "text-warning-600"
                : "text-success-600"
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
              onClick={() => setSelectedEventId(item.id)}
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengajuan"
        gradientTitle="Permintaan Barang"
        actions={
          <div className="flex items-center gap-2">
            <ExportButton
              data={filteredItems}
              columns={permintaanExportColumns}
              filename={`permintaan-pengadaan-${new Date().toISOString().split("T")[0]}`}
              title="Daftar Permintaan Pengadaan Barang"
              subtitle={`Diekspor pada: ${new Date().toLocaleString("id-ID")}`}
            />
            <Button
              onClick={() => setIsAddOpen(true)}
              className="glass-button flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Buat Permintaan
            </Button>
          </div>
        }
      />

      <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-surface-200/50 shadow-sm stagger-2">
        <div className="flex items-center gap-2 mb-4">
          <IconBox icon={ClipboardList} variant="primary" size={20} />
          <h3 className="text-lg font-semibold text-surface-900">
            Semua Permintaan Pengadaan
          </h3>
        </div>

        <DataTable
          columns={columns}
          data={eventList || []}
          onFilteredDataChange={setFilteredItems}
          searchPlaceholder="Cari event pengadaan..."
          searchColumn="namaEvent"
        />
      </div>

      {/* Add Dialog */}
      <Dialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Buat Permintaan Pengadaan"
        size="xl"
      >
        <PengadaanEventForm
          onSubmit={(data) => createMutation.mutate({ data })}
          isLoading={createMutation.isPending}
          onCancel={() => setIsAddOpen(false)}
          kategoriOptions={kategoriList ?? []}
        />
      </Dialog>

      {/* Detail Dialog */}
      <Dialog
        isOpen={selectedDetailId !== null}
        onClose={() => setSelectedDetailId(null)}
        title="Detail Permintaan"
        size="lg"
      >
        <div className="py-2">
          {selectedDetailId && (
            <PengadaanEventDetail
              data={eventList?.find((e) => e.id === selectedDetailId)}
            />
          )}
        </div>
      </Dialog>

      {/* Approval Log Dialog */}
      <Dialog
        isOpen={selectedEventId !== null}
        onClose={() => setSelectedEventId(null)}
        title="Riwayat Persetujuan"
        size="lg"
      >
        <div className="py-2">
          {selectedEventId && (
            <ApprovalLogTable permintaanId={selectedEventId} />
          )}
        </div>
      </Dialog>
    </div>
  );
}
