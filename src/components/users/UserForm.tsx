import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { ROLE_DEPARTMENTS } from "../../lib/approvals";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

const userSchema = z.object({
	username: z.string().min(3, "Username minimal 3 karakter"),
	password: z
		.string()
		.min(6, "Password minimal 6 karakter")
		.optional()
		.or(z.literal("")),
	name: z.string().min(1, "Nama harus diisi"),
	role: z.enum([
		"admin",
		"kaprog",
		"penjaga_lab",
		"orang_tu",
		"wakasek",
		"kepala_sekolah",
		"tu_admin",
	]),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
	initialData?: Partial<UserFormData>;
	onSubmit: SubmitHandler<UserFormData>;
	onCancel: () => void;
	isLoading?: boolean;
	isEdit?: boolean;
}

export function UserForm({
	initialData,
	onSubmit,
	onCancel,
	isLoading,
	isEdit = false,
}: UserFormProps) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UserFormData>({
		resolver: zodResolver(
			isEdit
				? userSchema.extend({ password: z.string().optional() })
				: userSchema,
		),
		defaultValues: initialData || {
			role: "kaprog",
		},
	});

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			<div className="space-y-4">
				<div className="space-y-2">
					<label className="font-medium text-sm text-surface-700">
						Nama Lengkap
					</label>
					<Input {...register("name")} placeholder="John Doe" />
					{errors.name && (
						<p className="text-danger-600 text-xs">{errors.name.message}</p>
					)}
				</div>

				<div className="space-y-2">
					<label className="font-medium text-sm text-surface-700">
						Username
					</label>
					<Input {...register("username")} placeholder="johndoe" />
					{errors.username && (
						<p className="text-danger-600 text-xs">{errors.username.message}</p>
					)}
				</div>

				{!isEdit && (
					<div className="space-y-2">
						<label className="font-medium text-sm text-surface-700">
							Password
						</label>
						<Input
							type="password"
							{...register("password")}
							placeholder="••••••••"
							autoComplete="new-password"
						/>
						{errors.password && (
							<p className="text-danger-600 text-xs">
								{errors.password.message}
							</p>
						)}
					</div>
				)}

				<div className="space-y-2">
					<label className="font-medium text-sm text-surface-700">
						Role / Jabatan
					</label>
					<select
						{...register("role")}
						className="h-10 w-full rounded-lg border border-surface-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
					>
						{Object.entries(ROLE_DEPARTMENTS).map(([role, label]) => (
							<option key={role} value={role}>
								{label}
							</option>
						))}
					</select>
					{errors.role && (
						<p className="text-danger-600 text-xs">{errors.role.message}</p>
					)}
				</div>
			</div>

			<div className="flex justify-end gap-3 border-surface-100 border-t pt-4">
				<Button type="button" variant="ghost" onClick={onCancel}>
					Batal
				</Button>
				<Button type="submit" disabled={isLoading}>
					{isLoading
						? "Menyimpan..."
						: isEdit
							? "Update Pengguna"
							: "Tambah Pengguna"}
				</Button>
			</div>
		</form>
	);
}
