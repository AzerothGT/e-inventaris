import { useForm, type SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Package, Tag, Archive } from "lucide-react"

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header section with Icon */}
      <div className="flex items-center gap-3 pb-4 border-b border-surface-100">
        <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-sm border border-primary-100/50">
          <Package className="h-6 w-6" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-base font-bold text-surface-900 tracking-tight">
            {initialData ? "Edit Detail Barang" : "Informasi Inventaris Barang"}
          </h3>
          <p className="text-xs text-surface-500">
            {initialData ? "Perbarui detail informasi barang terdaftar" : "Lengkapi detail informasi barang untuk dicatat ke sistem"}
          </p>
        </div>
      </div>

      {/* Section 1: Identifikasi Barang */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-surface-100">
          <Tag className="h-4 w-4 text-primary-500" />
          <h4 className="text-xs font-bold text-surface-700 uppercase tracking-wider">Identifikasi Barang</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-surface-600 uppercase tracking-wider">Kode Barang *</label>
            <Input 
              {...register("kodeBarang")} 
              placeholder="Contoh: INV-001" 
              className="hover:border-surface-300 focus:border-primary-500 transition-colors h-10 bg-white text-sm"
            />
            {errors.kodeBarang && (
              <p className="text-[10px] font-medium text-danger-600">{errors.kodeBarang.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-surface-600 uppercase tracking-wider">Nama Barang *</label>
            <Input 
              {...register("nama")} 
              placeholder="Contoh: Laptop Macbook Air" 
              className="hover:border-surface-300 focus:border-primary-500 transition-colors h-10 bg-white text-sm"
            />
            {errors.nama && (
              <p className="text-[10px] font-medium text-danger-600">{errors.nama.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-surface-600 uppercase tracking-wider">Kategori *</label>
            <select
              {...register("kategori")}
              className="w-full h-10 px-3 rounded-lg border border-surface-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all hover:border-surface-300"
            >
              <option value="">Pilih Kategori</option>
              {kategoriOptions.map((k) => (
                <option key={k.id} value={k.nama}>
                  {k.nama}
                </option>
              ))}
            </select>
            {errors.kategori && (
              <p className="text-[10px] font-medium text-danger-600">{errors.kategori.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-surface-600 uppercase tracking-wider">Merek *</label>
            <Input 
              {...register("merek")} 
              placeholder="Contoh: Apple" 
              className="hover:border-surface-300 focus:border-primary-500 transition-colors h-10 bg-white text-sm"
            />
            {errors.merek && (
              <p className="text-[10px] font-medium text-danger-600">{errors.merek.message}</p>
            )}
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-surface-600 uppercase tracking-wider">Nomor Seri</label>
            <Input 
              {...register("noSeri")} 
              placeholder="Contoh: SN123456 (opsional)" 
              className="hover:border-surface-300 focus:border-primary-500 transition-colors h-10 bg-white text-sm"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Penyimpanan & Pengadaan */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2 pb-2 border-b border-surface-100">
          <Archive className="h-4 w-4 text-primary-500" />
          <h4 className="text-xs font-bold text-surface-700 uppercase tracking-wider">Penyimpanan & Pengadaan</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-surface-600 uppercase tracking-wider">Lokasi Ruangan *</label>
            <select
              {...register("ruanganId")}
              className="w-full h-10 px-3 rounded-lg border border-surface-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all hover:border-surface-300"
            >
              <option value="">Pilih Ruangan</option>
              {ruanganOptions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nama} {r.gedung ? `(${r.gedung})` : ""}
                </option>
              ))}
            </select>
            {errors.ruanganId && (
              <p className="text-[10px] font-medium text-danger-600">{errors.ruanganId.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-surface-600 uppercase tracking-wider">Kondisi Awal *</label>
            <select
              {...register("status")}
              className="w-full h-10 px-3 rounded-lg border border-surface-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all hover:border-surface-300"
            >
              <option value="baik">Baik</option>
              <option value="rusak_ringan">Rusak Ringan</option>
              <option value="rusak_berat">Rusak Berat</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-surface-600 uppercase tracking-wider">Jumlah *</label>
            <Input 
              type="number" 
              {...register("jumlah", { valueAsNumber: true })} 
              className="hover:border-surface-300 focus:border-primary-500 transition-colors h-10 bg-white text-sm"
            />
            {errors.jumlah && (
              <p className="text-[10px] font-medium text-danger-600">{errors.jumlah.message}</p>
            )}
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-surface-600 uppercase tracking-wider">Tahun Pengadaan *</label>
            <Input 
              type="number" 
              {...register("tahunPengadaan", { valueAsNumber: true })} 
              className="hover:border-surface-300 focus:border-primary-500 transition-colors h-10 bg-white text-sm"
            />
            {errors.tahunPengadaan && (
              <p className="text-[10px] font-medium text-danger-600">{errors.tahunPengadaan.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-surface-100 mt-6">
        <Button type="button" variant="ghost" onClick={onCancel} className="px-6 font-semibold">
          Batal
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
          className="px-8 font-semibold shadow-md active:scale-95 transition-all"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Menyimpan...
            </div>
          ) : initialData ? (
            "Simpan Perubahan"
          ) : (
            "Tambah Barang"
          )}
        </Button>
      </div>
    </form>
  )
}
