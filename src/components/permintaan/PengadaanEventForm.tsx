import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { CalendarDays, Plus, Trash2, Image as ImageIcon, Link as LinkIcon, X } from "lucide-react";

const itemSchema = z.object({
  namaBarang: z.string().min(1, "Nama barang harus diisi"),
  merek: z.string().optional(),
  kategori: z.string().optional(),
  jumlah: z.number().int().min(1, "Minimal 1"),
  satuan: z.string().min(1, "Satuan harus diisi"),
  imageUrl: z.string().optional(),
});

const eventSchema = z.object({
  namaEvent: z.string().min(1, "Nama event harus diisi"),
  deskripsi: z.string().min(1, "Deskripsi harus diisi"),
  prioritas: z.enum(["rendah", "sedang", "tinggi"]),
  items: z.array(itemSchema).min(1, "Minimal 1 item harus ditambahkan"),
});

export type PengadaanEventFormData = z.infer<typeof eventSchema>;

interface PengadaanEventFormProps {
  onSubmit: SubmitHandler<PengadaanEventFormData>;
  isLoading?: boolean;
  onCancel?: () => void;
  kategoriOptions: { id: string; nama: string }[];
}

export function PengadaanEventForm({
  onSubmit,
  isLoading,
  onCancel,
  kategoriOptions,
}: PengadaanEventFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PengadaanEventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      prioritas: "sedang",
      items: [{ namaBarang: "", merek: "", kategori: "", jumlah: 1, satuan: "Unit", imageUrl: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const handleFileUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setValue(`items.${index}.imageUrl`, base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-surface-200/50 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-sm">
          <CalendarDays className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-surface-900 tracking-tight">
            Buat Permintaan Pengadaan
          </h3>
          <p className="text-xs text-surface-500">
            Buat satu event pengadaan dengan daftar barang yang dibutuhkan
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Event Header */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-surface-700">
            Nama Event / Kegiatan
          </label>
          <Input
            {...register("namaEvent")}
            placeholder="Contoh: Pengadaan Lab Komputer Semester Genap 2026"
            className="hover:border-primary-300 focus:border-primary-500 transition-colors"
          />
          {errors.namaEvent && (
            <p className="text-xs font-medium text-danger-600">
              {errors.namaEvent.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-surface-700">
              Prioritas
            </label>
            <select
              {...register("prioritas")}
              className="w-full h-10 px-3 rounded-lg border border-surface-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all hover:border-primary-300"
            >
              <option value="rendah">Rendah</option>
              <option value="sedang">Sedang</option>
              <option value="tinggi">Tinggi</option>
            </select>
          </div>

          <div className="space-y-2 md:col-span-1" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-surface-700">
            Deskripsi / Alasan Pengadaan
          </label>
          <textarea
            {...register("deskripsi")}
            rows={3}
            placeholder="Jelaskan tujuan kegiatan pengadaan ini..."
            className="w-full p-3 rounded-lg border border-surface-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all hover:border-primary-300 resize-none"
          />
          {errors.deskripsi && (
            <p className="text-xs font-medium text-danger-600">
              {errors.deskripsi.message}
            </p>
          )}
        </div>

        {/* Items Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-surface-100 flex items-center justify-center text-surface-600">
                <Plus className="h-4 w-4" />
              </div>
              <div>
                <label className="text-sm font-bold text-surface-900">
                  Daftar Barang
                </label>
                <p className="text-[10px] text-surface-500 font-medium">
                  Tambahkan detail barang yang ingin diajukan
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() =>
                append({
                  namaBarang: "",
                  merek: "",
                  kategori: "",
                  jumlah: 1,
                  satuan: "Unit",
                  imageUrl: "",
                })
              }
              className="flex items-center gap-1.5 text-xs font-semibold px-4"
            >
              <Plus className="h-3.5 w-3.5" />
              Tambah Barang
            </Button>
          </div>

          {errors.items && !Array.isArray(errors.items) && (
            <p className="text-xs font-medium text-danger-600 px-1">
              {errors.items.message}
            </p>
          )}

          <div className="overflow-hidden rounded-xl border border-surface-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-surface-50/50 border-b border-surface-200">
                    <th className="px-4 py-3 text-[10px] font-bold text-surface-400 uppercase tracking-wider w-10">
                      #
                    </th>
                    <th className="px-4 py-3 text-[10px] font-bold text-surface-400 uppercase tracking-wider min-w-[200px]">
                      Nama Barang *
                    </th>
                    <th className="px-4 py-3 text-[10px] font-bold text-surface-400 uppercase tracking-wider min-w-[120px]">
                      Merek
                    </th>
                    <th className="px-4 py-3 text-[10px] font-bold text-surface-400 uppercase tracking-wider min-w-[150px]">
                      Kategori
                    </th>
                    <th className="px-4 py-3 text-[10px] font-bold text-surface-400 uppercase tracking-wider w-24">
                      Jumlah
                    </th>
                    <th className="px-4 py-3 text-[10px] font-bold text-surface-400 uppercase tracking-wider w-24">
                      Satuan
                    </th>
                    <th className="px-4 py-3 text-[10px] font-bold text-surface-400 uppercase tracking-wider w-20 text-center">
                      Media
                    </th>
                    <th className="px-4 py-3 text-[10px] font-bold text-surface-400 uppercase tracking-wider w-12 text-center">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {fields.map((field, index) => (
                    <tr
                      key={field.id}
                      className="group hover:bg-surface-50/30 transition-colors"
                    >
                      <td className="px-4 py-3 text-xs font-medium text-surface-400">
                        {index + 1}
                      </td>
                      <td className="px-2 py-2">
                        <Input
                          {...register(`items.${index}.namaBarang`)}
                          placeholder="Contoh: Laptop"
                          className="h-9 text-xs border-transparent bg-transparent hover:bg-white hover:border-surface-200 focus:bg-white focus:border-primary-500 focus:ring-0 transition-all"
                        />
                        {errors.items?.[index]?.namaBarang && (
                          <p className="text-[10px] font-medium text-danger-600 mt-1 px-2">
                            {errors.items[index]?.namaBarang?.message}
                          </p>
                        )}
                      </td>
                      <td className="px-2 py-2">
                        <Input
                          {...register(`items.${index}.merek`)}
                          placeholder="Merek"
                          className="h-9 text-xs border-transparent bg-transparent hover:bg-white hover:border-surface-200 focus:bg-white focus:border-primary-500 focus:ring-0 transition-all"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <select
                          {...register(`items.${index}.kategori`)}
                          className="w-full h-9 px-3 rounded-lg border border-transparent bg-transparent hover:bg-white hover:border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-xs transition-all"
                        >
                          <option value="">Kategori</option>
                          {kategoriOptions.map((k) => (
                            <option key={k.id} value={k.nama}>
                              {k.nama}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-2 py-2">
                        <Input
                          type="number"
                          {...register(`items.${index}.jumlah`, {
                            valueAsNumber: true,
                          })}
                          className="h-9 text-xs border-transparent bg-transparent hover:bg-white hover:border-surface-200 focus:bg-white focus:border-primary-500 focus:ring-0 transition-all text-center"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <Input
                          {...register(`items.${index}.satuan`)}
                          placeholder="Unit"
                          className="h-9 text-xs border-transparent bg-transparent hover:bg-white hover:border-surface-200 focus:bg-white focus:border-primary-500 focus:ring-0 transition-all"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex items-center justify-center gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(index, e)}
                            className="hidden"
                            id={`file-upload-${index}`}
                          />
                          <label
                            htmlFor={`file-upload-${index}`}
                            className="p-1.5 rounded-lg border border-surface-200 bg-white hover:bg-surface-50 hover:border-primary-300 text-primary-500 cursor-pointer transition-all active:scale-90 shadow-sm"
                            title="Upload Gambar"
                          >
                            <ImageIcon className="h-3.5 w-3.5" />
                          </label>

                          <div className="relative group/link">
                            <button
                              type="button"
                              className="p-1.5 rounded-lg border border-surface-200 bg-white hover:bg-surface-50 hover:border-primary-300 text-surface-500 cursor-pointer transition-all active:scale-90 shadow-sm"
                              title="Paste Link Gambar"
                            >
                              <LinkIcon className="h-3.5 w-3.5" />
                            </button>
                            <div className="absolute bottom-full right-0 mb-2 hidden group-focus-within/link:block z-50">
                              <Input
                                {...register(`items.${index}.imageUrl`)}
                                placeholder="https://..."
                                className="w-48 h-8 text-[10px] bg-white shadow-xl border-surface-200"
                              />
                            </div>
                          </div>
                          
                          {watch(`items.${index}.imageUrl`) && (
                            <div className="relative group/thumb">
                              <div className="w-8 h-8 rounded border border-surface-200 overflow-hidden bg-white shadow-sm cursor-help">
                                <img
                                  src={watch(`items.${index}.imageUrl`)}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => setValue(`items.${index}.imageUrl`, "")}
                                  className="absolute inset-0 bg-danger-500/80 text-white opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/thumb:block z-50 pointer-events-none">
                                <div className="bg-white p-1 rounded-lg shadow-xl border border-surface-200 w-40 overflow-hidden">
                                  <img
                                    src={watch(`items.${index}.imageUrl`)}
                                    alt="Large Preview"
                                    className="w-full h-auto rounded-md"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-2 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="p-2 text-surface-300 hover:text-danger-500 hover:bg-danger-50 rounded-lg transition-all"
                          title="Hapus barang"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>


        <div className="flex justify-end gap-3 pt-4 border-t border-surface-100/50 mt-8">
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              className="px-6"
            >
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
    </div>
  );
}
