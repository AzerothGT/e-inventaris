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

        {/* Items */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-surface-700">
              Daftar Barang yang Diajukan
            </label>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() =>
                append({ namaBarang: "", merek: "", kategori: "", jumlah: 1, satuan: "Unit", imageUrl: "" })
              }
              className="flex items-center gap-1 text-xs"
            >
              <Plus className="h-3 w-3" />
              Tambah Barang
            </Button>
          </div>

          {errors.items && !Array.isArray(errors.items) && (
            <p className="text-xs font-medium text-danger-600">
              {errors.items.message}
            </p>
          )}

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 rounded-xl border border-surface-200 bg-white/70 space-y-3"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-surface-500 uppercase tracking-wider">
                    Barang #{index + 1}
                  </span>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-danger-400 hover:text-danger-600 transition-colors"
                      title="Hapus barang"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <Input
                    {...register(`items.${index}.namaBarang`)}
                    placeholder="Nama Barang *"
                    className="hover:border-primary-300 focus:border-primary-500 transition-colors"
                  />
                  {errors.items?.[index]?.namaBarang && (
                    <p className="text-xs font-medium text-danger-600">
                      {errors.items[index]?.namaBarang?.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <Input
                    {...register(`items.${index}.merek`)}
                    placeholder="Merek / Tipe"
                    className="hover:border-primary-300 focus:border-primary-500 transition-colors"
                  />

                  <select
                    {...register(`items.${index}.kategori`)}
                    className="w-full h-10 px-3 rounded-lg border border-surface-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all hover:border-primary-300"
                  >
                    <option value="">Kategori</option>
                    {kategoriOptions.map((k) => (
                      <option key={k.id} value={k.nama}>
                        {k.nama}
                      </option>
                    ))}
                  </select>

                  <Input
                    type="number"
                    {...register(`items.${index}.jumlah`, {
                      valueAsNumber: true,
                    })}
                    placeholder="Jumlah"
                    className="hover:border-primary-300 focus:border-primary-500 transition-colors"
                  />

                  <Input
                    {...register(`items.${index}.satuan`)}
                    placeholder="Satuan (Pcs, Box, etc)"
                    className="hover:border-primary-300 focus:border-primary-500 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-surface-400 uppercase tracking-wider ml-1">
                    Gambar Barang (Link atau Upload)
                  </label>
                  <div className="flex gap-3">
                    <div className="relative flex-1 group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-surface-400 group-focus-within:text-primary-500 transition-colors">
                        <LinkIcon className="h-4 w-4" />
                      </div>
                      <Input
                        {...register(`items.${index}.imageUrl`)}
                        placeholder="https://example.com/image.jpg"
                        className="pl-9 hover:border-primary-300 focus:border-primary-500 transition-colors"
                      />
                    </div>
                    
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(index, e)}
                        className="hidden"
                        id={`file-upload-${index}`}
                      />
                      <label
                        htmlFor={`file-upload-${index}`}
                        className="flex h-10 items-center gap-2 px-4 rounded-lg border border-surface-200 bg-white hover:bg-surface-50 hover:border-primary-300 text-sm font-medium text-surface-700 cursor-pointer transition-all active:scale-95 shadow-sm"
                      >
                        <ImageIcon className="h-4 w-4 text-primary-500" />
                        <span>Upload</span>
                      </label>
                    </div>
                  </div>

                  {watch(`items.${index}.imageUrl`) && (
                    <div className="relative mt-2 w-full aspect-video rounded-xl border border-surface-100 bg-surface-50/50 overflow-hidden group">
                      <img
                        src={watch(`items.${index}.imageUrl`)}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => setValue(`items.${index}.imageUrl`, "")}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/80 backdrop-blur-sm text-danger-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
                {errors.items?.[index]?.jumlah && (
                  <p className="text-xs font-medium text-danger-600">
                    {errors.items[index]?.jumlah?.message}
                  </p>
                )}
              </div>
            ))}
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
