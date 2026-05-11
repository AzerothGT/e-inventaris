import * as React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"

const ruanganSchema = z.object({
  kodeRuangan: z.string().min(1, "Kode ruangan harus diisi"),
  nama: z.string().min(1, "Nama ruangan harus diisi"),
  tipe: z.string().min(1, "Tipe ruangan harus diisi"),
  gedung: z.string().min(1, "Gedung harus diisi"),
})

type RuanganFormData = z.infer<typeof ruanganSchema>

interface RuanganFormProps {
  initialData?: any
  onSubmit: (data: RuanganFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export function RuanganForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: RuanganFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RuanganFormData>({
    resolver: zodResolver(ruanganSchema),
    defaultValues: initialData || {},
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-surface-700">Kode Ruangan</label>
        <Input {...register("kodeRuangan")} placeholder="LAB-01" />
        {errors.kodeRuangan && (
          <p className="text-xs text-danger-600">{errors.kodeRuangan.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-surface-700">Nama Ruangan</label>
        <Input {...register("nama")} placeholder="Laboratorium Komputer 1" />
        {errors.nama && (
          <p className="text-xs text-danger-600">{errors.nama.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-surface-700">Tipe</label>
        <Input {...register("tipe")} placeholder="Laboratorium" />
        {errors.tipe && (
          <p className="text-xs text-danger-600">{errors.tipe.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-surface-700">Gedung</label>
        <Input {...register("gedung")} placeholder="Gedung A" />
        {errors.gedung && (
          <p className="text-xs text-danger-600">{errors.gedung.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Menyimpan..." : initialData ? "Update Ruangan" : "Tambah Ruangan"}
        </Button>
      </div>
    </form>
  )
}
