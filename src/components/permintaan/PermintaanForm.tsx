import { useForm, type SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/Card"

const permintaanSchema = z.object({
  namaBarang: z.string().min(1, "Nama barang harus diisi"),
  jumlah: z.number().int().min(1, "Jumlah minimal 1"),
  deskripsi: z.string().min(1, "Alasan pengadaan harus diisi"),
  prioritas: z.enum(["rendah", "sedang", "tinggi"]),
})

type PermintaanFormData = z.infer<typeof permintaanSchema>

interface PermintaanFormProps {
  onSubmit: SubmitHandler<PermintaanFormData>
  isLoading?: boolean
  onCancel?: () => void
}

export function PermintaanForm({
  onSubmit,
  isLoading,
  onCancel,
}: PermintaanFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PermintaanFormData>({
    resolver: zodResolver(permintaanSchema),
    defaultValues: {
      jumlah: 1,
      prioritas: "sedang",
    },
  })

  return (
    <Card className="w-full max-w-2xl mx-auto border-none shadow-xl bg-white/80 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
          Buat Permintaan Barang
        </CardTitle>
        <CardDescription>
          Isi formulir di bawah ini untuk mengajukan pengadaan barang baru.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-surface-700">Nama Barang</label>
            <Input 
              {...register("namaBarang")} 
              placeholder="Contoh: Proyektor Epson EB-X06"
              className="hover:border-primary-300 focus:border-primary-500 transition-colors"
            />
            {errors.namaBarang && (
              <p className="text-xs font-medium text-danger-600">{errors.namaBarang.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-surface-700">Jumlah</label>
              <Input 
                type="number" 
                {...register("jumlah", { valueAsNumber: true })}
                className="hover:border-primary-300 focus:border-primary-500 transition-colors"
              />
              {errors.jumlah && (
                <p className="text-xs font-medium text-danger-600">{errors.jumlah.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-surface-700">Prioritas</label>
              <select
                {...register("prioritas")}
                className="w-full h-10 px-3 rounded-lg border border-surface-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all hover:border-primary-300"
              >
                <option value="rendah">Rendah</option>
                <option value="sedang">Sedang</option>
                <option value="tinggi">Tinggi</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-surface-700">Alasan Pengadaan (Deskripsi)</label>
            <textarea
              {...register("deskripsi")}
              rows={4}
              placeholder="Jelaskan mengapa barang ini dibutuhkan..."
              className="w-full p-3 rounded-lg border border-surface-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all hover:border-primary-300 resize-none"
            />
            {errors.deskripsi && (
              <p className="text-xs font-medium text-danger-600">{errors.deskripsi.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            {onCancel && (
              <Button type="button" variant="ghost" onClick={onCancel}>
                Batal
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={isLoading}
              className="px-8 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 shadow-md transform active:scale-95 transition-all"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Mengirim...
                </div>
              ) : (
                "Kirim Permintaan"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
