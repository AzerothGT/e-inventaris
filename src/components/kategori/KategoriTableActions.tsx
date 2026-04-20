import * as React from "react"
import { createPortal } from "react-dom"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { Button } from "../ui/Button"
import { Dialog } from "../ui/Dialog"
import { KategoriForm } from "./KategoriForm"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateKategori, deleteKategori } from "../../server/functions/kategori"
import { toast } from "sonner"

interface KategoriTableActionsProps {
  kategori: {
    id: string
    nama: string
    deskripsi: string | null
  }
}

export function KategoriTableActions({ kategori }: KategoriTableActionsProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [dropdownOpen, setDropdownOpen] = React.useState(false)
  const [coords, setCoords] = React.useState({ top: 0, left: 0 })
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  const queryClient = useQueryClient()

  React.useEffect(() => {
    if (dropdownOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.right - 160 + window.scrollX, 
      })
    }
  }, [dropdownOpen])

  const updateMutation = useMutation({
    mutationFn: updateKategori,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kategori"] })
      toast.success("Kategori berhasil diperbarui")
      setIsEditDialogOpen(false)
    },
    onError: (error: any) => {
      toast.error(error.message || "Gagal memperbarui kategori")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteKategori,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kategori"] })
      toast.success("Kategori berhasil dihapus")
      setIsDeleteDialogOpen(false)
    },
    onError: (error: any) => {
      toast.error(error.message || "Gagal menghapus kategori")
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
            className="fixed w-40 bg-white rounded-xl shadow-xl border border-surface-200 py-1 z-[70] animate-in fade-in zoom-in-95 duration-100"
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
              <Edit size={14} /> Edit Kategori
            </button>
            <button
              onClick={() => {
                setIsDeleteDialogOpen(true)
                setDropdownOpen(false)
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-danger-600 hover:bg-danger-50"
            >
              <Trash2 size={14} /> Hapus Kategori
            </button>
          </div>
        </>,
        document.body
      )}

      <Dialog 
        isOpen={isEditDialogOpen} 
        onClose={() => setIsEditDialogOpen(false)}
        title="Edit Kategori"
      >
        <div className="py-2">
          <KategoriForm
            initialData={{
              nama: kategori.nama,
              deskripsi: kategori.deskripsi || undefined,
            }}
            onSubmit={(data) => updateMutation.mutate({ data: { id: kategori.id, ...data } })}
            onCancel={() => setIsEditDialogOpen(false)}
            isLoading={updateMutation.isPending}
          />
        </div>
      </Dialog>

      <Dialog 
        isOpen={isDeleteDialogOpen} 
        onClose={() => setIsDeleteDialogOpen(false)}
        title="Hapus Kategori"
      >
        <div className="space-y-4 py-2">
          <p className="text-sm text-surface-600">
            Apakah Anda yakin ingin menghapus kategori <strong>{kategori.nama}</strong>? Barang yang menggunakan kategori ini tidak akan dihapus, namun kategorinya akan menjadi tidak valid.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteMutation.mutate({ data: { id: kategori.id } })}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Menghapus..." : "Hapus Kategori"}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  )
}
