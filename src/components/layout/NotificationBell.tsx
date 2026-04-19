import * as React from 'react'
import { Bell } from 'lucide-react'

export function NotificationBell() {
  return (
    <button className="relative p-2 text-surface-500 hover:text-surface-900 hover:bg-surface-100 rounded-lg transition-colors">
      <Bell size={20} />
      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger-500 ring-2 ring-white"></span>
    </button>
  )
}
