import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, KeyRound, Trash2 } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { UserRole } from "../../lib/approvals";
import {
	deleteUser,
	resetPassword,
	updateUser,
} from "../../server/functions/users";
import { Button } from "../ui/Button";
import { Dialog } from "../ui/Dialog";
import { Input } from "../ui/Input";
import { UserForm } from "./UserForm";

interface UserTableActionsProps {
	user: {
		id: string;
		username: string;
		name: string;
		role: string;
	};
}

export function UserTableActions({ user }: UserTableActionsProps) {
	const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
	const [isResetPasswordOpen, setIsResetPasswordOpen] = React.useState(false);
	const [newPassword, setNewPassword] = React.useState("");

	const queryClient = useQueryClient();

	const updateMutation = useMutation({
		mutationFn: updateUser,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
			toast.success("Pengguna berhasil diperbarui");
			setIsEditDialogOpen(false);
		},
		onError: (error: Error) => {
			toast.error(error.message || "Gagal memperbarui pengguna");
		},
	});

	const deleteMutation = useMutation({
		mutationFn: deleteUser,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
			toast.success("Pengguna berhasil dihapus");
			setIsDeleteDialogOpen(false);
		},
		onError: (error: Error) => {
			toast.error(error.message || "Gagal menghapus pengguna");
		},
	});

	const resetMutation = useMutation({
		mutationFn: resetPassword,
		onSuccess: () => {
			toast.success("Password berhasil direset");
			setIsResetPasswordOpen(false);
			setNewPassword("");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Gagal mereset password");
		},
	});

	return (
		<>
			<div className="flex items-center justify-end gap-2">
				<Button
					variant="secondary"
					size="icon"
					onClick={() => setIsEditDialogOpen(true)}
					className="h-8 w-8 text-primary-600 hover:bg-primary-100/50 hover:text-primary-700"
					title="Edit Profil"
				>
					<Edit className="h-4 w-4" />
					<span className="sr-only">Edit</span>
				</Button>
				<Button
					variant="secondary"
					size="icon"
					onClick={() => setIsResetPasswordOpen(true)}
					className="h-8 w-8 text-warning-600 hover:bg-warning-100/50 hover:text-warning-700"
					title="Reset Password"
				>
					<KeyRound className="h-4 w-4" />
					<span className="sr-only">Reset Password</span>
				</Button>
				<Button
					variant="secondary"
					size="icon"
					onClick={() => setIsDeleteDialogOpen(true)}
					className="h-8 w-8 text-danger-600 hover:bg-danger-100/50 hover:text-danger-700"
					title="Hapus Pengguna"
				>
					<Trash2 className="h-4 w-4" />
					<span className="sr-only">Hapus</span>
				</Button>
			</div>

			{/* Edit Dialog */}
			<Dialog
				isOpen={isEditDialogOpen}
				onClose={() => setIsEditDialogOpen(false)}
				title="Edit Pengguna"
			>
				<div className="py-2">
					<UserForm
						isEdit
						initialData={{
							name: user.name,
							username: user.username,
							role: user.role as UserRole,
						}}
						onSubmit={(data) =>
							updateMutation.mutate({ data: { id: user.id, ...data } })
						}
						onCancel={() => setIsEditDialogOpen(false)}
						isLoading={updateMutation.isPending}
					/>
				</div>
			</Dialog>

			{/* Reset Password Dialog */}
			<Dialog
				isOpen={isResetPasswordOpen}
				onClose={() => setIsResetPasswordOpen(false)}
				title="Reset Password"
			>
				<div className="space-y-4 py-2">
					<p className="text-sm text-surface-600">
						Masukkan password baru untuk pengguna <strong>{user.name}</strong>.
					</p>
					<div className="space-y-2">
						<label className="font-medium text-sm text-surface-700">
							Password Baru
						</label>
						<Input
							type="password"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							placeholder="••••••••"
							autoComplete="new-password"
						/>
					</div>
					<div className="flex justify-end gap-3 pt-4">
						<Button
							variant="ghost"
							onClick={() => setIsResetPasswordOpen(false)}
						>
							Batal
						</Button>
						<Button
							onClick={() =>
								resetMutation.mutate({ data: { id: user.id, newPassword } })
							}
							disabled={resetMutation.isPending || newPassword.length < 6}
						>
							{resetMutation.isPending ? "Mereset..." : "Reset Password"}
						</Button>
					</div>
				</div>
			</Dialog>

			{/* Delete Dialog */}
			<Dialog
				isOpen={isDeleteDialogOpen}
				onClose={() => setIsDeleteDialogOpen(false)}
				title="Hapus Pengguna"
			>
				<div className="space-y-4 py-2">
					<p className="text-sm text-surface-600">
						Apakah Anda yakin ingin menghapus pengguna{" "}
						<strong>{user.name}</strong>? Tindakan ini tidak dapat dibatalkan.
					</p>
					<div className="flex justify-end gap-3 pt-4">
						<Button
							variant="ghost"
							onClick={() => setIsDeleteDialogOpen(false)}
						>
							Batal
						</Button>
						<Button
							variant="destructive"
							onClick={() => deleteMutation.mutate({ data: { id: user.id } })}
							disabled={deleteMutation.isPending}
						>
							{deleteMutation.isPending ? "Menghapus..." : "Hapus Pengguna"}
						</Button>
					</div>
				</div>
			</Dialog>
		</>
	);
}
