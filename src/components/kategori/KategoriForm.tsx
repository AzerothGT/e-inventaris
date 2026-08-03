import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

const kategoriSchema = z.object({
	nama: z.string().min(1, "Nama kategori harus diisi"),
	deskripsi: z.string().optional(),
});

type KategoriFormData = z.infer<typeof kategoriSchema>;

interface KategoriFormProps {
	initialData?: Partial<KategoriFormData>;
	onSubmit: SubmitHandler<KategoriFormData>;
	onCancel: () => void;
	isLoading?: boolean;
}

export function KategoriForm({
	initialData,
	onSubmit,
	onCancel,
	isLoading,
}: KategoriFormProps) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<KategoriFormData>({
		resolver: zodResolver(kategoriSchema),
		defaultValues: initialData || {
			nama: "",
			deskripsi: "",
		},
	});

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			<div className="space-y-2">
				<label className="font-medium text-sm text-surface-700">
					Nama Kategori
				</label>
				<Input {...register("nama")} placeholder="Ekstra Kurikuler" />
				{errors.nama && (
					<p className="text-danger-600 text-xs">{errors.nama.message}</p>
				)}
			</div>

			<div className="space-y-2">
				<label className="font-medium text-sm text-surface-700">
					Deskripsi (Opsional)
				</label>
				<textarea
					{...register("deskripsi")}
					rows={3}
					placeholder="Kategori untuk barang-barang ekstrakurikuler..."
					className="w-full resize-none rounded-lg border border-surface-200 bg-white p-3 text-sm transition-all hover:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
				/>
			</div>

			<div className="flex justify-end gap-3 pt-4">
				<Button type="button" variant="ghost" onClick={onCancel}>
					Batal
				</Button>
				<Button type="submit" disabled={isLoading}>
					{isLoading
						? "Menyimpan..."
						: initialData
							? "Update Kategori"
							: "Tambah Kategori"}
				</Button>
			</div>
		</form>
	);
}
