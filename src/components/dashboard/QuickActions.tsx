import { Link } from "@tanstack/react-router";
import {
	BarChart3,
	CheckSquare,
	List,
	type LucideIcon,
	Package,
	PlusCircle,
} from "lucide-react";
import type { UserRole } from "../../lib/approvals";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { IconBox } from "../ui/IconBox";

interface QuickAction {
	title: string;
	description: string;
	icon: LucideIcon;
	href: string;
	roles: UserRole[] | "all";
	variant: "primary" | "success" | "warning" | "danger" | "surface";
}

const QUICK_ACTIONS: QuickAction[] = [
	{
		title: "Buat Permintaan",
		description: "Ajukan permintaan pengadaan barang baru",
		icon: PlusCircle,
		href: "/permintaan", // Normally this would open a modal, but for now we link to the page
		roles: ["penjaga_lab", "orang_tu", "admin"],
		variant: "primary",
	},
	{
		title: "Tinjau Persetujuan",
		description: "Periksa item yang menunggu persetujuan Anda",
		icon: CheckSquare,
		href: "/permintaan",
		roles: ["kaprog", "wakasek", "kepala_sekolah", "admin"],
		variant: "warning",
	},
	{
		title: "Proses Pembelian",
		description: "Kelola item yang siap dibeli",
		icon: Package,
		href: "/permintaan",
		roles: ["tu_admin", "admin"],
		variant: "success",
	},
	{
		title: "Daftar Barang",
		description: "Lihat dan kelola inventaris sekolah",
		icon: List,
		href: "/barang",
		roles: "all",
		variant: "surface",
	},
	{
		title: "Laporan Sistem",
		description: "Lihat statistik dan laporan pengadaan",
		icon: BarChart3,
		href: "/dashboard",
		roles: ["admin", "kepala_sekolah"],
		variant: "primary",
	},
];

export function QuickActions({ role }: { role: UserRole }) {
	const filteredActions = QUICK_ACTIONS.filter(
		(action) => action.roles === "all" || action.roles.includes(role),
	);

	return (
		<Card className="glass-card stagger-7 border-surface-200 shadow-sm">
			<CardHeader>
				<CardTitle className="text-lg">Tautan Cepat</CardTitle>
			</CardHeader>
			<CardContent className="grid gap-3 sm:grid-cols-2">
				{filteredActions.map((action, i) => (
					<Link
						key={i}
						to={action.href}
						className="group flex items-center gap-3 rounded-xl border border-primary-100/50 bg-primary-50/50 p-3 transition-all duration-200 hover:bg-primary-50"
					>
						<IconBox
							icon={action.icon}
							variant={action.variant}
							size={20}
							className="shadow-sm group-hover:scale-110"
						/>
						<div className="text-left">
							<p className="mb-1 font-bold text-sm text-surface-900 leading-none">
								{action.title}
							</p>
							<p className="text-[10px] text-surface-500 leading-tight">
								{action.description}
							</p>
						</div>
					</Link>
				))}
			</CardContent>
		</Card>
	);
}
