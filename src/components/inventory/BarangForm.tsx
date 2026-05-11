import { useForm, type SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"

const barangSchema = z.object({
  kodeBarang: z.string().min(1, "Kode barang harus diisi"),
  nama: z.string().min(1, "Nama barang harus diisi"),
  kategori: z.string().min(1, "Kategori harus diisi"),
  merek: z.string().min(1, "Merek harus diisi"),
  noSeri: z.string().optional(),
  tahunPengadaan: z.number().int(),
  ruanganId: z.string().min(1, "Ruangan harus dipilih"),
  status: z.enum(["baik", "rusak_ringan", "rusak_berat"]),
  jumlah: z.number().int().min(1),
})

type BarangFormData = z.infer<typeof barangSchema>

interface BarangFormProps {
  initialData?: Partial<BarangFormData>
  onSubmit: SubmitHandler<BarangFormData>
  onCancel: () => void
  ruanganOptions: { id: string; nama: string; gedung?: string | null }[]
  kategoriOptions: { id: string; nama: string }[]
  isLoading?: boolean
}

export function BarangForm({
  initialData,
  onSubmit,
  onCancel,
  ruanganOptions,
  kategoriOptions,
  isLoading,
}: BarangFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BarangFormData>({
    resolver: zodResolver(barangSchema),
    defaultValues: initialData || {
      status: "baik",
      jumlah: 1,
      tahunPengadaan: new Date().getFullYear(),
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-surface-700">Kode Barang</label>
          <Input {...register("kodeBarang")} placeholder="INV-001" />
          {errors.kodeBarang && (
            <p className="text-xs text-danger-600">{errors.kodeBarang.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-surface-700">Nama Barang</label>
          <Input {...register("nama")} placeholder="Laptop Macbook Air" />
          {errors.nama && (
            <p className="text-xs text-danger-600">{errors.nama.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-surface-700">Kategori</label>
          <select
            {...register("kategori")}
            className="w-full h-10 px-3 rounded-lg border border-surface-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          >
            <option value="">Pilih Kategori</option>
            {kategoriOptions.map((k) => (
              <option key={k.id} value={k.nama}>
                {k.nama}
              </option>
            ))}
          </select>
          {errors.kategori && (
            <p className="text-xs text-danger-600">{errors.kategori.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-surface-700">Merek</label>
          <Input {...register("merek")} placeholder="Apple" />
          {errors.merek && (
            <p className="text-xs text-danger-600">{errors.merek.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-surface-700">No Seri</label>
          <Input {...register("noSeri")} placeholder="SN123456" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-surface-700">Tahun Pengadaan</label>
          <Input type="number" {...register("tahunPengadaan", { valueAsNumber: true })} />
          {errors.tahunPengadaan && (
            <p className="text-xs text-danger-600">{errors.tahunPengadaan.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-surface-700">Ruangan</label>
          <select
            {...register("ruanganId")}
            className="w-full h-10 px-3 rounded-lg border border-surface-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          >
            <option value="">Pilih Ruangan</option>
            {ruanganOptions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nama} {r.gedung ? `(${r.gedung})` : ""}
              </option>
            ))}
          </select>
          {errors.ruanganId && (
            <p className="text-xs text-danger-600">{errors.ruanganId.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-surface-700">Status</label>
          <select
            {...register("status")}
            className="w-full h-10 px-3 rounded-lg border border-surface-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          >
            <option value="baik">Baik</option>
            <option value="rusak_ringan">Rusak Ringan</option>
            <option value="rusak_berat">Rusak Berat</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-surface-700">Jumlah</label>
          <Input type="number" {...register("jumlah", { valueAsNumber: true })} />
          {errors.jumlah && (
            <p className="text-xs text-danger-600">{errors.jumlah.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Menyimpan..." : initialData ? "Update Barang" : "Tambah Barang"}
        </Button>
      </div>
    </form>
  )
}
