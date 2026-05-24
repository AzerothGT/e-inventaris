import { Link } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Package,
  FilePen,
  Warehouse,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getCurrentUser } from '../../server/functions/auth'

export function NavbarBottom() {
  const { data: user } = useQuery({
    queryKey: ['session'],
    queryFn: () => getCurrentUser(),
  })

  const currentRole = user?.role || 'guest'

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard size={20} strokeWidth={1.5} />,
      to: '/dashboard',
      roles: ['penjaga_lab', 'orang_tu', 'tu_admin', 'kaprog', 'wakasek', 'kepala_sekolah', 'admin'],
    },
    {
      title: 'Barang',
      icon: <Package size={20} strokeWidth={1.5} />,
      to: '/barang',
      roles: ['tu_admin', 'penjaga_lab', 'orang_tu', 'kaprog', 'wakasek', 'kepala_sekolah', 'admin'],
    },
    {
      title: 'Pengajuan',
      icon: <FilePen size={20} strokeWidth={1.5} />,
      to: '/permintaan',
      roles: ['penjaga_lab', 'orang_tu', 'tu_admin', 'kaprog', 'wakasek', 'kepala_sekolah', 'admin'],
    },
    {
      title: 'Gudang',
      icon: <Warehouse size={20} strokeWidth={1.5} />,
      to: '/ruangan',
      roles: ['tu_admin', 'penjaga_lab', 'admin'],
    },
  ]

  const filteredMenu = menuItems.filter(item => item.roles.includes(currentRole as any))

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
