import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Plus, Trash2, Image as ImageIcon, Link as LinkIcon, X, Check, Package, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/utils";

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
  const [showUrlInputs, setShowUrlInputs] = useState<Record<number, boolean>>({});

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

  const toggleUrlInput = (index: number) => {
    setShowUrlInputs((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const currentPrioritas = watch("prioritas");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-fade-in">
      {/* Section 1: Informasi Permintaan */}
      <div className="bg-surface-50/50 p-6 rounded-2xl border border-surface-200/60 space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-surface-200/50">
          <div className="w-7 h-7 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
            <Sparkles className="h-4 w-4" />
          </div>
          <h4 className="text-sm font-bold text-surface-900">Informasi Pengajuan</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nama Event */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold text-surface-700 uppercase tracking-wider">
              Nama Event / Kegiatan *
            </label>
            <Input
              {...register("namaEvent")}
              placeholder="Contoh: Pengadaan Lab Komputer Semester Genap 2026"
              className="hover:border-surface-300 focus:border-primary-500 transition-colors h-11 bg-white text-sm"
            />
            {errors.namaEvent && (
              <p className="text-xs font-medium text-danger-600">
                {errors.namaEvent.message}
              </p>
            )}
          </div>

          {/* Prioritas (Segmented Buttons) */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold text-surface-700 uppercase tracking-wider block">
              Prioritas Pengadaan *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(["rendah", "sedang", "tinggi"] as const).map((p) => {
                const isSelected = currentPrioritas === p;
                const baseClasses =
                  "flex items-center justify-center gap-2 py-3 px-4 rounded-lg border text-sm font-semibold transition-all cursor-pointer select-none active:scale-95";
                
                const styles = {
                  rendah: isSelected
                    ? "bg-success-100 border-success-500 text-success-700 ring-2 ring-success-500/20 shadow-sm"
                    : "bg-white border-surface-200 text-surface-600 hover:bg-success-50/50 hover:border-success-300 hover:text-success-600",
                  sedang: isSelected
                    ? "bg-warning-100 border-warning-500 text-warning-700 ring-2 ring-warning-500/20 shadow-sm"
                    : "bg-white border-surface-200 text-surface-600 hover:bg-warning-50/50 hover:border-warning-300 hover:text-warning-600",
                  tinggi: isSelected
                    ? "bg-danger-100 border-danger-500 text-danger-700 ring-2 ring-danger-500/20 shadow-sm"
                    : "bg-white border-surface-200 text-surface-600 hover:bg-danger-50/50 hover:border-danger-300 hover:text-danger-600",
                }[p];

                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setValue("prioritas", p)}
                    className={cn(baseClasses, styles)}
                  >
                    {isSelected && <Check className="h-4 w-4 shrink-0" />}
                    <span className="capitalize">{p}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Deskripsi */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold text-surface-700 uppercase tracking-wider">
              Deskripsi / Alasan Pengadaan *
            </label>
            <textarea
              {...register("deskripsi")}
              rows={3}
              placeholder="Jelaskan tujuan kegiatan pengadaan ini secara lengkap..."
              className="w-full p-3.5 rounded-xl border border-surface-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all hover:border-surface-300 resize-none shadow-sm"
            />
            {errors.deskripsi && (
              <p className="text-xs font-medium text-danger-600">
                {errors.deskripsi.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Section 2: Daftar Barang */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-surface-200/50 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
              <Package className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-surface-900">Daftar Barang</h4>
              <p className="text-[11px] text-surface-500 font-medium">
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
            className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 bg-primary-50 hover:bg-primary-100 border-none text-primary-600 transition-colors rounded-lg cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Tambah Barang
          </Button>
        </div>

        {errors.items && !Array.isArray(errors.items) && (
          <p className="text-xs font-medium text-danger-600 px-1">
            {errors.items.message}
          </p>
        )}

        <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="p-5 rounded-2xl border border-surface-200 bg-white shadow-sm hover:border-primary-300 hover:shadow-md transition-all duration-300 space-y-4 relative group"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary-700 bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
                  Barang #{index + 1}
                </span>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 text-surface-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-all cursor-pointer"
                    title="Hapus barang"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Grid Fields */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Nama Barang */}
                <div className="md:col-span-6 space-y-1.5">
                  <label className="text-[11px] font-bold text-surface-600 uppercase tracking-wider">
                    Nama Barang *
                  </label>
                  <Input
                    {...register(`items.${index}.namaBarang`)}
                    placeholder="Contoh: Laptop, Printer, Kursi"
                    className="h-10 text-sm bg-surface-50 border-surface-200 focus:bg-white transition-all rounded-lg"
                  />
                  {errors.items?.[index]?.namaBarang && (
                    <p className="text-[10px] font-medium text-danger-600">
                      {errors.items[index]?.namaBarang?.message}
                    </p>
                  )}
                </div>

                {/* Kategori */}
                <div className="md:col-span-6 space-y-1.5">
                  <label className="text-[11px] font-bold text-surface-600 uppercase tracking-wider">
                    Kategori
                  </label>
                  <select
                    {...register(`items.${index}.kategori`)}
                    className="w-full h-10 px-3 rounded-lg border border-surface-200 bg-surface-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all hover:border-surface-300"
                  >
                    <option value="">Pilih Kategori</option>
                    {kategoriOptions.map((k) => (
                      <option key={k.id} value={k.nama}>
                        {k.nama}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Merek */}
                <div className="md:col-span-5 space-y-1.5">
                  <label className="text-[11px] font-bold text-surface-600 uppercase tracking-wider">
                    Merek / Tipe
                  </label>
                  <Input
                    {...register(`items.${index}.merek`)}
                    placeholder="Contoh: Asus, Epson, IKEA"
                    className="h-10 text-sm bg-surface-50 border-surface-200 focus:bg-white transition-all rounded-lg"
                  />
                </div>

                {/* Jumlah & Stepper */}
                <div className="md:col-span-4 space-y-1.5">
                  <label className="text-[11px] font-bold text-surface-600 uppercase tracking-wider block">
                    Jumlah *
                  </label>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => {
                        const val = watch(`items.${index}.jumlah`) || 1;
                        if (val > 1) setValue(`items.${index}.jumlah`, val - 1);
                      }}
                      className="h-10 w-10 border border-surface-200 border-r-0 bg-surface-50 hover:bg-surface-100 rounded-l-lg flex items-center justify-center text-surface-600 font-semibold cursor-pointer active:scale-95 transition-all"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      {...register(`items.${index}.jumlah`, {
                        valueAsNumber: true,
                      })}
                      className="h-10 w-14 border border-surface-200 bg-white text-center text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const val = watch(`items.${index}.jumlah`) || 1;
                        setValue(`items.${index}.jumlah`, val + 1);
                      }}
                      className="h-10 w-10 border border-surface-200 border-l-0 bg-surface-50 hover:bg-surface-100 rounded-r-lg flex items-center justify-center text-surface-600 font-semibold cursor-pointer active:scale-95 transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Satuan */}
                <div className="md:col-span-3 space-y-1.5">
                  <label className="text-[11px] font-bold text-surface-600 uppercase tracking-wider">
                    Satuan
                  </label>
                  <Input
                    {...register(`items.${index}.satuan`)}
                    placeholder="Unit, Pcs, Lembar"
                    className="h-10 text-sm bg-surface-50 border-surface-200 focus:bg-white transition-all rounded-lg"
                  />
                </div>
              </div>

              {/* Media Upload Buttons and Previews */}
              <div className="pt-3 border-t border-surface-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-surface-500 uppercase tracking-wider">
                    Lampiran Gambar:
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(index, e)}
                      className="hidden"
                      id={`file-upload-${index}`}
                    />
                    <label
                      htmlFor={`file-upload-${index}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-200 bg-white hover:bg-surface-50 hover:border-primary-300 text-xs font-semibold text-surface-700 cursor-pointer transition-all active:scale-95 shadow-sm"
                    >
                      <ImageIcon className="h-3.5 w-3.5 text-primary-500" />
                      Upload File
                    </label>
                    <button
                      type="button"
                      onClick={() => toggleUrlInput(index)}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all active:scale-95 shadow-sm",
                        showUrlInputs[index]
                          ? "bg-primary-50 border-primary-200 text-primary-600"
                          : "bg-white border-surface-200 text-surface-700 hover:bg-surface-50 hover:border-primary-300"
                      )}
                    >
                      <LinkIcon className="h-3.5 w-3.5 text-surface-500" />
                      Tautkan URL
                    </button>
                  </div>
                </div>

                {/* Show Preview and Close Button */}
                {watch(`items.${index}.imageUrl`) && (
                  <div className="flex items-center gap-2 bg-primary-50/50 p-1.5 pr-3 rounded-xl border border-primary-100 shadow-sm max-w-full">
                    <div className="w-9 h-9 rounded-lg border border-primary-200 overflow-hidden bg-white shrink-0">
                      <img
                        src={watch(`items.${index}.imageUrl`)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span
                      className="text-[10px] font-semibold text-primary-800 truncate max-w-[150px]"
                      title={watch(`items.${index}.imageUrl`)}
                    >
                      {watch(`items.${index}.imageUrl`)?.startsWith("data:")
                        ? "File terunggah"
                        : "Tautan gambar"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setValue(`items.${index}.imageUrl`, "")}
                      className="p-1 text-danger-500 hover:bg-danger-50 rounded-lg transition-colors cursor-pointer shrink-0 ml-1"
                      title="Hapus gambar"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* URL Tautan Input field (displays only when toggled) */}
              {showUrlInputs[index] && (
                <div className="pt-2 animate-slide-up">
                  <Input
                    {...register(`items.${index}.imageUrl`)}
                    placeholder="Masukkan tautan gambar internet (https://example.com/image.jpg)"
                    className="h-10 text-xs bg-surface-50 focus:bg-white"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="flex justify-end gap-3 pt-6 border-t border-surface-200/50">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="px-6 font-semibold"
          >
            Batal
          </Button>
        )}
        <Button
          type="submit"
          disabled={isLoading}
          className="px-8 font-semibold shadow-md active:scale-95 transition-all"
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
  );
}
