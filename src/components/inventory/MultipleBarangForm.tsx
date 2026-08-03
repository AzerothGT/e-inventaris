import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Copy, PackagePlus, Plus, Trash2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

const itemSchema = z.object({
	kodeBarang: z.string().min(1, "Kode barang harus diisi"),
	nama: z.string().min(1, "Nama barang harus diisi"),
	merek: z.string().min(1, "Merek harus diisi"),
	noSeri: z.string().optional(),
	jumlah: z.number().int().min(1, "Minimal 1"),
});

const multipleBarangSchema = z.object({
	ruanganId: z.string().min(1, "Ruangan harus dipilih"),
	kategori: z.string().min(1, "Kategori harus diisi"),
	status: z.enum(["baik", "rusak_ringan", "rusak_berat"]),
	tahunPengadaan: z.number().int().min(1900, "Tahun tidak valid"),
	items: z.array(itemSchema).min(1, "Minimal 1 barang harus ditambahkan"),
});

export type MultipleBarangFormData = z.infer<typeof multipleBarangSchema>;

interface MultipleBarangFormProps {
	onSubmit: (data: { items: Record<string, unknown>[] }) => void;
	onCancel: () => void;
	ruanganOptions: { id: string; nama: string; gedung?: string | null }[];
	kategoriOptions: { id: string; nama: string }[];
	isLoading?: boolean;
}

