import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Package, ShoppingCart, CheckCircle, Clock } from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader'


export const Route = createFileRoute('/_authenticated/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 11) return 'Selamat Pagi'
    if (hour < 15) return 'Selamat Siang'
    if (hour < 18) return 'Selamat Sore'
    return 'Selamat Malam'
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title={`${getGreeting()},`}
        gradientTitle="Tata Usaha!"
        suffix=" 👋"
      />


      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card glass-card-hover lift-card stagger-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-surface-500 uppercase tracking-wider">Total Barang</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
              <Package className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-surface-900">1,248</div>
            <p className="text-xs text-surface-500 mt-1">+12 barang bulan ini</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card glass-card-hover lift-card stagger-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-surface-500 uppercase tracking-wider">Pengajuan Aktif</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-warning-100 text-warning-600 flex items-center justify-center">
              <ShoppingCart className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-surface-900">5</div>
            <p className="text-xs text-warning-600 mt-1 font-medium">Menunggu persetujuan</p>
          </CardContent>
        </Card>
 
        <Card className="glass-card glass-card-hover lift-card stagger-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-surface-500 uppercase tracking-wider">Persetujuan Saya</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-danger-100 text-danger-600 flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-danger-600">2</div>
            <p className="text-xs text-surface-500 mt-1">Perlu tindakan segera</p>
          </CardContent>
        </Card>
 
        <Card className="glass-card glass-card-hover lift-card stagger-5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-surface-500 uppercase tracking-wider">Selesai (Bulan ini)</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-success-100 text-success-600 flex items-center justify-center">
              <CheckCircle className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-surface-900">8</div>
            <p className="text-xs text-success-600 mt-1 font-medium">Pengajuan berhasil</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 stagger-6">
          <CardHeader>
            <CardTitle>Aktivitas Pengajuan</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center text-surface-400 bg-surface-50/50 rounded-lg border border-dashed border-surface-200 mt-2">
            [Chart Area Placeholder]
          </CardContent>
        </Card>
        
        <Card className="col-span-3 stagger-7">

          <CardHeader>
            <CardTitle>Permintaan Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between border-b border-surface-100 last:border-0 pb-4 last:pb-0">
                  <div className="flex flex-col">
                    <span className="font-medium text-sm text-surface-900">Pengajuan PC Lab {i}</span>
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
