import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { ruanganQueries } from '../../../data/ruanganQueries'
import { DataTable } from '../../../components/ui/DataTable'
import { ColumnDef } from '@tanstack/react-table'
import { Warehouse, Plus } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { DataTableColumnHeader } from '../../../components/ui/DataTableColumnHeader'

export const Route = createFileRoute('/_authenticated/ruangan/')({
  loader: ({ context }) => context.queryClient.ensureQueryData(ruanganQueries.list()),
  component: RuanganListPage,
})

function RuanganListPage() {
  const { data: items } = useSuspenseQuery(ruanganQueries.list())

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
        <div className="font-medium text-surface-900">{row.getValue("nama")}</div>
      ),
    },
    {
      accessorKey: "tipe",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tipe" />
      ),
      cell: ({ row }) => (
        <div className="text-surface-600 capitalize">{row.getValue("tipe")}</div>
      ),
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
            Daftar <span className="text-gradient">Ruangan</span> 🏫
          </h2>
          <p className="text-surface-500 mt-1">Kelola data ruangan dan lokasi inventaris.</p>
        </div>
        <Button className="glass-button flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Tambah Ruangan
        </Button>
      </div>

      <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-surface-200/50 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Warehouse className="h-5 w-5 text-primary-500" />
          <h3 className="text-lg font-semibold text-surface-900">Semua Ruangan</h3>
        </div>

        <DataTable
          columns={columns}
          data={items}
          searchPlaceholder="Cari berdasarkan nama atau kode ruangan..."
        />
      </div>
    </div>
  )
}
