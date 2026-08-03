import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Shield, UserPlus, Users } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { DataTable } from "../../components/ui/DataTable";
import { Dialog } from "../../components/ui/Dialog";
import { IconBox } from "../../components/ui/IconBox";
import { PageHeader } from "../../components/ui/PageHeader";
import { TablePageSkeleton } from "../../components/ui/TablePageSkeleton";
import { UserForm } from "../../components/users/UserForm";
import { UserTableActions } from "../../components/users/UserTableActions";
import { ROLE_DEPARTMENTS, type UserRole } from "../../lib/approvals";
import { createUser, getUsers } from "../../server/functions/users";

export const Route = createFileRoute("/_authenticated/users")({
	component: UserManagementPage,
	pendingComponent: () => (
		<TablePageSkeleton title="Manajemen" gradientTitle="Pengguna" />
	),
});

function UserManagementPage() {
	const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
	const queryClient = useQueryClient();

	const { data: users } = useSuspenseQuery({
		queryKey: ["users"],
		queryFn: () => getUsers(),
	});

	const createMutation = useMutation({
		mutationFn: createUser,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
			toast.success("Pengguna baru berhasil ditambahkan");
			setIsAddDialogOpen(false);
		},
		onError: (error: Error) => {
			toast.error(error.message || "Gagal menambahkan pengguna");
		},
	});

	const columns = [
		{
			accessorKey: "name",
			header: "Nama",
			cell: ({ row }: { row: { original: Record<string, unknown> } }) => (
				<div className="flex items-center gap-3">
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 font-bold text-primary-700 text-xs">
						{(row.original.name as string).charAt(0).toUpperCase()}
					</div>
					<div className="font-medium text-surface-900">
						{row.original.name as string}
					</div>
				</div>
			),
		},
		{
			accessorKey: "username",
			header: "Username",
			cell: ({ row }: { row: { original: Record<string, unknown> } }) => (
				<span className="font-mono text-surface-500 text-xs">
					{row.original.username as string}
				</span>
			),
		},
		{
			accessorKey: "role",
			header: "Role / Jabatan",
			cell: ({ row }: { row: { original: Record<string, unknown> } }) => {
				const role = row.original.role as UserRole;
				const isSystemAdmin = role === "admin" || role === "tu_admin";
				return (
					<div className="flex items-center gap-2">
						<Badge variant={isSystemAdmin ? "default" : "secondary"}>
							{ROLE_DEPARTMENTS[role] || role}
						</Badge>
						{isSystemAdmin && <Shield size={14} className="text-primary-500" />}
					</div>
				);
			},
		},
		{
			accessorKey: "createdAt",
			header: "Terdaftar Pada",
			cell: ({ row }: { row: { original: Record<string, unknown> } }) => (
				<span className="text-surface-500 text-xs">
					{new Date(row.original.createdAt as string).toLocaleDateString("id-ID", {
						day: "numeric",
						month: "short",
						year: "numeric",
					})}
				</span>
			),
		},
		{
			id: "actions",
			cell: ({ row }: { row: { original: Record<string, unknown> } }) => <UserTableActions user={row.original as { id: string; username: string; name: string; role: string }} />,
		},
	];

	return (
		<div className="space-y-6">
			<PageHeader
				title="Manajemen"
				gradientTitle="Pengguna"
				actions={
					<Button
						onClick={() => setIsAddDialogOpen(true)}
						className="flex items-center gap-2"
					>
						<UserPlus size={18} />
						<span>Tambah Pengguna</span>
					</Button>
				}
			/>

			<div className="stagger-2 rounded-xl border border-surface-200/50 bg-white/50 p-6 shadow-sm backdrop-blur-sm">
				<div className="mb-4 flex items-center gap-2">
					<IconBox icon={Users} variant="primary" size={20} />
					<h3 className="font-semibold text-lg text-surface-900">
						Daftar Pengguna
					</h3>
				</div>
				<DataTable
					columns={columns}
					data={users || []}
					searchPlaceholder="Cari pengguna..."
					searchColumn="name"
				/>
			</div>

			<Dialog
				isOpen={isAddDialogOpen}
				onClose={() => setIsAddDialogOpen(false)}
				title="Tambah Pengguna Baru"
			>
				<div className="py-2">
					<p className="mb-4 text-sm text-surface-600">
						Buat akun baru untuk staf atau administrator sistem.
					</p>
					<UserForm
						onSubmit={(data) => createMutation.mutate({ data: data as { username: string; password: string; name: string; role: UserRole } })}
						onCancel={() => setIsAddDialogOpen(false)}
						isLoading={createMutation.isPending}
					/>
				</div>
			</Dialog>
		</div>
	);
}
