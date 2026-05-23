import * as React from "react"
import { createPortal } from "react-dom"
import { MoreHorizontal, Edit, Trash2, KeyRound } from "lucide-react"
import { Button } from "../ui/Button"
import { Dialog } from "../ui/Dialog"
import { UserForm } from "./UserForm"
import { Input } from "../ui/Input"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateUser, deleteUser, resetPassword } from "../../server/functions/users"
import { toast } from "sonner"

interface UserTableActionsProps {
  user: {
    id: string
    username: string
    name: string
    role: any
  }
}

export function UserTableActions({ user }: UserTableActionsProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [isResetPasswordOpen, setIsResetPasswordOpen] = React.useState(false)
  const [newPassword, setNewPassword] = React.useState("")
  const [dropdownOpen, setDropdownOpen] = React.useState(false)
  const [coords, setCoords] = React.useState({ top: 0, left: 0 })
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  const queryClient = useQueryClient()

  // Calculate position when opening
  React.useEffect(() => {
    if (dropdownOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.right - 192 + window.scrollX, // 192 is w-48
      })
    }
  }, [dropdownOpen])

  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast.success("Pengguna berhasil diperbarui")
      setIsEditDialogOpen(false)
    },
    onError: (error: any) => {
      toast.error(error.message || "Gagal memperbarui pengguna")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast.success("Pengguna berhasil dihapus")
      setIsDeleteDialogOpen(false)
    },
    onError: (error: any) => {
      toast.error(error.message || "Gagal menghapus pengguna")
    },
  })

  const resetMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success("Password berhasil direset")
      setIsResetPasswordOpen(false)
      setNewPassword("")
    },
    onError: (error: any) => {
      toast.error(error.message || "Gagal mereset password")
    },
  })

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
      >
        <MoreHorizontal size={16} className="text-surface-500" />
      </button>

      {dropdownOpen && typeof document !== 'undefined' && createPortal(
        <>
          <div
            className="fixed inset-0 z-[60]"
            onClick={() => setDropdownOpen(false)}
          />
          <div 
            className="fixed w-48 bg-white rounded-xl shadow-xl border border-surface-200 py-1 z-[70] animate-in fade-in zoom-in-95 duration-100"
            style={{ 
              top: `${coords.top + 4}px`, 
              left: `${coords.left}px` 
            }}
          >
            <button
              onClick={() => {
                setIsEditDialogOpen(true)
                setDropdownOpen(false)
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-surface-700 hover:bg-surface-50"
            >
              <Edit size={14} /> Edit Profil
            </button>
            <button
              onClick={() => {
                setIsResetPasswordOpen(true)
                setDropdownOpen(false)
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-surface-700 hover:bg-surface-50"
            >
              <KeyRound size={14} /> Reset Password
            </button>
            <button
              onClick={() => {
                setIsDeleteDialogOpen(true)
                setDropdownOpen(false)
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-danger-600 hover:bg-danger-50"
            >
              <Trash2 size={14} /> Hapus Pengguna
            </button>
          </div>
        </>,
        document.body
      )}

      {/* Edit Dialog */}
      <Dialog 
        isOpen={isEditDialogOpen} 
        onClose={() => setIsEditDialogOpen(false)}
        title="Edit Pengguna"
      >
        <div className="py-2">
          <UserForm
            isEdit
            initialData={{
              name: user.name,
              username: user.username,
              role: user.role,
            }}
            onSubmit={(data) => updateMutation.mutate({ data: { id: user.id, ...data } })}
            onCancel={() => setIsEditDialogOpen(false)}
            isLoading={updateMutation.isPending}
          />
        </div>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog 
        isOpen={isResetPasswordOpen} 
        onClose={() => setIsResetPasswordOpen(false)}
        title="Reset Password"
      >
        <div className="space-y-4 py-2">
          <p className="text-sm text-surface-600">
            Masukkan password baru untuk pengguna <strong>{user.name}</strong>.
          </p>
          <div className="space-y-2">
            <label className="text-sm font-medium text-surface-700">Password Baru</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setIsResetPasswordOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={() => resetMutation.mutate({ data: { id: user.id, newPassword } })}
              disabled={resetMutation.isPending || newPassword.length < 6}
            >
              {resetMutation.isPending ? "Mereset..." : "Reset Password"}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog 
        isOpen={isDeleteDialogOpen} 
        onClose={() => setIsDeleteDialogOpen(false)}
        title="Hapus Pengguna"
      >
        <div className="space-y-4 py-2">
          <p className="text-sm text-surface-600">
            Apakah Anda yakin ingin menghapus pengguna <strong>{user.name}</strong>? Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteMutation.mutate({ data: { id: user.id } })}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Menghapus..." : "Hapus Pengguna"}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  )
}
