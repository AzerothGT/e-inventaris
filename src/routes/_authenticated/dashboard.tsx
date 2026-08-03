import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Package, ShoppingCart, CheckCircle, Clock, ArrowRight, User, Tag, Calendar, XCircle, PlusCircle, Activity } from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader'
import { IconBox } from '../../components/ui/IconBox'
import { useSuspenseQuery } from '@tanstack/react-query'
import { getCurrentUser } from '../../server/functions/auth'
import { getDashboardStats, getRecentActivity, getApprovalQueue, getLowStockItems, getIncomingProcurements } from '../../server/functions/dashboard'
import { STATUS_METADATA, PermintaanStatus } from '../../lib/approvals'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

import { DashboardSkeleton } from '../../components/dashboard/DashboardSkeleton'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: Dashboard,
  pendingComponent: DashboardSkeleton,
})

import { QuickActions } from '../../components/dashboard/QuickActions'
import { OverviewChart } from '../../components/dashboard/OverviewChart'

function Dashboard() {
  const [greeting, setGreeting] = useState('Selamat Datang')

  const { data: user } = useSuspenseQuery({
    queryKey: ['currentUser'],
    queryFn: () => getCurrentUser(),
    staleTime: 0,
  })

  const { data: stats } = useSuspenseQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => getDashboardStats(),
    staleTime: 60 * 1000,
  })

  const { data: recentActivity } = useSuspenseQuery({
    queryKey: ['recentActivity'],
    queryFn: () => getRecentActivity(),
  })

  const { data: approvalQueue } = useSuspenseQuery({
    queryKey: ['approvalQueue'],
    queryFn: () => getApprovalQueue(),
  })

  const { data: lowStockItems } = useSuspenseQuery({
    queryKey: ['lowStockItems'],
    queryFn: () => getLowStockItems(),
  })

  const { data: incomingProcurements } = useSuspenseQuery({
    queryKey: ['incomingProcurements'],
    queryFn: () => getIncomingProcurements(),
  })

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 11) {
      setGreeting('Selamat Pagi')
      return
    }
    if (hour < 15) {
      setGreeting('Selamat Siang')
      return
    }
    if (hour < 18) {
      setGreeting('Selamat Sore')
      return
    }
    setGreeting('Selamat Malam')
  }, [])

  const role = user?.role as any

  return (
    <div className="space-y-4 pb-8">
      <PageHeader
        title={`${greeting},`}
        gradientTitle={user?.name || 'User'}
        suffix=" 👋"
      />

      {/* KPI Cards (12 cols) */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Barang"
          value={stats.totalBarang}
          subtitle="Inventaris tersedia"
          icon={Package}
          color="primary"
          stagger="stagger-1"
        />
        <StatCard
          title={role === 'penjaga_lab' ? "Permintaan Saya" : "Total Permintaan"}
          value={role === 'penjaga_lab' ? stats.pendingAction : stats.activeRequests}
          subtitle={role === 'penjaga_lab' ? "Sedang diproses" : "Menunggu tindakan"}
          icon={ShoppingCart}
          color="warning"
          stagger="stagger-2"
        />
        <StatCard
          title={role === 'penjaga_lab' ? "Selesai" : "Persetujuan Saya"}
          value={role === 'penjaga_lab' ? stats.completedMonth : stats.pendingAction}
          subtitle="Perlu perhatian"
          icon={Clock}
          color="danger"
          highlight={!['penjaga_lab', 'admin'].includes(role) && stats.pendingAction > 0}
          stagger="stagger-3"
        />
        <StatCard
          title="Aktivitas Sistem"
          value={recentActivity.length}
          subtitle="Aktivitas hari ini"
          icon={CheckCircle}
          color="success"
          stagger="stagger-4"
        />
      </div>

      {/* 12-column grid layout */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-12">
        
        {/* Approvals (8 cols) */}
        <div className="lg:col-span-8 flex flex-col">
          <Card className="glass-card shadow-sm border-surface-200 stagger-5 overflow-hidden flex flex-col h-full">
            <CardHeader className="flex flex-row items-center justify-between border-b border-surface-100 bg-surface-50/30 py-2.5 px-4">
              <div>
                <CardTitle className="text-sm font-semibold">Antrean Persetujuan</CardTitle>
                <p className="text-xs text-surface-500 mt-1">Permintaan yang menunggu tindakan Anda</p>
              </div>
              <Link
                to="/permintaan"
                className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
              >
                Lihat Semua <ArrowRight size={14} />
              </Link>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col justify-center">
              {role !== 'penjaga_lab' && approvalQueue.length > 0 ? (
                <div className="divide-y divide-surface-100">
                  {approvalQueue.map((item: any) => (
                    <div key={item.id} className="py-2.5 px-4 hover:bg-surface-50/50 transition-colors group">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-start gap-3 min-w-0">
                          <IconBox icon={Tag} variant="surface" size={18} className="group-hover:bg-primary-50 group-hover:text-primary-600 shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <h4 className="font-semibold text-sm text-surface-900">{item.namaEvent}</h4>
                            <p className="text-xs text-surface-500 break-words">Oleh: {item.requesterName} • {item.itemCount} jenis ({item.totalJumlah} unit)</p>
                          </div>
                        </div>
                        <div className={`text-xs font-semibold px-2.5 py-1 rounded-full tracking-wide border shrink-0 ${STATUS_METADATA[item.status as PermintaanStatus]?.color || ''}`}>
                          {STATUS_METADATA[item.status as PermintaanStatus]?.label}
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
              ) : (
                <div className="p-8 text-center text-surface-400 italic text-sm">
                  Tidak ada permintaan yang membutuhkan tindakan Anda
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Low Stock (4 cols) */}
        <div className="lg:col-span-4 flex flex-col">
          <Card className="glass-card shadow-sm border-surface-200 stagger-5 overflow-hidden flex flex-col h-full">
            <CardHeader className="flex flex-row items-center justify-between border-b border-surface-100 bg-surface-50/30 py-2.5 px-4">
              <div>
                <CardTitle className="text-sm font-semibold">Stok Rendah</CardTitle>
                <p className="text-xs text-surface-500 mt-1">Barang di bawah batas minimal (10 unit)</p>
              </div>
              <Link
                to="/barang"
                className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
              >
                Lihat Semua <ArrowRight size={14} />
              </Link>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col justify-center">
              {lowStockItems.length > 0 ? (
                <div className="divide-y divide-surface-100">
                  {lowStockItems.map((item: any) => (
                    <div key={item.id} className="py-2.5 px-4 hover:bg-surface-50/50 transition-colors flex items-center justify-between">
                      <div className="min-w-0 pr-3">
                        <h4 className="font-semibold text-sm text-surface-900 truncate">{item.nama}</h4>
                        <p className="text-xs text-surface-500 truncate">{item.namaRuangan || 'Tanpa Ruangan'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg border shrink-0 ${
                          item.jumlah <= 3 
                            ? 'bg-danger-50 text-danger-600 border-danger-200' 
                            : 'bg-warning-50 text-warning-600 border-warning-200'
                        }`}>
                          {item.jumlah} {item.satuan}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-surface-400 italic text-sm">
                  Semua stok aman
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Inventory Chart (8 cols, hidden on mobile) */}
        <div className="lg:col-span-8 hidden lg:block">
          <OverviewChart />
        </div>

        {/* Procurement Status / Incoming (4 cols) */}
        <div className="lg:col-span-4 flex flex-col">
          <Card className="glass-card shadow-sm border-surface-200 stagger-6 overflow-hidden flex flex-col h-full">
            <CardHeader className="flex flex-row items-center justify-between border-b border-surface-100 bg-surface-50/30 py-2.5 px-4">
              <div>
                <CardTitle className="text-sm font-semibold">Status Pengadaan</CardTitle>
                <p className="text-xs text-surface-500 mt-1">Item masuk & proses berjalan</p>
              </div>
              <Link
                to="/permintaan"
                className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
              >
                Lihat Semua <ArrowRight size={14} />
              </Link>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col justify-center">
              {incomingProcurements.length > 0 ? (
                <div className="divide-y divide-surface-100">
                  {incomingProcurements.map((item: any) => {
                    // Progress percentage based on status
                    let progress = 25
                    let progressColor = 'bg-warning-500'
                    if (item.status === 'disetujui') {
                      progress = 60
                      progressColor = 'bg-primary-500'
                    } else if (item.status === 'proses_pembelian') {
                      progress = 85
                      progressColor = 'bg-success-500'
                    }
                    return (
                      <div key={item.id} className="py-2.5 px-4 hover:bg-surface-50/50 transition-colors space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h4 className="font-semibold text-sm text-surface-900 truncate">{item.namaEvent}</h4>
                            <p className="text-xs text-surface-500">{item.itemCount} jenis ({item.totalJumlah} unit)</p>
                          </div>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border shrink-0 ${STATUS_METADATA[item.status as PermintaanStatus]?.color || ''}`}>
                            {STATUS_METADATA[item.status as PermintaanStatus]?.label}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="w-full bg-surface-100 rounded-full h-1.5 overflow-hidden">
                            <div className={`h-full ${progressColor} rounded-full transition-all duration-500`} style={{ width: `${progress}%` }} />
                          </div>
                          <div className="flex justify-between text-[10px] text-surface-400 font-semibold">
                            <span>Disetujui</span>
                            <span>Proses</span>
                            <span>Dikirim</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="p-8 text-center text-surface-400 italic text-sm">
                  Tidak ada pengadaan aktif berjalan
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity (12 cols) */}
        <div className="lg:col-span-12">
          <Card className="glass-card shadow-sm border-surface-200 stagger-7 overflow-hidden">
            <CardHeader className="border-b border-surface-100 py-2.5 px-4 flex flex-row items-center justify-between bg-surface-50/30">
              <div>
                <CardTitle className="text-sm font-semibold">Aktivitas Terbaru</CardTitle>
                <p className="text-xs text-surface-500 mt-1">Log perubahan status & pengadaan terbaru</p>
              </div>
              <IconBox icon={Activity} variant="primary" size={18} />
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-surface-100">
                {recentActivity.slice(0, 5).map((activity: any) => {
                  let ActivityIcon = User
                  let iconVariant: 'surface' | 'success' | 'danger' | 'primary' | 'warning' = 'surface'

                  const actionLower = activity.action.toLowerCase()
                  const newStatusLower = (activity.newStatus || '').toLowerCase()

                  if (actionLower.includes('selesai') || newStatusLower === 'selesai') {
                    ActivityIcon = CheckCircle
                    iconVariant = 'success'
                  } else if (newStatusLower === 'ditolak') {
                    ActivityIcon = XCircle
                    iconVariant = 'danger'
                  } else if (actionLower.includes('mengajukan') || actionLower.includes('buat')) {
                    ActivityIcon = PlusCircle
                    iconVariant = 'primary'
                  } else if (newStatusLower === 'proses_pembelian' || actionLower.includes('pembelian')) {
                    ActivityIcon = Package
                    iconVariant = 'warning'
                  } else if (actionLower.includes('tinjau') || actionLower.includes('update')) {
                    ActivityIcon = Clock
                    iconVariant = 'primary'
                  }

                  return (
                    <div key={activity.id} className="py-2.5 px-4 flex items-center justify-between hover:bg-surface-50/50 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <IconBox icon={ActivityIcon} variant={iconVariant} size={14} className="w-8 h-8 rounded-full shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-surface-900 leading-relaxed truncate">
                            <span className="font-bold text-surface-950">{activity.userName}</span> {activity.action.toLowerCase()}
                            <span className="font-semibold text-primary-600 ml-1 italic">"{activity.namaEvent || 'Permintaan'}"</span>
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-surface-400 font-medium">
                            <span>
                              {format(new Date(activity.createdAt), 'dd MMM yyyy, HH:mm', { locale: id })}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-surface-300" />
                            <span className="text-[10px] font-bold text-surface-500 uppercase tracking-wider">
                              {activity.newStatus.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Link 
                        to="/permintaan"
                        className="text-xs font-semibold text-primary-600 hover:underline shrink-0 pl-2"
                      >
                        Detail
                      </Link>
                    </div>
                  )
                })}
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

      {/* Quick Actions (at the bottom) */}
      <QuickActions role={role} />
    </div>
  )
}

function StatCard({ title, value, subtitle, icon, color, highlight, stagger }: any) {
  return (
    <Card className={`glass-card glass-card-hover lift-card ${stagger}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 pt-3.5 px-4">
        <CardTitle className="text-xs font-bold text-surface-500 tracking-wider uppercase">{title}</CardTitle>
        <IconBox icon={icon} variant={color} size={14} className="shadow-sm w-7 h-7" />
      </CardHeader>
      <CardContent className="pb-3.5 px-4 pt-0">
        <div className={`text-2xl font-black ${highlight ? 'text-danger-600 animate-pulse' : 'text-surface-900'}`}>
          {value}
        </div>
        <p className="text-xs text-surface-400 font-medium">{subtitle}</p>
      </CardContent>
    </Card>
  )
}