export function MultipleBarangForm({
	onSubmit,
	onCancel,
	ruanganOptions,
	kategoriOptions,
	isLoading,
}: MultipleBarangFormProps) {
	const {
		register,
		control,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<MultipleBarangFormData>({
		resolver: zodResolver(multipleBarangSchema),
		defaultValues: {
			status: "baik",
			tahunPengadaan: new Date().getFullYear(),
			items: [{ kodeBarang: "", nama: "", merek: "", noSeri: "", jumlah: 1 }],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "items",
	});

	const handleDuplicate = (index: number) => {
		const values = watch(`items.${index}`);
		append({
			kodeBarang: "",
			nama: values.nama || "",
			merek: values.merek || "",
			noSeri: values.noSeri || "",
			jumlah: values.jumlah || 1,
		});
	};

	const handleFormSubmit = (data: MultipleBarangFormData) => {
		const payload = data.items.map((item) => ({
			...item,
			ruanganId: data.ruanganId,
			kategori: data.kategori,
			status: data.status,
			tahunPengadaan: data.tahunPengadaan,
		}));
		onSubmit({ items: payload });
	};

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
			{/* Shared Attributes Card */}
			<div className="space-y-4 rounded-xl border border-surface-200/50 bg-surface-50/50 p-4 shadow-sm">
				<h4 className="font-bold text-surface-500 text-xs uppercase tracking-wider">
					Atribut Bersama (Shared Attributes)
				</h4>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
					<div className="space-y-1.5">
						<label className="font-semibold text-surface-700 text-xs">
							Ruangan *
						</label>
						<select
							{...register("ruanganId")}
							className="h-10 w-full rounded-lg border border-surface-200 bg-white px-3 text-sm transition-all hover:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
						<label className="font-semibold text-surface-700 text-xs">
							Kategori *
						</label>
						<select
							{...register("kategori")}
							className="h-10 w-full rounded-lg border border-surface-200 bg-white px-3 text-sm transition-all hover:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
						<label className="font-semibold text-surface-700 text-xs">
							Tahun Pengadaan *
						</label>
						<Input
							type="number"
							{...register("tahunPengadaan", { valueAsNumber: true })}
							className="h-10 hover:border-primary-300 focus:border-primary-500"
						/>
						{errors.tahunPengadaan && (
							<p className="font-medium text-[10px] text-danger-600">
								{errors.tahunPengadaan.message}
							</p>
						)}
					</div>

					<div className="space-y-1.5">
						<label className="font-semibold text-surface-700 text-xs">
							Status *
						</label>
						<select
							{...register("status")}
							className="h-10 w-full rounded-lg border border-surface-200 bg-white px-3 text-sm transition-all hover:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
						>
							<option value="baik">Baik</option>
							<option value="rusak_ringan">Rusak Ringan</option>
							<option value="rusak_berat">Rusak Berat</option>
						</select>
						{errors.status && (
							<p className="font-medium text-[10px] text-danger-600">
								{errors.status.message}
							</p>
						)}
					</div>
				</div>
			</div>

			{/* Items Table */}
			<div className="space-y-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<PackagePlus className="h-5 w-5 text-primary-600" />
						<h4 className="font-bold text-sm text-surface-900">
							Daftar Barang Tambahan
						</h4>
					</div>
					<Button
						type="button"
						variant="secondary"
						size="sm"
						onClick={() =>
							append({
								kodeBarang: "",
								nama: "",
								merek: "",
								noSeri: "",
								jumlah: 1,
							})
						}
						className="flex items-center gap-1.5 px-3 py-1.5 text-xs"
					>
						<Plus className="h-3.5 w-3.5" />
						Tambah Baris
					</Button>
				</div>

				{errors.items && !Array.isArray(errors.items) && (
					<p className="flex items-center gap-1 font-medium text-danger-600 text-xs">
						<AlertCircle className="h-3.5 w-3.5" />
						{errors.items.message}
					</p>
				)}

				<div className="overflow-hidden rounded-xl border border-surface-200 bg-white shadow-sm">
					<div className="overflow-x-auto">
						<table className="w-full border-collapse text-left text-sm">
							<thead>
								<tr className="border-surface-200 border-b bg-surface-50/50">
									<th className="w-10 px-4 py-3 font-bold text-[10px] text-surface-400 uppercase tracking-wider">
										#
									</th>
									<th className="w-1/4 px-4 py-3 font-bold text-[10px] text-surface-400 uppercase tracking-wider">
										Kode Barang *
									</th>
									<th className="w-1/4 px-4 py-3 font-bold text-[10px] text-surface-400 uppercase tracking-wider">
										Nama Barang *
									</th>
									<th className="w-1/5 px-4 py-3 font-bold text-[10px] text-surface-400 uppercase tracking-wider">
										Merek *
									</th>
									<th className="w-1/5 px-4 py-3 font-bold text-[10px] text-surface-400 uppercase tracking-wider">
										No Seri (Opt)
									</th>
									<th className="w-20 px-4 py-3 text-center font-bold text-[10px] text-surface-400 uppercase tracking-wider">
										Jumlah *
									</th>
									<th className="w-20 px-4 py-3 text-center font-bold text-[10px] text-surface-400 uppercase tracking-wider">
										Aksi
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-surface-100">
								{fields.map((field, index) => (
									<tr
										key={field.id}
										className="group transition-colors hover:bg-surface-50/30"
									>
										<td className="px-4 py-3 font-medium text-surface-400 text-xs">
											{index + 1}
										</td>
										<td className="px-2 py-2">
											<Input
												{...register(`items.${index}.kodeBarang`)}
												placeholder="INV-001"
												className="h-9 border-transparent bg-transparent font-mono text-xs transition-all hover:border-surface-200 hover:bg-white focus:border-primary-500 focus:bg-white focus:ring-0"
											/>
											{errors.items?.[index]?.kodeBarang && (
												<p className="mt-1 px-2 font-medium text-[10px] text-danger-600">
													{errors.items[index]?.kodeBarang?.message}
												</p>
											)}
										</td>
										<td className="px-2 py-2">
											<Input
												{...register(`items.${index}.nama`)}
												placeholder="Laptop Macbook Air"
												className="h-9 border-transparent bg-transparent text-xs transition-all hover:border-surface-200 hover:bg-white focus:border-primary-500 focus:bg-white focus:ring-0"
											/>
											{errors.items?.[index]?.nama && (
												<p className="mt-1 px-2 font-medium text-[10px] text-danger-600">
													{errors.items[index]?.nama?.message}
												</p>
											)}
										</td>
										<td className="px-2 py-2">
											<Input
												{...register(`items.${index}.merek`)}
												placeholder="Apple"
												className="h-9 border-transparent bg-transparent text-xs transition-all hover:border-surface-200 hover:bg-white focus:border-primary-500 focus:bg-white focus:ring-0"
											/>
											{errors.items?.[index]?.merek && (
												<p className="mt-1 px-2 font-medium text-[10px] text-danger-600">
													{errors.items[index]?.merek?.message}
												</p>
											)}
										</td>
										<td className="px-2 py-2">
											<Input
												{...register(`items.${index}.noSeri`)}
												placeholder="SN12345"
												className="h-9 border-transparent bg-transparent text-xs transition-all hover:border-surface-200 hover:bg-white focus:border-primary-500 focus:bg-white focus:ring-0"
											/>
										</td>
										<td className="px-2 py-2">
											<Input
												type="number"
												{...register(`items.${index}.jumlah`, {
													valueAsNumber: true,
												})}
												className="h-9 border-transparent bg-transparent text-center font-bold text-xs transition-all hover:border-surface-200 hover:bg-white focus:border-primary-500 focus:bg-white focus:ring-0"
											/>
											{errors.items?.[index]?.jumlah && (
												<p className="mt-1 px-2 font-medium text-[10px] text-danger-600">
													{errors.items[index]?.jumlah?.message}
												</p>
											)}
										</td>
										<td className="px-2 py-2">
											<div className="flex items-center justify-center gap-1">
												<button
													type="button"
													onClick={() => handleDuplicate(index)}
													className="rounded-lg p-1.5 text-surface-400 transition-all hover:bg-primary-50 hover:text-primary-500"
													title="Duplikasi baris"
												>
													<Copy className="h-3.5 w-3.5" />
												</button>
												<button
													type="button"
													onClick={() => remove(index)}
													className="rounded-lg p-1.5 text-surface-400 transition-all hover:bg-danger-50 hover:text-danger-500"
													title="Hapus baris"
													disabled={fields.length === 1}
												>
													<Trash2 className="h-3.5 w-3.5" />
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="flex justify-end gap-3 border-surface-100 border-t pt-4">
				<Button type="button" variant="ghost" onClick={onCancel}>
					Batal
				</Button>
				<Button type="submit" disabled={isLoading}>
					{isLoading ? "Menyimpan..." : "Tambah Semua Barang"}
				</Button>
			</div>
		</form>
	);
}
