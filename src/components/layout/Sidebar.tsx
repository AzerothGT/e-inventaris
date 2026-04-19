import { Link } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Package,
  FilePen,
  House,
  Bell,
  Users,
  LogOut,
} from 'lucide-react'

// Placeholder role for now until Auth is implemented
const CURRENT_ROLE = 'tu'

export function Sidebar() {
  const menuItems = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      to: '/dashboard',
      roles: ['penjaga_lab', 'tu', 'kaprog', 'wakasek_kurikulum', 'wakasek_kesiswaan', 'kepala_sekolah'],
    },
    {
      title: 'Inventaris',
      icon: <Package size={20} />,
      to: '/inventaris',
      roles: ['tu', 'penjaga_lab', 'kaprog', 'wakasek_kurikulum', 'wakasek_kesiswaan', 'kepala_sekolah'],
    },
    {
      title: 'Pengadaan',
      icon: <FilePen size={20} />,
      to: '/pengadaan',
      roles: ['penjaga_lab', 'tu', 'kaprog', 'wakasek_kurikulum', 'wakasek_kesiswaan', 'kepala_sekolah'],
    },
    {
      title: 'Ruangan',
      icon: <House size={20} />,
      to: '/ruangan',
      roles: ['tu', 'penjaga_lab'],
    },
    {
      title: 'Notifikasi',
      icon: <Bell size={20} />,
      to: '/notifikasi',
      roles: ['penjaga_lab', 'tu', 'kaprog', 'wakasek_kurikulum', 'wakasek_kesiswaan', 'kepala_sekolah'],
    },
    {
      title: 'Pengguna',
      icon: <Users size={20} />,
      to: '/pengaturan/users',
      roles: ['kepala_sekolah'],
    },
  ]

  const filteredMenu = menuItems.filter(item => item.roles.includes(CURRENT_ROLE))

  return (
    <aside className="w-64 border-r border-surface-200 bg-white flex flex-col h-full flex-shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-surface-200">
        <div className="flex items-center gap-2 text-primary-600 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center">
            <Package size={20} />
          </div>
          E-Inventaris
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {filteredMenu.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="sidebar-link"
            activeProps={{
              className: 'sidebar-link-active',
            }}
          >
            {item.icon}
            {item.title}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-surface-200">
        <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-danger-600 hover:bg-danger-50 transition-colors">
          <LogOut size={20} />
          Keluar
        </button>
      </div>
    </aside>
  )
}
