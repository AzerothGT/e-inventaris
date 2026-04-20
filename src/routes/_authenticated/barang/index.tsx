import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { barangQueries } from '../../../data/barangQueries'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/Table'
import { Badge } from '../../../components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card'
import { Package, Plus } from 'lucide-react'
import { Button } from '../../../components/ui/Button'

export const Route = createFileRoute('/_authenticated/barang/')({
  loader: ({ context }) => context.queryClient.ensureQueryData(barangQueries.list()),
  component: BarangListPage,
})

function BarangListPage() {
  const { data: items } = useSuspenseQuery(barangQueries.list())

  const getStatusColor = (status: string): "success" | "warning" | "destructive" | "secondary" => {
    switch (status) {
      case 'baik': return 'success'
      case 'rusak_ringan': return 'warning'
      case 'rusak_berat': return 'destructive'
      default: return 'secondary'
    }
  }

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').toUpperCase()
  }

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

      <Card className="glass-card shadow-xl border-none overflow-hidden">
        <CardHeader className="bg-surface-50/50 border-b border-surface-100">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary-500" />
            <CardTitle>Semua Barang</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Kode</TableHead>
                  <TableHead>Nama Barang</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Merek</TableHead>
                  <TableHead className="text-center">Jumlah</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-surface-500">
                      Belum ada data barang.
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow key={item.id} className="hover:bg-surface-50/50 transition-colors">
                      <TableCell className="font-mono text-xs font-semibold text-primary-600">
                        {item.kodeBarang}
                      </TableCell>
                      <TableCell className="font-medium text-surface-900">{item.nama}</TableCell>
                      <TableCell className="text-surface-600">{item.kategori}</TableCell>
                      <TableCell className="text-surface-600">{item.merek}</TableCell>
                      <TableCell className="text-center font-bold text-surface-900">{item.jumlah}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(item.status)}>
                          {formatStatus(item.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
