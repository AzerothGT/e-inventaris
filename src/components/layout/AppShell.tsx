import * as React from 'react'
import { Sidebar } from './Sidebar'
import { NavbarBottom } from './NavbarBottom'
import { NotificationBell } from './NotificationBell'
import { LogOut, ChevronDown, Package } from 'lucide-react'
import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCurrentUser, logoutUser } from '../../server/functions/auth'
import { useRouter } from '@tanstack/react-router'
import { ROLE_DEPARTMENTS, UserRole } from '../../lib/approvals'
import { toast } from 'sonner'


export function AppShell({ children }: { children: React.ReactNode }) {
  const [profileOpen, setProfileOpen] = React.useState(false)
  const queryClient = useQueryClient()
  const router = useRouter()

  const { data: user } = useSuspenseQuery({
    queryKey: ['session'],
    queryFn: () => getCurrentUser(),
  })

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.setQueryData(['session'], null)
      router.invalidate()
      toast.success('Berhasil keluar')
    }
  })

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }


  return (
    <div className="flex h-screen overflow-hidden bg-surface-50 font-sans text-surface-950">
      {/* Sidebar - desktop only */}
      <div className="hidden lg:block z-30">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white/70 backdrop-blur-md border-b border-white/40 flex items-center justify-between px-4 lg:px-8 flex-shrink-0 z-10 w-full relative shadow-sm">
          <div className="flex items-center">
            {/* Mobile Navbar Branding */}
            <div className="flex items-center gap-2 text-primary-600 font-bold text-lg tracking-tight lg:hidden">
              <div className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center">
                <Package size={18} />
              </div>
              E-Inventaris
            </div>
            <h1 className="text-xl font-semibold text-surface-900 hidden lg:block">
              {/* Dynamic title could go here based on route */}
            </h1>
          </div>

          <div className="hidden md:flex flex-1 justify-center px-4 max-w-2xl">
            {/* Search bar removed */}
          </div>


          <div className="flex items-center gap-4">
            <NotificationBell />

            <div className="relative ml-2 pl-4 border-l border-surface-200">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 focus:outline-none hover:bg-surface-50 rounded-lg p-1 transition-colors"
                aria-expanded={profileOpen}
                aria-haspopup="true"
              >
                <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm uppercase">
                  {getInitials(user?.name || '??')}
                </div>
                <div className="hidden md:block text-sm text-left">
                  <p className="font-medium text-surface-900">{user?.name}</p>
                  <p className="text-surface-500 text-xs">{ROLE_DEPARTMENTS[user?.role as UserRole] || user?.role}</p>
                </div>
                <ChevronDown size={16} className={`text-surface-500 transition-transform hidden sm:block ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {profileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-surface-200 py-1 z-50 transform origin-top-right transition-all">
                    <button
                      onClick={() => logoutMutation.mutate({})}
                      disabled={logoutMutation.isPending}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-danger-600 hover:bg-danger-50 transition-colors text-left disabled:opacity-50"
                    >
                      <LogOut size={16} />
                      {logoutMutation.isPending ? 'Keluar...' : 'Keluar'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page content scrollable area */}
        <main className="flex-1 overflow-y-auto bg-surface-50 p-4 lg:p-8 pb-20 lg:pb-8">
          <div className="mx-auto max-w-7xl page-enter relative">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <NavbarBottom />
    </div>
  )
}
