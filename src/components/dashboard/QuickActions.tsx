import { Link } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { PlusCircle, List, CheckSquare, Package, BarChart3 } from 'lucide-react'
import { UserRole } from '../../lib/approvals'

interface QuickAction {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  roles: UserRole[] | 'all'
  variant: 'primary' | 'success' | 'warning' | 'info'
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    title: 'Buat Permintaan',
    description: 'Ajukan permintaan pengadaan barang baru',
    icon: <PlusCircle size={20} />,
    href: '/permintaan', // Normally this would open a modal, but for now we link to the page
    roles: ['penjaga_lab', 'orang_tu', 'admin'],
    variant: 'primary',
  },
  {
    title: 'Tinjau Persetujuan',
    description: 'Periksa item yang menunggu persetujuan Anda',
    icon: <CheckSquare size={20} />,
    href: '/permintaan',
    roles: ['kaprog', 'wakasek_kurikulum', 'wakasek_kesiswaan', 'kepala_sekolah', 'admin'],
    variant: 'warning',
  },
  {
    title: 'Proses Pembelian',
    description: 'Kelola item yang siap dibeli',
    icon: <Package size={20} />,
    href: '/permintaan',
    roles: ['tu_admin', 'admin'],
    variant: 'success',
  },
  {
    title: 'Daftar Barang',
    description: 'Lihat dan kelola inventaris sekolah',
    icon: <List size={20} />,
    href: '/barang',
    roles: 'all',
    variant: 'info',
  },
  {
    title: 'Laporan Sistem',
    description: 'Lihat statistik dan laporan pengadaan',
    icon: <BarChart3 size={20} />,
    href: '/dashboard',
    roles: ['admin', 'kepala_sekolah'],
    variant: 'primary',
  },
]

export function QuickActions({ role }: { role: UserRole }) {
  const filteredActions = QUICK_ACTIONS.filter(
    (action) => action.roles === 'all' || action.roles.includes(role)
  )

  const variantStyles = {
    primary: 'bg-primary-50 text-primary-600 border-primary-100 hover:bg-primary-100',
    success: 'bg-success-50 text-success-600 border-success-100 hover:bg-success-100',
    warning: 'bg-warning-50 text-warning-600 border-warning-100 hover:bg-warning-100',
    info: 'bg-surface-50 text-surface-600 border-surface-100 hover:bg-surface-100',
  }

  return (
    <Card className="glass-card shadow-sm border-surface-200 stagger-7">
      <CardHeader>
        <CardTitle className="text-lg">Tautan Cepat</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        {filteredActions.map((action, i) => (
          <Link
            key={i}
            to={action.href}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 group ${variantStyles[action.variant]}`}
          >
            <div className={`p-2 rounded-lg bg-white shadow-sm group-hover:scale-110 transition-transform`}>
              {action.icon}
            </div>
            <div className="text-left">
              <p className="text-sm font-bold leading-none mb-1">{action.title}</p>
              <p className="text-[10px] opacity-80 leading-tight">{action.description}</p>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
