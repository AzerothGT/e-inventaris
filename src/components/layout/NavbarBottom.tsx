import { Link } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Package,
  FilePen,
  Warehouse,
  Bell,
  Users,
} from 'lucide-react'

// Placeholder role for now until Auth is implemented
const CURRENT_ROLE = 'tu'

export function NavbarBottom() {
  const menuItems = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      to: '/dashboard',
      roles: ['penjaga_lab', 'tu', 'kaprog', 'wakasek_kurikulum', 'wakasek_kesiswaan', 'kepala_sekolah'],
    },
    {
      title: 'Barang',
      icon: <Package size={20} />,
      to: '/barang',
      roles: ['tu', 'penjaga_lab', 'kaprog', 'wakasek_kurikulum', 'wakasek_kesiswaan', 'kepala_sekolah'],
    },
    {
      title: 'Pengajuan',
      icon: <FilePen size={20} />,
      to: '/permintaan',
      roles: ['penjaga_lab', 'tu', 'kaprog', 'wakasek_kurikulum', 'wakasek_kesiswaan', 'kepala_sekolah'],
    },
    {
      title: 'Gudang',
      icon: <Warehouse size={20} />,
      to: '/gudang',
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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-surface-200 lg:hidden flex justify-around items-center h-16 pb-0">
      {filteredMenu.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className="navbar-link"
          activeProps={{
            className: 'navbar-link-active',
          }}
        >
          {item.icon}
          <span className="text-[10px] mt-1 font-medium">{item.title}</span>
        </Link>
      ))}
    </nav>
  )
}
