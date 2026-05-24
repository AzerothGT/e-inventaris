import * as React from "react"
import { Edit2, Trash2 } from "lucide-react"
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

  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: updateKategori,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kategori"] })
      queryClient.invalidateQueries({ queryKey: ["barang"] })
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
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setIsEditDialogOpen(true)}
          className="h-8 w-8 text-primary-600 hover:text-primary-700 hover:bg-primary-100/50"
        >
          <Edit2 className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setIsDeleteDialogOpen(true)}
          className="h-8 w-8 text-danger-600 hover:text-danger-700 hover:bg-danger-100/50"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Hapus</span>
        </Button>
      </div>

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
