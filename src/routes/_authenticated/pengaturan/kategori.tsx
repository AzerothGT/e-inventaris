import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getKategoriList, createKategori } from '../../../server/functions/kategori';
import { DataTable } from '../../../components/ui/DataTable';
import { DataTableColumnHeader } from '../../../components/ui/DataTableColumnHeader';
import { ColumnDef } from '@tanstack/react-table';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Dialog } from '../../../components/ui/Dialog';
import { KategoriForm } from '../../../components/kategori/KategoriForm';
import { KategoriTableActions } from '../../../components/kategori/KategoriTableActions';
import { useState } from 'react';
import { Tag, Plus } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { toast } from 'sonner';
import { IconBox } from '../../../components/ui/IconBox';
import { TablePageSkeleton } from '../../../components/ui/TablePageSkeleton';

export const Route = createFileRoute('/_authenticated/pengaturan/kategori')({
  loader: async ({ context }) => {
    return context.queryClient.ensureQueryData({
      queryKey: ['kategori'],
      queryFn: () => getKategoriList(),
    });
  },
  component: KategoriPage,
  pendingComponent: () => <TablePageSkeleton title="Manajemen" gradientTitle="Kategori Barang" />,
});

function KategoriPage() {
  const queryClient = useQueryClient();
  const { data: kategoriList } = useSuspenseQuery({
    queryKey: ['kategori'],
    queryFn: () => getKategoriList(),
  });

  const [isAddOpen, setIsAddOpen] = useState(false);

  const createMutation = useMutation({
    mutationFn: createKategori,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kategori'] });
      toast.success('Kategori berhasil ditambahkan');
      setIsAddOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Gagal menambahkan kategori');
    },
  });

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'nama',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nama Kategori" />
      ),
      cell: ({ row }) => (
        <div className="font-medium text-surface-900">{row.getValue('nama')}</div>
      ),
    },
    {
      accessorKey: 'deskripsi',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Deskripsi" />
      ),
      cell: ({ row }) => (
        <div className="text-surface-500 max-w-md truncate">
          {row.getValue('deskripsi') || '-'}
        </div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => <KategoriTableActions kategori={row.original} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Manajemen"
        gradientTitle="Kategori Barang"
        actions={
          <Button onClick={() => setIsAddOpen(true)} className="glass-button flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Tambah Kategori
          </Button>
        }
      />

      <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-surface-200/50 shadow-sm stagger-2">
        <div className="flex items-center gap-2 mb-4">
          <IconBox icon={Tag} variant="primary" size={20} />
          <h3 className="text-lg font-semibold text-surface-900">Daftar Kategori</h3>
        </div>

        <DataTable 
          columns={columns} 
          data={kategoriList || []} 
          searchPlaceholder="Cari kategori..."
          searchColumn="nama"
        />
      </div>

      <Dialog isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Tambah Kategori Baru">
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
