import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
	Activity,
	ArrowRight,
	Calendar,
	CheckCircle,
	ClipboardCheck,
	Clock,
	Package,
	PackageCheck,
	PlusCircle,
	ShieldCheck,
	ShoppingCart,
	Tag,
	User,
	XCircle,
	type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { DashboardEmptyState } from "../../components/dashboard/DashboardEmptyState";
import { DashboardSkeleton } from "../../components/dashboard/DashboardSkeleton";
import { OverviewChart } from "../../components/dashboard/OverviewChart";
import { QuickActions } from "../../components/dashboard/QuickActions";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../../components/ui/Card";
import { IconBox } from "../../components/ui/IconBox";
import { PageHeader } from "../../components/ui/PageHeader";
	import { type PermintaanStatus, STATUS_METADATA, type UserRole } from "../../lib/approvals";
import { getCurrentUser } from "../../server/functions/auth";
import {
	getApprovalQueue,
	getDashboardStats,
	getIncomingProcurements,
	getLowStockItems,
	getRecentActivity,
} from "../../server/functions/dashboard";

export const Route = createFileRoute("/_authenticated/dashboard")({
	component: Dashboard,
	pendingComponent: DashboardSkeleton,
});

function Dashboard() {
	const [greeting, setGreeting] = useState("Selamat Datang");

	const { data: user } = useSuspenseQuery({
		queryKey: ["currentUser"],
		queryFn: () => getCurrentUser(),
		staleTime: 0,
	});

	const { data: stats } = useSuspenseQuery({
		queryKey: ["dashboardStats"],
		queryFn: () => getDashboardStats(),
		staleTime: 60 * 1000,
	});

	const { data: recentActivity } = useSuspenseQuery({
		queryKey: ["recentActivity"],
		queryFn: () => getRecentActivity(),
	});

	const { data: approvalQueue } = useSuspenseQuery({
		queryKey: ["approvalQueue"],
		queryFn: () => getApprovalQueue(),
	});

	const { data: lowStockItems } = useSuspenseQuery({
		queryKey: ["lowStockItems"],
		queryFn: () => getLowStockItems(),
	});

	const { data: incomingProcurements } = useSuspenseQuery({
		queryKey: ["incomingProcurements"],
		queryFn: () => getIncomingProcurements(),
	});

	useEffect(() => {
		const hour = new Date().getHours();
		if (hour < 11) {
			setGreeting("Selamat Pagi");
			return;
		}
		if (hour < 15) {
			setGreeting("Selamat Siang");
			return;
		}
		if (hour < 18) {
			setGreeting("Selamat Sore");
			return;
		}
		setGreeting("Selamat Malam");
	}, []);

	const role = user?.role as UserRole;

	return (
		<div className="space-y-4 pb-8">
			<PageHeader
				title={`${greeting},`}
				gradientTitle={user?.name || "User"}
				suffix=" 👋"
			/>

			{/* KPI Cards (12 cols) */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<StatCard
					title="Total Barang"
					value={stats.totalBarang}
					subtitle="Inventaris tersedia"
					icon={Package}
					color="primary"
					stagger="stagger-1"
				/>
				<StatCard
					title={
						role === "penjaga_lab" ? "Permintaan Saya" : "Total Permintaan"
					}
					value={
						role === "penjaga_lab" ? stats.pendingAction : stats.activeRequests
					}
					subtitle={
						role === "penjaga_lab" ? "Sedang diproses" : "Menunggu tindakan"
					}
					icon={ShoppingCart}
					color="warning"
					stagger="stagger-2"
				/>
				<StatCard
					title={role === "penjaga_lab" ? "Selesai" : "Persetujuan Saya"}
					value={
						role === "penjaga_lab" ? stats.completedMonth : stats.pendingAction
					}
					subtitle="Perlu perhatian"
					icon={Clock}
					color="danger"
					highlight={
						!["penjaga_lab", "admin"].includes(role) && stats.pendingAction > 0
					}
					stagger="stagger-3"
				/>
				<StatCard
					title="Aktivitas Sistem"
					value={recentActivity.length}
					subtitle="Log terbaru"
					icon={CheckCircle}
					color="success"
					stagger="stagger-4"
				/>
			</div>

			{/* 12-column grid layout */}
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
				{/* Approvals (8 cols) */}
				<div className="flex flex-col lg:col-span-8">
					<Card className="glass-card stagger-5 flex h-full flex-col overflow-hidden border-surface-200 shadow-sm">
						<CardHeader className="flex flex-row items-center justify-between border-surface-100 border-b bg-surface-50/30 px-4 py-2.5">
							<div>
								<CardTitle className="font-semibold text-sm">
									Antrean Persetujuan
								</CardTitle>
								<p className="mt-1 text-surface-500 text-xs">
									Permintaan yang menunggu tindakan Anda
								</p>
							</div>
							<Link
								to="/permintaan"
								className="flex items-center gap-1 font-semibold text-primary-600 text-xs transition-colors hover:text-primary-700"
							>
								Lihat Semua <ArrowRight size={14} />
							</Link>
						</CardHeader>
						<CardContent className="flex flex-1 flex-col justify-center p-0">
							{role !== "penjaga_lab" && approvalQueue.length > 0 ? (
								<div className="divide-y divide-surface-100">
									{approvalQueue.map((item: Record<string, unknown>) => (
										<div
											key={item.id as string}
											className="group px-4 py-2.5 transition-colors hover:bg-surface-50/50"
										>
											<div className="mb-2 flex items-start justify-between gap-3">
												<div className="flex min-w-0 items-start gap-3">
													<IconBox
														icon={Tag}
														variant="surface"
														size={18}
														className="mt-0.5 shrink-0 group-hover:bg-primary-50 group-hover:text-primary-600"
													/>
													<div className="min-w-0">
														<h4 className="font-semibold text-sm text-surface-900">
															{item.namaEvent as string}
														</h4>
														<p className="wrap-break-word text-surface-500 text-xs">
															Oleh: {item.requesterName as string} • {item.itemCount as number}{}
															jenis ({item.totalJumlah as number} unit)
														</p>
													</div>
												</div>
												<div
													className={`shrink-0 rounded-full border px-2.5 py-1 font-semibold text-xs tracking-wide ${STATUS_METADATA[item.status as PermintaanStatus]?.color || ""}`}
												>
													{
														STATUS_METADATA[item.status as PermintaanStatus]
															?.label
													}
												</div>
											</div>
											<div className="flex items-center justify-between text-[11px]">
												<div className="flex items-center gap-2 text-surface-400">
													<Calendar size={12} />
													{format(new Date(item.createdAt as string | number | Date), "dd MMM yyyy", {
														locale: id,
													})}
												</div>
												<Link
													to={`/permintaan`}
													className="rounded-lg border border-surface-200 bg-white px-3 py-1 font-medium text-surface-700 text-xs shadow-sm transition-all hover:border-primary-600 hover:bg-primary-600 hover:text-white"
												>
													Tinjau
												</Link>
											</div>
										</div>
									))}
								</div>
							) : role === "penjaga_lab" ? (
								<DashboardEmptyState
									icon={PlusCircle}
									title="Belum ada antrean untuk Anda"
									description="Ajukan permintaan pengadaan agar proses persetujuan bisa dimulai."
									actionLabel="Buat Permintaan"
									actionTo="/permintaan/tambah"
								/>
							) : (
								<DashboardEmptyState
									icon={ClipboardCheck}
									title="Antrean kosong"
									description="Tidak ada permintaan yang menunggu tindakan Anda saat ini."
									actionLabel="Lihat Semua Permintaan"
									actionTo="/permintaan"
									variant="success"
								/>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Low Stock (4 cols) */}
				<div className="flex flex-col lg:col-span-4">
					<Card className="glass-card stagger-5 flex h-full flex-col overflow-hidden border-surface-200 shadow-sm">
						<CardHeader className="flex flex-row items-center justify-between border-surface-100 border-b bg-surface-50/30 px-4 py-2.5">
							<div>
								<CardTitle className="font-semibold text-sm">
									Stok Rendah
								</CardTitle>
								<p className="mt-1 text-surface-500 text-xs">
									Barang di bawah batas minimal (10 unit)
								</p>
							</div>
							<Link
								to="/barang"
								className="flex items-center gap-1 font-semibold text-primary-600 text-xs transition-colors hover:text-primary-700"
							>
								Lihat Semua <ArrowRight size={14} />
							</Link>
						</CardHeader>
						<CardContent className="flex flex-1 flex-col justify-center p-0">
							{lowStockItems.length > 0 ? (
								<div className="divide-y divide-surface-100">
									{lowStockItems.map((item: Record<string, unknown>) => (
										<div
											key={item.id as string}
											className="flex items-center justify-between px-4 py-2.5 transition-colors hover:bg-surface-50/50"
										>
											<div className="min-w-0 pr-3">
												<h4 className="truncate font-semibold text-sm text-surface-900">
													{item.nama as string}
												</h4>
												<p className="truncate text-surface-500 text-xs">
													{(item.namaRuangan as string) || "Tanpa Ruangan"}
												</p>
											</div>
											<div className="flex items-center gap-2">
												<span
													className={`shrink-0 rounded-lg border px-2.5 py-1 font-extrabold text-xs ${
														Number(item.jumlah) <= 3
															? "border-danger-200 bg-danger-50 text-danger-600"
															: "border-warning-200 bg-warning-50 text-warning-600"
													}`}
												>
													{item.jumlah as number} {item.satuan as string}
												</span>
											</div>
										</div>
									))}
								</div>
							) : (
								<DashboardEmptyState
									icon={ShieldCheck}
									title="Semua stok aman"
									description="Tidak ada barang di bawah batas minimal. Pantau inventaris secara berkala."
									actionLabel="Kelola Inventaris"
									actionTo="/barang"
									variant="success"
								/>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Inventory Chart (8 cols, hidden on mobile) */}
				<div className="hidden lg:col-span-8 lg:block">
					<OverviewChart />
				</div>

				{/* Procurement Status / Incoming (4 cols) */}
				<div className="flex flex-col lg:col-span-4">
					<Card className="glass-card stagger-6 flex h-full flex-col overflow-hidden border-surface-200 shadow-sm">
						<CardHeader className="flex flex-row items-center justify-between border-surface-100 border-b bg-surface-50/30 px-4 py-2.5">
							<div>
								<CardTitle className="font-semibold text-sm">
									Status Pengadaan
								</CardTitle>
								<p className="mt-1 text-surface-500 text-xs">
									Item masuk & proses berjalan
								</p>
							</div>
							<Link
								to="/permintaan"
								className="flex items-center gap-1 font-semibold text-primary-600 text-xs transition-colors hover:text-primary-700"
							>
								Lihat Semua <ArrowRight size={14} />
							</Link>
						</CardHeader>
						<CardContent className="flex flex-1 flex-col justify-center p-0">
							{incomingProcurements.length > 0 ? (
								<div className="divide-y divide-surface-100">
									{incomingProcurements.map((item: Record<string, unknown>) => {
										// Progress percentage based on status
										let progress = 25;
										let progressColor = "bg-warning-500";
										if (item.status === "disetujui") {
											progress = 60;
											progressColor = "bg-primary-500";
										} else if (item.status === "proses_pembelian") {
											progress = 85;
											progressColor = "bg-success-500";
										}
										return (
											<div
												key={item.id as string}
												className="space-y-1.5 px-4 py-2.5 transition-colors hover:bg-surface-50/50"
											>
												<div className="flex items-start justify-between gap-2">
													<div className="min-w-0">
														<h4 className="truncate font-semibold text-sm text-surface-900">
															{item.namaEvent as string}
														</h4>
														<p className="text-surface-500 text-xs">
															{item.itemCount as number} jenis ({item.totalJumlah as number} unit)
														</p>
													</div>
													<span
														className={`shrink-0 rounded-full border px-2 py-0.5 font-semibold text-xs ${STATUS_METADATA[item.status as PermintaanStatus]?.color || ""}`}
													>
														{
															STATUS_METADATA[item.status as PermintaanStatus]
																?.label
														}
													</span>
												</div>
												<div className="space-y-1">
													<div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-100">
														<div
															className={`h-full ${progressColor} rounded-full transition-all duration-500`}
															style={{ width: `${progress}%` }}
														/>
													</div>
													<div className="flex justify-between font-semibold text-[10px] text-surface-400">
														<span>Disetujui</span>
														<span>Proses</span>
														<span>Selesai</span>
													</div>
												</div>
											</div>
										);
									})}
								</div>
							) : (
								<DashboardEmptyState
									icon={PackageCheck}
									title="Tidak ada pengadaan aktif"
									description="Belum ada item yang masuk tahap pembelian. Cek antrean permintaan untuk memulai."
									actionLabel="Buka Permintaan"
									actionTo="/permintaan"
									variant="surface"
								/>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Recent Activity (12 cols) */}
				<div className="lg:col-span-12">
					<Card className="glass-card stagger-7 overflow-hidden border-surface-200 shadow-sm">
						<CardHeader className="flex flex-row items-center justify-between border-surface-100 border-b bg-surface-50/30 px-4 py-2.5">
							<div>
								<CardTitle className="font-semibold text-sm">
									Aktivitas Terbaru
								</CardTitle>
								<p className="mt-1 text-surface-500 text-xs">
									Log perubahan status & pengadaan terbaru
								</p>
							</div>
							<IconBox icon={Activity} variant="primary" size={18} />
						</CardHeader>
						<CardContent className="p-0">
							<div className="divide-y divide-surface-100">
								{recentActivity.slice(0, 5).map((activity: Record<string, unknown>) => {
									let ActivityIcon = User;
									let iconVariant:
										| "surface"
										| "success"
										| "danger"
										| "primary"
										| "warning" = "surface";

									const actionLower = (activity.action as string).toLowerCase();
									const newStatusLower = (
										(activity.newStatus as string) || ""
									).toLowerCase();

									if (
										actionLower.includes("selesai") ||
										newStatusLower === "selesai"
									) {
										ActivityIcon = CheckCircle;
										iconVariant = "success";
									} else if (newStatusLower === "ditolak") {
										ActivityIcon = XCircle;
										iconVariant = "danger";
									} else if (
										actionLower.includes("mengajukan") ||
										actionLower.includes("buat")
									) {
										ActivityIcon = PlusCircle;
										iconVariant = "primary";
									} else if (
										newStatusLower === "proses_pembelian" ||
										actionLower.includes("pembelian")
									) {
										ActivityIcon = Package;
										iconVariant = "warning";
									} else if (
										actionLower.includes("tinjau") ||
										actionLower.includes("update")
									) {
										ActivityIcon = Clock;
										iconVariant = "primary";
									}

									return (
										<div
											key={activity.id as string}
											className="flex items-center justify-between px-4 py-2.5 transition-colors hover:bg-surface-50/50"
										>
											<div className="flex min-w-0 items-center gap-3">
												<IconBox
													icon={ActivityIcon}
													variant={iconVariant}
													size={14}
													className="h-8 w-8 shrink-0 rounded-full"
												/>
												<div className="min-w-0">
													<p className="truncate text-surface-900 text-xs leading-relaxed">
														<span className="font-bold text-surface-950">
															{activity.userName as string}
														</span>{" "}
														{(activity.action as string).toLowerCase()}
														<span className="ml-1 font-semibold text-primary-600 italic">
															"{(activity.namaEvent as string) || "Permintaan"}"
														</span>
													</p>
													<div className="flex items-center gap-2 font-medium text-[10px] text-surface-400">
														<span>
															{format(
																new Date(activity.createdAt as string | number | Date),
																"dd MMM yyyy, HH:mm",
																{ locale: id },
															)}
														</span>
														<span className="h-1 w-1 rounded-full bg-surface-300" />
														<span className="font-bold text-[10px] text-surface-500 uppercase tracking-wider">
															{(activity.newStatus as string).replace("_", " ")}
														</span>
													</div>
												</div>
											</div>
											<Link
												to="/permintaan"
												className="shrink-0 pl-2 font-semibold text-primary-600 text-xs hover:underline"
											>
												Detail
											</Link>
										</div>
									);
								})}
								{recentActivity.length === 0 && (
									<DashboardEmptyState
										icon={Activity}
										title="Belum ada aktivitas"
										description="Log status akan muncul di sini setelah ada pengajuan atau persetujuan."
										actionLabel="Buat Permintaan"
										actionTo="/permintaan/tambah"
									/>
								)}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Quick Actions (at the bottom) */}
			<QuickActions role={role} />
		</div>
	);
}

function StatCard({
	title,
	value,
	subtitle,
	icon,
	color,
	highlight,
	stagger,
}: {
	title: React.ReactNode;
	value: React.ReactNode;
	subtitle: React.ReactNode;
	icon: LucideIcon;
	color?: "primary" | "success" | "warning" | "danger" | "surface";
	highlight?: boolean;
	stagger?: string;
}) {
	return (
		<Card className={`glass-card glass-card-hover lift-card ${stagger}`}>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 pt-3.5 pb-1.5">
				<CardTitle className="font-bold text-surface-500 text-xs uppercase tracking-wider">
					{title}
				</CardTitle>
				<IconBox
					icon={icon}
					variant={color}
					size={14}
					className="h-7 w-7 shadow-sm"
				/>
			</CardHeader>
			<CardContent className="px-4 pt-0 pb-3.5">
				<div
					className={`font-black text-2xl ${highlight ? "animate-pulse text-danger-600" : "text-surface-900"}`}
				>
					{value}
				</div>
				<p className="font-medium text-surface-400 text-xs">{subtitle}</p>
			</CardContent>
		</Card>
	);
}
