import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Package, ShoppingCart, CheckCircle, Clock } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-surface-500">Selamat datang kembali. Berikut ringkasan aktivitas.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-surface-500">Total Barang</CardTitle>
            <Package className="h-4 w-4 text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-surface-900">1,248</div>
            <p className="text-xs text-surface-500">+12 barang bulan ini</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-surface-500">Pengadaan Aktif</CardTitle>
            <ShoppingCart className="h-4 w-4 text-warning-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-surface-900">5</div>
            <p className="text-xs text-warning-600">Menunggu persetujuan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-surface-500">Persetujuan Saya</CardTitle>
            <Clock className="h-4 w-4 text-danger-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-danger-600">2</div>
            <p className="text-xs text-surface-500">Perlu tindakan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-surface-500">Selesai (Bulan ini)</CardTitle>
            <CheckCircle className="h-4 w-4 text-success-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-surface-900">8</div>
            <p className="text-xs text-success-600">Pengadaan selesai</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Aktivitas Pengadaan</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center text-surface-400 bg-surface-50/50 rounded-lg border border-dashed border-surface-200 mt-2">
            [Chart Area Placeholder]
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Permintaan Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between border-b border-surface-100 last:border-0 pb-4 last:pb-0">
                  <div className="flex flex-col">
                    <span className="font-medium text-sm text-surface-900">Pengadaan PC Lab {i}</span>
                    <span className="text-xs text-surface-500">Oleh: Penjaga Lab</span>
                  </div>
                  <div className="text-xs font-medium px-2 py-1 bg-warning-50 text-warning-700 rounded-full">
                    Menunggu Kaprog
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
