import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  // Temporarily redirect directly to dashboard until auth is built
  beforeLoad: () => {
    throw redirect({
      to: '/login',
    })
  },
  component: () => <div>Redirecting...</div>,
})
