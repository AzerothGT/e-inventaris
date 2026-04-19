import * as React from 'react'
import { Sidebar } from './Sidebar'
import { NotificationBell } from './NotificationBell'
import { Menu } from 'lucide-react'

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-surface-50 font-sans text-surface-950">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-surface-950/50 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - responsive behavior */}
      <div className={`
        fixed inset-y-0 left-0 z-30 transform lg:static lg:translate-x-0 transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-surface-200 flex items-center justify-between px-4 lg:px-8 flex-shrink-0 z-10">
          <div className="flex items-center">
            <button 
              className="lg:hidden p-2 -ml-2 mr-2 text-surface-500 hover:bg-surface-100 rounded-lg transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-surface-900 hidden sm:block">
              {/* Dynamic title could go here based on route */}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <NotificationBell />
            
            <div className="flex items-center gap-3 ml-2 pl-4 border-l border-surface-200">
              <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm uppercase">
                TU
              </div>
              <div className="hidden md:block text-sm">
                <p className="font-medium text-surface-900">Staf TU</p>
                <p className="text-surface-500 text-xs">Tata Usaha</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content scrollable area */}
        <main className="flex-1 overflow-y-auto bg-surface-50 p-4 lg:p-8">
          <div className="mx-auto max-w-7xl page-enter">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
