import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Package, ShoppingCart, CheckCircle, Clock, ArrowRight, User, Tag, Calendar } from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader'
import { useSuspenseQuery } from '@tanstack/react-query'
import { getCurrentUser } from '../../server/functions/auth'
import { getDashboardStats, getRecentActivity, getApprovalQueue } from '../../server/functions/dashboard'
import { STATUS_METADATA, PermintaanStatus } from '../../lib/approvals'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  const { data: user } = useSuspenseQuery({
    queryKey: ['currentUser'],
    queryFn: () => getCurrentUser(),
  })

  const { data: stats } = useSuspenseQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => getDashboardStats(),
  })

  const { data: recentActivity } = useSuspenseQuery({
    queryKey: ['recentActivity'],
    queryFn: () => getRecentActivity(),
  })

  const { data: approvalQueue } = useSuspenseQuery({
    queryKey: ['approvalQueue'],
    queryFn: () => getApprovalQueue(),
  })

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 11) return 'Selamat Pagi'
    if (hour < 15) return 'Selamat Siang'
    if (hour < 18) return 'Selamat Sore'
    return 'Selamat Malam'
  }

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title={`${getGreeting()},`}
        gradientTitle={user?.name || 'User'}
        suffix=" 👋"
      />

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Barang"
          value={stats.totalBarang}
          subtitle="Inventaris tersedia"
          icon={<Package className="h-5 w-5" />}
          color="primary"
          stagger="stagger-1"
        />
        <StatCard
          title="Permintaan Aktif"
          value={stats.activeRequests}
          subtitle="Sedang diproses"
          icon={<ShoppingCart className="h-5 w-5" />}
          color="warning"
          stagger="stagger-2"
        />
        <StatCard
          title={user?.role === 'penjaga_lab' ? "Permintaan Saya" : "Persetujuan Saya"}
          value={stats.pendingAction}
          subtitle="Perlu tindakan segera"
          icon={<Clock className="h-5 w-5" />}
          color="danger"
          highlight={stats.pendingAction > 0}
          stagger="stagger-3"
        />
        <StatCard
          title="Selesai"
          value={stats.completedMonth}
          subtitle="Bulan ini"
          icon={<CheckCircle className="h-5 w-5" />}
          color="success"
          stagger="stagger-4"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* Main Section: Approval Queue or Activity Chart */}
        <div className="lg:col-span-4 space-y-6">
          {user?.role !== 'penjaga_lab' && approvalQueue.length > 0 ? (
            <Card className="glass-card shadow-sm border-surface-200 stagger-5 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b border-surface-100 bg-surface-50/30">
                <div>
                  <CardTitle className="text-lg">Antrean Persetujuan</CardTitle>
                  <p className="text-xs text-surface-500 mt-1">Permintaan yang menunggu tindakan Anda</p>
                </div>
                <Link
                  to="/permintaan"
                  className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
                >
                  Lihat Semua <ArrowRight size={14} />
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-surface-100">
                  {approvalQueue.map((item: any) => (
                    <div key={item.id} className="p-4 hover:bg-surface-50/50 transition-colors group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-surface-100 text-surface-600 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors`}>
                            <Tag size={18} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm text-surface-900">{item.namaBarang}</h4>
                            <p className="text-xs text-surface-500">Oleh: {item.requesterName} • {item.jumlah} Unit</p>
                          </div>
                        </div>
                        <div className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${STATUS_METADATA[item.status as PermintaanStatus].color}`}>
                          {STATUS_METADATA[item.status as PermintaanStatus].label}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2 text-surface-400">
                          <Calendar size={12} />
                          {format(new Date(item.createdAt), 'dd MMM yyyy', { locale: id })}
                        </div>
                        <Link
                          to={`/permintaan`}
                          className="px-3 py-1 bg-white border border-surface-200 rounded-lg text-xs font-medium text-surface-700 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all shadow-sm"
                        >
                          Tinjau
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="glass-card shadow-sm border-surface-200 stagger-5">
              <CardHeader>
                <CardTitle className="text-lg">Ringkasan Aktivitas</CardTitle>
              </CardHeader>
              <CardContent className="h-[350px] flex flex-col items-center justify-center text-surface-400 bg-surface-50/30 rounded-xl border border-dashed border-surface-200 m-2">
                <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mb-4 text-surface-300">
                  <Package size={32} />
                </div>
                <p className="text-sm font-medium">Visualisasi data akan muncul di sini</p>
                <p className="text-xs mt-1">Menunggu lebih banyak data sistem...</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Section: Recent Activity / History */}
        <div className="lg:col-span-3">
          <Card className="glass-card shadow-sm border-surface-200 stagger-6 h-full">
            <CardHeader className="border-b border-surface-100">
              <CardTitle className="text-lg">Aktivitas Terbaru</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-surface-100">
                {recentActivity.map((activity: any) => (
                  <div key={activity.id} className="p-4 flex gap-3 hover:bg-surface-50/50 transition-colors">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-surface-100 flex items-center justify-center text-surface-600">
                        <User size={14} />
                      </div>
                    </div>
                    <div className="space-y-1 min-w-0">
                      <p className="text-xs text-surface-900 leading-relaxed">
                        <span className="font-bold">{activity.userName}</span> {activity.action.toLowerCase()}
                        <span className="font-medium text-primary-600 ml-1 italic">"{activity.namaBarang}"</span>
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-surface-400">
                          {format(new Date(activity.createdAt), 'HH:mm', { locale: id })}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-surface-300" />
                        <span className="text-[10px] font-medium text-surface-500">
                          {activity.newStatus.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {recentActivity.length === 0 && (
                  <div className="p-8 text-center text-surface-400 italic text-sm">
                    Belum ada aktivitas tercatat
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, subtitle, icon, color, highlight, stagger }: any) {
  const colorMap = {
    primary: 'bg-primary-100 text-primary-600',
    warning: 'bg-warning-100 text-warning-600',
    danger: 'bg-danger-100 text-danger-600',
    success: 'bg-success-100 text-success-600',
  }

  return (
    <Card className={`glass-card glass-card-hover lift-card ${stagger}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-bold text-surface-500 uppercase tracking-widest">{title}</CardTitle>
        <div className={`w-10 h-10 rounded-xl ${colorMap[color as keyof typeof colorMap]} flex items-center justify-center shadow-sm`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-4xl font-black ${highlight ? 'text-danger-600 animate-pulse' : 'text-surface-900'}`}>
          {value}
        </div>
        <p className="text-[11px] text-surface-500 mt-1 font-medium font-mono">{subtitle}</p>
      </CardContent>
    </Card>
  )
}
