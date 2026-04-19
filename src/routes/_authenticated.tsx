import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AppShell } from '../components/layout/AppShell'

// For now, no actual auth checking, just rendering the layout
export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}
