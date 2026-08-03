import { zodResolver } from "@hookform/resolvers/zod";
import { Archive, Package, Tag } from "lucide-react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

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
});

type BarangFormData = z.infer<typeof barangSchema>;

interface BarangFormProps {
	initialData?: Partial<BarangFormData>;
	onSubmit: SubmitHandler<BarangFormData>;
	onCancel: () => void;
	ruanganOptions: { id: string; nama: string; gedung?: string | null }[];
	kategoriOptions: { id: string; nama: string }[];
	isLoading?: boolean;
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
	});

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			{/* Header section with Icon */}
			<div className="flex items-center gap-3 border-surface-100 border-b pb-4">
				<div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary-100/50 bg-primary-50 text-primary-600 shadow-sm">
					<Package className="h-6 w-6" />
				</div>
				<div className="flex flex-col">
					<h3 className="font-bold text-base text-surface-900 tracking-tight">
						{initialData ? "Edit Detail Barang" : "Informasi Inventaris Barang"}
					</h3>
					<p className="text-surface-500 text-xs">
						{initialData
							? "Perbarui detail informasi barang terdaftar"
							: "Lengkapi detail informasi barang untuk dicatat ke sistem"}
					</p>
				</div>
			</div>

			{/* Section 1: Identifikasi Barang */}
			<div className="space-y-4">
				<div className="flex items-center gap-2 border-surface-100 border-b pb-2">
					<Tag className="h-4 w-4 text-primary-500" />
					<h4 className="font-bold text-surface-700 text-xs uppercase tracking-wider">
						Identifikasi Barang
					</h4>
				</div>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div className="space-y-1.5">
						<label className="font-bold text-surface-600 text-xs uppercase tracking-wider">
							Kode Barang *
						</label>
						<Input
							{...register("kodeBarang")}
							placeholder="Contoh: INV-001"
							className="h-10 bg-white text-sm transition-colors hover:border-surface-300 focus:border-primary-500"
						/>
						{errors.kodeBarang && (
							<p className="font-medium text-[10px] text-danger-600">
								{errors.kodeBarang.message}
							</p>
						)}
					</div>
					<div className="space-y-1.5">
						<label className="font-bold text-surface-600 text-xs uppercase tracking-wider">
							Nama Barang *
						</label>
						<Input
							{...register("nama")}
							placeholder="Contoh: Laptop Macbook Air"
							className="h-10 bg-white text-sm transition-colors hover:border-surface-300 focus:border-primary-500"
						/>
						{errors.nama && (
							<p className="font-medium text-[10px] text-danger-600">
								{errors.nama.message}
							</p>
						)}
					</div>
					<div className="space-y-1.5">
						<label className="font-bold text-surface-600 text-xs uppercase tracking-wider">
							Kategori *
						</label>
						<select
							{...register("kategori")}
							className="h-10 w-full rounded-lg border border-surface-200 bg-white px-3 text-sm transition-all hover:border-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
						>
							<option value="">Pilih Kategori</option>
							{kategoriOptions.map((k) => (
								<option key={k.id} value={k.nama}>
									{k.nama}
								</option>
							))}
						</select>
						{errors.kategori && (
							<p className="font-medium text-[10px] text-danger-600">
								{errors.kategori.message}
							</p>
						)}
					</div>
					<div className="space-y-1.5">
						<label className="font-bold text-surface-600 text-xs uppercase tracking-wider">
							Merek *
						</label>
						<Input
							{...register("merek")}
							placeholder="Contoh: Apple"
							className="h-10 bg-white text-sm transition-colors hover:border-surface-300 focus:border-primary-500"
						/>
						{errors.merek && (
							<p className="font-medium text-[10px] text-danger-600">
								{errors.merek.message}
							</p>
						)}
					</div>
					<div className="space-y-1.5 md:col-span-2">
						<label className="font-bold text-surface-600 text-xs uppercase tracking-wider">
							Nomor Seri
						</label>
						<Input
							{...register("noSeri")}
							placeholder="Contoh: SN123456 (opsional)"
							className="h-10 bg-white text-sm transition-colors hover:border-surface-300 focus:border-primary-500"
						/>
					</div>
				</div>
			</div>

			{/* Section 2: Penyimpanan & Pengadaan */}
			<div className="space-y-4 pt-2">
				<div className="flex items-center gap-2 border-surface-100 border-b pb-2">
					<Archive className="h-4 w-4 text-primary-500" />
					<h4 className="font-bold text-surface-700 text-xs uppercase tracking-wider">
						Penyimpanan & Pengadaan
					</h4>
				</div>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div className="space-y-1.5 md:col-span-2">
						<label className="font-bold text-surface-600 text-xs uppercase tracking-wider">
							Lokasi Ruangan *
						</label>
						<select
							{...register("ruanganId")}
							className="h-10 w-full rounded-lg border border-surface-200 bg-white px-3 text-sm transition-all hover:border-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
						>
							<option value="">Pilih Ruangan</option>
							{ruanganOptions.map((r) => (
								<option key={r.id} value={r.id}>
									{r.nama} {r.gedung ? `(${r.gedung})` : ""}
								</option>
							))}
						</select>
						{errors.ruanganId && (
							<p className="font-medium text-[10px] text-danger-600">
								{errors.ruanganId.message}
							</p>
						)}
					</div>
					<div className="space-y-1.5">
						<label className="font-bold text-surface-600 text-xs uppercase tracking-wider">
							Kondisi Awal *
						</label>
						<select
							{...register("status")}
							className="h-10 w-full rounded-lg border border-surface-200 bg-white px-3 text-sm transition-all hover:border-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
						>
							<option value="baik">Baik</option>
							<option value="rusak_ringan">Rusak Ringan</option>
							<option value="rusak_berat">Rusak Berat</option>
						</select>
					</div>
					<div className="space-y-1.5">
						<label className="font-bold text-surface-600 text-xs uppercase tracking-wider">
							Jumlah *
						</label>
						<Input
							type="number"
							{...register("jumlah", { valueAsNumber: true })}
							className="h-10 bg-white text-sm transition-colors hover:border-surface-300 focus:border-primary-500"
						/>
						{errors.jumlah && (
							<p className="font-medium text-[10px] text-danger-600">
								{errors.jumlah.message}
							</p>
						)}
					</div>
					<div className="space-y-1.5 md:col-span-2">
						<label className="font-bold text-surface-600 text-xs uppercase tracking-wider">
							Tahun Pengadaan *
						</label>
						<Input
							type="number"
							{...register("tahunPengadaan", { valueAsNumber: true })}
							className="h-10 bg-white text-sm transition-colors hover:border-surface-300 focus:border-primary-500"
						/>
						{errors.tahunPengadaan && (
							<p className="font-medium text-[10px] text-danger-600">
								{errors.tahunPengadaan.message}
							</p>
						)}
					</div>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="mt-6 flex justify-end gap-3 border-surface-100 border-t pt-4">
				<Button
					type="button"
					variant="ghost"
					onClick={onCancel}
					className="px-6 font-semibold"
				>
					Batal
				</Button>
				<Button
					type="submit"
					disabled={isLoading}
					className="px-8 font-semibold shadow-md transition-all active:scale-95"
				>
					{isLoading ? (
						<div className="flex items-center gap-2">
							<div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
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
	);
}
