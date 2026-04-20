import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPermintaanList, createPermintaan } from '../../../server/functions/permintaan';
import { PermintaanStatusBadge } from '../../../components/permintaan/PermintaanStatusBadge';
import { PermintaanActionButtons } from '../../../components/permintaan/PermintaanActionButtons';
import { DataTable } from '../../../components/ui/DataTable';
import { DataTableColumnHeader } from '../../../components/ui/DataTableColumnHeader';
import { ColumnDef } from '@tanstack/react-table';
import { PermintaanStatus, UserRole } from '../../../lib/approvals';
import { getCurrentUser } from '../../../server/functions/auth';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Dialog } from '../../../components/ui/Dialog';
import { ApprovalLogTable } from '../../../components/permintaan/ApprovalLogTable';
import { PermintaanForm } from '../../../components/permintaan/PermintaanForm';
import { useState } from 'react';
import { History, ClipboardList, Plus } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { toast } from 'sonner';

export const Route = createFileRoute('/_authenticated/permintaan/')({
  component: PermintaanListPage,
});

function PermintaanListPage() {
  const queryClient = useQueryClient();
  const { data: user } = useQuery({
    queryKey: ['session'],
    queryFn: () => getCurrentUser(),
  });

  const { data: permintaanList, isLoading } = useQuery({
    queryKey: ['permintaan'],
    queryFn: () => getPermintaanList(),
  });

  const [selectedPermintaanId, setSelectedPermintaanId] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const createMutation = useMutation({
    mutationFn: createPermintaan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permintaan'] });
      toast.success('Permintaan barang berhasil dikirim!');
      setIsAddOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Gagal mengirim permintaan');
    }
  });

  const userRole = (user?.role as UserRole) || 'penjaga_lab';

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "namaBarang",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nama Barang" />
      ),
      cell: ({ row }) => (
        <div className="font-medium text-surface-900">{row.getValue("namaBarang")}</div>
      ),
    },
    {
      accessorKey: "jumlah",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Jumlah" />
      ),
      cell: ({ row }) => (
        <div className="font-medium text-surface-600">{row.getValue("jumlah")}</div>
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
          <span className={`capitalize font-medium ${
            prioritas === 'tinggi' ? 'text-red-500' : 
            prioritas === 'sedang' ? 'text-yellow-500' : 'text-green-500'
          }`}>
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
        <PermintaanStatusBadge status={row.getValue("status") as PermintaanStatus} />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex justify-end items-center gap-2">
             <Button 
              variant="ghost" 
              size="sm" 
              title="Riwayat"
              onClick={() => setSelectedPermintaanId(item.id)}
              className="h-8 w-8 p-0"
            >
              <History className="h-4 w-4 text-surface-500 hover:text-primary-600 transition-colors" />
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

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Daftar"
        gradientTitle="Permintaan Barang"
        actions={
          <Button onClick={() => setIsAddOpen(true)} className="glass-button flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Tambah Permintaan
          </Button>
        }
      />

      <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-surface-200/50 shadow-sm stagger-2">
        <div className="flex items-center gap-2 mb-4">
          <ClipboardList className="h-5 w-5 text-primary-500" />
          <h3 className="text-lg font-semibold text-surface-900">Semua Permintaan</h3>
        </div>

        <DataTable 
          columns={columns} 
          data={permintaanList || []} 
          searchPlaceholder="Cari permintaan..."
          searchColumn="namaBarang"
        />
      </div>

      <Dialog isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Buat Permintaan Barang">
        <PermintaanForm 
          onSubmit={(data) => createMutation.mutate({ data })} 
          isLoading={createMutation.isPending}
          onCancel={() => setIsAddOpen(false)}
        />
      </Dialog>

      <Dialog
        isOpen={selectedPermintaanId !== null}
        onClose={() => setSelectedPermintaanId(null)}
        title="Riwayat Persetujuan"
        size="lg"
      >
        <div className="py-2">
          {selectedPermintaanId && <ApprovalLogTable permintaanId={selectedPermintaanId} />}
        </div>
      </Dialog>
    </div>
  );
}

