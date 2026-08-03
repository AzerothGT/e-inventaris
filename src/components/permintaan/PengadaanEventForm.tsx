import { zodResolver } from "@hookform/resolvers/zod";
import {
	Check,
	Image as ImageIcon,
	Link as LinkIcon,
	Package,
	Plus,
	Sparkles,
	Trash2,
	X,
} from "lucide-react";
import { useState } from "react";
import { type SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "../../lib/utils";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

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
			items: [
				{
					namaBarang: "",
					merek: "",
					kategori: "",
					jumlah: 1,
					satuan: "Unit",
					imageUrl: "",
				},
			],
		},
	});

	const { fields, append, remove } = useFieldArray({ control, name: "items" });
	const [showUrlInputs, setShowUrlInputs] = useState<Record<number, boolean>>(
		{},
	);

	const handleFileUpload = (
		index: number,
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
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
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="animate-fade-in space-y-8"
		>
			{/* Section 1: Informasi Permintaan */}
			<div className="space-y-6 rounded-2xl border border-surface-200/60 bg-surface-50/50 p-6">
				<div className="flex items-center gap-2 border-surface-200/50 border-b pb-2">
					<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
						<Sparkles className="h-4 w-4" />
					</div>
					<h4 className="font-bold text-sm text-surface-900">
						Informasi Pengajuan
					</h4>
				</div>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					{/* Nama Event */}
					<div className="space-y-2 md:col-span-2">
						<label className="font-bold text-surface-700 text-xs uppercase tracking-wider">
							Nama Event / Kegiatan *
						</label>
						<Input
							{...register("namaEvent")}
							placeholder="Contoh: Pengadaan Lab Komputer Semester Genap 2026"
							className="h-11 bg-white text-sm transition-colors hover:border-surface-300 focus:border-primary-500"
						/>
						{errors.namaEvent && (
							<p className="font-medium text-danger-600 text-xs">
								{errors.namaEvent.message}
							</p>
						)}
					</div>

					{/* Prioritas (Segmented Buttons) */}
					<div className="space-y-2 md:col-span-2">
						<label className="block font-bold text-surface-700 text-xs uppercase tracking-wider">
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
						<label className="font-bold text-surface-700 text-xs uppercase tracking-wider">
							Deskripsi / Alasan Pengadaan *
						</label>
						<textarea
							{...register("deskripsi")}
							rows={3}
							placeholder="Jelaskan tujuan kegiatan pengadaan ini secara lengkap..."
							className="w-full resize-none rounded-xl border border-surface-200 bg-white p-3.5 text-sm shadow-sm transition-all hover:border-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
						/>
						{errors.deskripsi && (
							<p className="font-medium text-danger-600 text-xs">
								{errors.deskripsi.message}
							</p>
						)}
					</div>
				</div>
			</div>

			{/* Section 2: Daftar Barang */}
			<div className="space-y-4">
				<div className="flex items-center justify-between border-surface-200/50 border-b pb-3">
					<div className="flex items-center gap-2">
						<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
							<Package className="h-4 w-4" />
						</div>
						<div>
							<h4 className="font-bold text-sm text-surface-900">
								Daftar Barang
							</h4>
							<p className="font-medium text-[11px] text-surface-500">
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
						className="flex cursor-pointer items-center gap-1.5 rounded-lg border-none bg-primary-50 px-4 py-2 font-bold text-primary-600 text-xs transition-colors hover:bg-primary-100"
					>
						<Plus className="h-4 w-4" />
						Tambah Barang
					</Button>
				</div>

				{errors.items && !Array.isArray(errors.items) && (
					<p className="px-1 font-medium text-danger-600 text-xs">
						{errors.items.message}
					</p>
				)}

				<div className="max-h-[480px] space-y-4 overflow-y-auto pr-1">
					{fields.map((field, index) => (
						<div
							key={field.id}
							className="group relative space-y-4 rounded-2xl border border-surface-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-primary-300 hover:shadow-md"
						>
							{/* Card Header */}
							<div className="flex items-center justify-between">
								<span className="rounded-full border border-primary-100 bg-primary-50 px-3 py-1 font-bold text-primary-700 text-xs">
									Barang #{index + 1}
								</span>
								{fields.length > 1 && (
									<button
										type="button"
										onClick={() => remove(index)}
										className="cursor-pointer rounded-lg p-2 text-surface-400 transition-all hover:bg-danger-50 hover:text-danger-600"
										title="Hapus barang"
									>
										<Trash2 className="h-4 w-4" />
									</button>
								)}
							</div>

							{/* Grid Fields */}
							<div className="grid grid-cols-1 gap-4 md:grid-cols-12">
								{/* Nama Barang */}
								<div className="space-y-1.5 md:col-span-6">
									<label className="font-bold text-[11px] text-surface-600 uppercase tracking-wider">
										Nama Barang *
									</label>
									<Input
										{...register(`items.${index}.namaBarang`)}
										placeholder="Contoh: Laptop, Printer, Kursi"
										className="h-10 rounded-lg border-surface-200 bg-surface-50 text-sm transition-all focus:bg-white"
									/>
									{errors.items?.[index]?.namaBarang && (
										<p className="font-medium text-[10px] text-danger-600">
											{errors.items[index]?.namaBarang?.message}
										</p>
									)}
								</div>

								{/* Kategori */}
								<div className="space-y-1.5 md:col-span-6">
									<label className="font-bold text-[11px] text-surface-600 uppercase tracking-wider">
										Kategori
									</label>
									<select
										{...register(`items.${index}.kategori`)}
										className="h-10 w-full rounded-lg border border-surface-200 bg-surface-50 px-3 text-sm transition-all hover:border-surface-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
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
								<div className="space-y-1.5 md:col-span-5">
									<label className="font-bold text-[11px] text-surface-600 uppercase tracking-wider">
										Merek / Tipe
									</label>
									<Input
										{...register(`items.${index}.merek`)}
										placeholder="Contoh: Asus, Epson, IKEA"
										className="h-10 rounded-lg border-surface-200 bg-surface-50 text-sm transition-all focus:bg-white"
									/>
								</div>

								{/* Jumlah & Stepper */}
								<div className="space-y-1.5 md:col-span-4">
									<label className="block font-bold text-[11px] text-surface-600 uppercase tracking-wider">
										Jumlah *
									</label>
									<div className="flex items-center">
										<button
											type="button"
											onClick={() => {
												const val = watch(`items.${index}.jumlah`) || 1;
												if (val > 1) setValue(`items.${index}.jumlah`, val - 1);
											}}
											className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-l-lg border border-surface-200 border-r-0 bg-surface-50 font-semibold text-surface-600 transition-all hover:bg-surface-100 active:scale-95"
										>
											-
										</button>
										<input
											type="number"
											{...register(`items.${index}.jumlah`, {
												valueAsNumber: true,
											})}
											className="h-10 w-14 border border-surface-200 bg-white text-center font-semibold text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
										/>
										<button
											type="button"
											onClick={() => {
												const val = watch(`items.${index}.jumlah`) || 1;
												setValue(`items.${index}.jumlah`, val + 1);
											}}
											className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-r-lg border border-surface-200 border-l-0 bg-surface-50 font-semibold text-surface-600 transition-all hover:bg-surface-100 active:scale-95"
										>
											+
										</button>
									</div>
								</div>

								{/* Satuan */}
								<div className="space-y-1.5 md:col-span-3">
									<label className="font-bold text-[11px] text-surface-600 uppercase tracking-wider">
										Satuan
									</label>
									<Input
										{...register(`items.${index}.satuan`)}
										placeholder="Unit, Pcs, Lembar"
										className="h-10 rounded-lg border-surface-200 bg-surface-50 text-sm transition-all focus:bg-white"
									/>
								</div>
							</div>

							{/* Media Upload Buttons and Previews */}
							<div className="flex flex-col justify-between gap-3 border-surface-100 border-t pt-3 sm:flex-row sm:items-center">
								<div className="flex items-center gap-3">
									<span className="font-bold text-[11px] text-surface-500 uppercase tracking-wider">
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
											className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-surface-200 bg-white px-3 py-1.5 font-semibold text-surface-700 text-xs shadow-sm transition-all hover:border-primary-300 hover:bg-surface-50 active:scale-95"
										>
											<ImageIcon className="h-3.5 w-3.5 text-primary-500" />
											Upload File
										</label>
										<button
											type="button"
											onClick={() => toggleUrlInput(index)}
											className={cn(
												"inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 font-semibold text-xs shadow-sm transition-all active:scale-95",
												showUrlInputs[index]
													? "border-primary-200 bg-primary-50 text-primary-600"
													: "border-surface-200 bg-white text-surface-700 hover:border-primary-300 hover:bg-surface-50",
											)}
										>
											<LinkIcon className="h-3.5 w-3.5 text-surface-500" />
											Tautkan URL
										</button>
									</div>
								</div>

								{/* Show Preview and Close Button */}
								{watch(`items.${index}.imageUrl`) && (
									<div className="flex max-w-full items-center gap-2 rounded-xl border border-primary-100 bg-primary-50/50 p-1.5 pr-3 shadow-sm">
										<div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-primary-200 bg-white">
											<img
												src={watch(`items.${index}.imageUrl`)}
												alt="Preview"
												className="h-full w-full object-cover"
											/>
										</div>
										<span
											className="max-w-[150px] truncate font-semibold text-[10px] text-primary-800"
											title={watch(`items.${index}.imageUrl`)}
										>
											{watch(`items.${index}.imageUrl`)?.startsWith("data:")
												? "File terunggah"
												: "Tautan gambar"}
										</span>
										<button
											type="button"
											onClick={() => setValue(`items.${index}.imageUrl`, "")}
											className="ml-1 shrink-0 cursor-pointer rounded-lg p-1 text-danger-500 transition-colors hover:bg-danger-50"
											title="Hapus gambar"
										>
											<X className="h-4 w-4" />
										</button>
									</div>
								)}
							</div>

							{/* URL Tautan Input field (displays only when toggled) */}
							{showUrlInputs[index] && (
								<div className="animate-slide-up pt-2">
									<Input
										{...register(`items.${index}.imageUrl`)}
										placeholder="Masukkan tautan gambar internet (https://example.com/image.jpg)"
										className="h-10 bg-surface-50 text-xs focus:bg-white"
									/>
								</div>
							)}
						</div>
					))}
				</div>
			</div>

			{/* Form Action Buttons */}
			<div className="flex justify-end gap-3 border-surface-200/50 border-t pt-6">
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
					className="px-8 font-semibold shadow-md transition-all active:scale-95"
				>
					{isLoading ? (
						<div className="flex items-center gap-2">
							<div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
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
