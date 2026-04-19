import * as React from 'react'
import { Link } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Package,
  FilePen,
  House,
  FileText,
  Users,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

// Placeholder role for now until Auth is implemented
const CURRENT_ROLE = 'tu'

export function Sidebar() {
  const [isMinimized, setIsMinimized] = React.useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/(^| )sidebar_minimized=([^;]+)/)
      if (match) {
        return match[2] === 'true'
      }
    }
    return true
  })

  const toggleSidebar = () => {
    const newVal = !isMinimized
    setIsMinimized(newVal)
    if (typeof document !== 'undefined') {
      document.cookie = `sidebar_minimized=${newVal}; path=/; max-age=31536000`
    }
  }

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      to: '/dashboard',
      roles: ['penjaga_lab', 'tu', 'kaprog', 'wakasek_kurikulum', 'wakasek_kesiswaan', 'kepala_sekolah'],
    },
    {
      title: 'Barang',
      icon: Package,
      to: '/inventaris',
      roles: ['tu', 'penjaga_lab', 'kaprog', 'wakasek_kurikulum', 'wakasek_kesiswaan', 'kepala_sekolah'],
    },
    {
      title: 'Pengadaan',
      icon: FilePen,
      to: '/pengadaan',
      roles: ['penjaga_lab', 'tu', 'kaprog', 'wakasek_kurikulum', 'wakasek_kesiswaan', 'kepala_sekolah'],
    },
    {
      title: 'Gudang',
      icon: House,
      to: '/gudang',
      roles: ['tu', 'penjaga_lab'],
    },
    {
      title: 'Laporan',
      icon: FileText,
      to: '/laporan',
      roles: ['penjaga_lab', 'tu', 'kaprog', 'wakasek_kurikulum', 'wakasek_kesiswaan', 'kepala_sekolah'],
    },
    {
      title: 'Pengguna',
      icon: Users,
      to: '/pengaturan/users',
      roles: ['kepala_sekolah'],
    },
  ]

  const filteredMenu = menuItems.filter(item => item.roles.includes(CURRENT_ROLE))

  return (
    <aside className={`border-r border-white/40 bg-white/70 backdrop-blur-xl flex flex-col h-full flex-shrink-0 transition-all duration-300 relative z-20 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] ${isMinimized ? 'w-20' : 'w-64'}`}>
      <div className={`h-16 flex items-center border-b border-white/10 transition-all duration-300 ${isMinimized ? 'justify-center px-0' : 'px-6'}`}>
        <div className={`flex items-center gap-2 text-primary-600 font-bold tracking-tight overflow-hidden ${isMinimized ? '' : 'text-xl'}`}>
          <div className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center flex-shrink-0">
            <Package size={isMinimized ? 24 : 20} className="transition-all duration-300" />
          </div>
          {!isMinimized && <span className="whitespace-nowrap transition-opacity duration-300">E-Inventaris</span>}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 overflow-x-hidden">
        {filteredMenu.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`sidebar-link ${isMinimized ? 'justify-center !px-0' : ''}`}
              activeProps={{
                className: 'sidebar-link-active',
              }}
              title={isMinimized ? item.title : undefined}
            >
              <Icon size={isMinimized ? 28 : 20} className="flex-shrink-0 transition-all duration-300" />
              {!isMinimized && <span className="whitespace-nowrap">{item.title}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-white/10">
        <button
          onClick={toggleSidebar}
          className={`flex items-center text-surface-500 hover:text-primary-600 hover:bg-primary-50 p-2.5 rounded-xl transition-all duration-300 w-full ${isMinimized ? 'justify-center' : 'justify-end'}`}
          title={isMinimized ? 'Perbesar sidebar' : 'Perkecil sidebar'}
        >
          {isMinimized ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
        </button>
      </div>
    </aside>
  )
}
