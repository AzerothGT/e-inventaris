import { Link } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Package,
  FilePen,
  Warehouse,
  Bell,
  Users,
} from 'lucide-react'

const CURRENT_ROLE = 'tu_admin'

export function NavbarBottom() {
  const menuItems = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      to: '/dashboard',
      roles: ['penjaga_lab', 'orang_tu', 'tu_admin', 'kaprog', 'wakasek_kurikulum', 'wakasek_kesiswaan', 'kepala_sekolah', 'admin'],
    },
    {
      title: 'Barang',
      icon: <Package size={20} />,
      to: '/barang',
      roles: ['tu_admin', 'penjaga_lab', 'orang_tu', 'kaprog', 'wakasek_kurikulum', 'wakasek_kesiswaan', 'kepala_sekolah', 'admin'],
    },
    {
      title: 'Pengajuan',
      icon: <FilePen size={20} />,
      to: '/permintaan',
      roles: ['penjaga_lab', 'orang_tu', 'tu_admin', 'kaprog', 'wakasek_kurikulum', 'wakasek_kesiswaan', 'kepala_sekolah', 'admin'],
    },
    {
      title: 'Gudang',
      icon: <Warehouse size={20} />,
      to: '/gudang',
      roles: ['tu_admin', 'penjaga_lab', 'admin'],
    },
    {
      title: 'Notifikasi',
      icon: <Bell size={20} />,
      to: '/notifikasi',
      roles: ['penjaga_lab', 'orang_tu', 'tu_admin', 'kaprog', 'wakasek_kurikulum', 'wakasek_kesiswaan', 'kepala_sekolah', 'admin'],
    },
    {
      title: 'Pengguna',
      icon: <Users size={20} />,
      to: '/pengaturan/users',
      roles: ['kepala_sekolah', 'admin'],
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
