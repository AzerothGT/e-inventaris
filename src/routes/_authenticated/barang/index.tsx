import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { barangQueries } from '../../../data/barangQueries'
import { DataTable } from '../../../components/ui/DataTable'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '../../../components/ui/Badge'
import { Package, Plus } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { DataTableColumnHeader } from '../../../components/ui/DataTableColumnHeader'

export const Route = createFileRoute('/_authenticated/barang/')({
  loader: ({ context }) => context.queryClient.ensureQueryData(barangQueries.list()),
  component: BarangListPage,
})


function BarangListPage() {
  const { data: items } = useSuspenseQuery(barangQueries.list())

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
        <div className="font-medium text-surface-900">{row.getValue("nama")}</div>
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
        <div className="text-surface-600">{row.getValue("namaRuangan") || "-"}</div>
      ),
    },
    {
      accessorKey: "jumlah",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Jumlah" className="justify-center" />
      ),
      cell: ({ row }) => (
        <div className="text-center font-bold text-surface-900">{row.getValue("jumlah")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        const getStatusColor = (s: string): "success" | "warning" | "destructive" | "secondary" => {
          switch (s) {
            case 'baik': return 'success'
            case 'rusak_ringan': return 'warning'
            case 'rusak_berat': return 'destructive'
            default: return 'secondary'
          }
        }
        const formatStatus = (s: string) => s.replace('_', ' ').toUpperCase()

        return (
          <Badge variant={getStatusColor(status)}>
            {formatStatus(status)}
          </Badge>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      id: "actions",
      cell: ({ }) => (
        <div className="text-right">
          <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700">
            Edit
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-surface-900">
            Daftar <span className="text-gradient">Inventaris</span> 📦
          </h2>
          <p className="text-surface-500 mt-1">Kelola dan pantau status barang inventaris sekolah.</p>
        </div>
        <Button className="glass-button flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Tambah Barang
        </Button>
      </div>

      <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-surface-200/50 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Package className="h-5 w-5 text-primary-500" />
          <h3 className="text-lg font-semibold text-surface-900">Semua Barang</h3>
        </div>

        <DataTable
          columns={columns}
          data={items}
          searchPlaceholder="Cari berdasarkan nama, kode, atau kategori..."
        />
      </div>
    </div>
  )
}
