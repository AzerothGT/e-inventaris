import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getUsers, createUser } from "../../server/functions/users"
import { PageHeader } from "../../components/ui/PageHeader"
import { DataTable } from "../../components/ui/DataTable"
import { Button } from "../../components/ui/Button"
import { UserPlus, Shield } from "lucide-react"
import { Dialog } from "../../components/ui/Dialog"
import { UserForm } from "../../components/users/UserForm"
import { UserTableActions } from "../../components/users/UserTableActions"
import { ROLE_DEPARTMENTS, UserRole } from "../../lib/approvals"
import { Badge } from "../../components/ui/Badge"
import { toast } from "sonner"

export const Route = createFileRoute("/_authenticated/users")({
  component: UserManagementPage,
})

function UserManagementPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
  const queryClient = useQueryClient()

  const { data: users } = useSuspenseQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  })

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast.success("Pengguna baru berhasil ditambahkan")
      setIsAddDialogOpen(false)
    },
    onError: (error: any) => {
      toast.error(error.message || "Gagal menambahkan pengguna")
    },
  })

  const columns = [
    {
      accessorKey: "name",
      header: "Nama",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">
            {row.original.name.charAt(0).toUpperCase()}
          </div>
          <div className="font-medium text-surface-900">{row.original.name}</div>
        </div>
      ),
    },
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }: any) => (
        <span className="text-surface-500 font-mono text-xs">{row.original.username}</span>
      ),
    },
    {
      accessorKey: "role",
      header: "Role / Jabatan",
      cell: ({ row }: any) => {
        const role = row.original.role as UserRole
        const isSystemAdmin = role === 'admin' || role === 'tu_admin'
        return (
          <div className="flex items-center gap-2">
            <Badge variant={isSystemAdmin ? "default" : "secondary"}>
              {ROLE_DEPARTMENTS[role] || role}
            </Badge>
            {isSystemAdmin && <Shield size={14} className="text-primary-500" />}
          </div>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: "Terdaftar Pada",
      cell: ({ row }: any) => (
        <span className="text-surface-500 text-xs">
          {new Date(row.original.createdAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }: any) => <UserTableActions user={row.original} />,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen"
        gradientTitle="Pengguna"
        actions={
          <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
            <UserPlus size={18} />
            <span>Tambah Pengguna</span>
          </Button>
        }
      />

      <div className="bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 shadow-sm overflow-hidden">
        <DataTable
          columns={columns}
          data={users || []}
          searchPlaceholder="Cari pengguna berdasarkan nama atau username..."
          searchColumn="name"
        />
      </div>

      <Dialog 
        isOpen={isAddDialogOpen} 
        onClose={() => setIsAddDialogOpen(false)}
        title="Tambah Pengguna Baru"
      >
        <div className="py-2">
          <p className="text-sm text-surface-600 mb-4">
            Buat akun baru untuk staf atau administrator sistem.
          </p>
          <UserForm
            onSubmit={(data) => createMutation.mutate({ data: data as any })}
            onCancel={() => setIsAddDialogOpen(false)}
            isLoading={createMutation.isPending}
          />
        </div>
      </Dialog>
    </div>
  )
}
