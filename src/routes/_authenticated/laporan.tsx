import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getDashboardStats } from "../../server/functions/dashboard";
import { getBarangList } from "../../server/functions/barang";
import { getPermintaanList } from "../../server/functions/permintaan";
import { getCurrentUser } from "../../server/functions/auth";
import { PageHeader } from "../../components/ui/PageHeader";
import { ExportButton } from "../../components/ui/ExportButton";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import {
	BarChart3,
	Package,
	ShoppingCart,
	FileSpreadsheet,
	FileText,
	ClipboardList,
	Archive
} from "lucide-react";
import { DashboardSkeleton } from "../../components/dashboard/DashboardSkeleton";

export const Route = createFileRoute("/_authenticated/laporan")({
	component: LaporanPage,
	pendingComponent: DashboardSkeleton,
});

function LaporanPage() {
	useSuspenseQuery({
		queryKey: ["session"],
		queryFn: () => getCurrentUser(),
	});

	const { data: stats } = useSuspenseQuery({
		queryKey: ["dashboardStats"],
		queryFn: () => getDashboardStats(),
	});

	const { data: barangList } = useSuspenseQuery({
		queryKey: ["barang"],
		queryFn: () => getBarangList(),
	});

	const { data: permintaanList } = useSuspenseQuery({
		queryKey: ["permintaan"],
		queryFn: () => getPermintaanList(),
	});

	const barangExportColumns = [
		{ key: "kodeBarang", label: "Kode Barang" },
		{ key: "nama", label: "Nama Barang" },
		{ key: "kategori", label: "Kategori" },
		{ key: "merek", label: "Merek" },
		{ key: "noSeri", label: "No Seri" },
		{ key: "tahunPengadaan", label: "Tahun" },
		{ key: "jumlah", label: "Jumlah" },
		{ key: "status", label: "Kondisi", formatter: (v: string) => v.replace("_", " ").toUpperCase() },
		{ key: "namaRuangan", label: "Ruangan" },
	];

	const permintaanExportColumns = [
		{ key: "namaBarang", label: "Nama Barang" },
		{ key: "kategori", label: "Kategori" },
		{ key: "jumlah", label: "Jumlah" },
		{ key: "prioritas", label: "Prioritas" },
		{ key: "status", label: "Status", formatter: (v: string) => v.replace("_", " ").toUpperCase() },
		{ key: "deskripsi", label: "Deskripsi" },
		{
			key: "createdAt",
			label: "Tanggal Pengajuan",
			formatter: (v: string) => new Date(v).toLocaleDateString("id-ID")
		},
	];

	return (
		<div className="space-y-8 pb-12">
			<PageHeader
				title="Laporan"
				gradientTitle="Sistem"
				suffix=" 📊"
			/>

			{/* Stats Overview */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				<StatCard
					title="Total Barang"
					value={stats.totalBarang}
					subtitle="Item terdaftar"
					icon={<Package className="h-5 w-5" />}
					color="primary"
					stagger="stagger-1"
				/>
				<StatCard
					title="Permintaan Aktif"
					value={stats.activeRequests}
					subtitle="Dalam proses"
					icon={<ShoppingCart className="h-5 w-5" />}
					color="warning"
					stagger="stagger-2"
				/>
				<StatCard
					title="Persetujuan"
					value={stats.pendingAction}
					subtitle="Perlu tindakan"
					icon={<BarChart3 className="h-5 w-5" />}
					color="danger"
					stagger="stagger-3"
				/>
				<StatCard
					title="Tuntas"
					value={stats.completedMonth}
					subtitle="Bulan ini"
					icon={<Archive className="h-5 w-5" />}
					color="success"
					stagger="stagger-4"
				/>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				{/* Inventory Report Section */}
				<Card className="glass-card shadow-sm border-surface-200 stagger-5 overflow-hidden">
					<CardHeader className="border-b border-surface-100 bg-surface-50/30">
						<div className="flex items-center gap-3">
							<div className="p-2 rounded-lg bg-primary-100 text-primary-600">
								<Archive size={20} />
							</div>
							<div>
								<CardTitle className="text-lg">Laporan Inventaris</CardTitle>
								<p className="text-xs text-surface-500 mt-1">Ekspor seluruh data barang yang tersedia</p>
							</div>
						</div>
					</CardHeader>
					<CardContent className="p-6 space-y-6">
						<div className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-surface-100">
							<div className="flex items-center gap-3">
								<FileSpreadsheet className="h-8 w-8 text-success-600" />
								<div>
									<p className="text-sm font-bold text-surface-900">Format Spreadsheet</p>
									<p className="text-[11px] text-surface-500">CSV untuk pengolahan data lanjutan</p>
								</div>
							</div>
							<ExportButton
								data={barangList}
								columns={barangExportColumns}
								filename={`laporan-inventaris-${new Date().toISOString().split('T')[0]}`}
								title="Laporan Inventaris Barang"
								subtitle={`Diekspor pada: ${new Date().toLocaleString('id-ID')}`}
							/>
						</div>
						<div className="p-4 bg-primary-50/30 rounded-xl border border-primary-100/50">
							<h4 className="text-xs font-bold text-primary-700 uppercase tracking-wider mb-2">Informasi Ekspor</h4>
							<ul className="text-xs text-surface-600 space-y-1.5 list-disc list-inside">
								<li>Total record: <span className="font-bold">{barangList.length}</span> barang</li>
								<li>Data mencakup: Kode, Nama, Kategori, Kondisi, dan Ruangan</li>
								<li>Format PDF menyertakan header resmi sekolah</li>
							</ul>
						</div>
					</CardContent>
				</Card>

				{/* Procurement Report Section */}
				<Card className="glass-card shadow-sm border-surface-200 stagger-6 overflow-hidden">
					<CardHeader className="border-b border-surface-100 bg-surface-50/30">
						<div className="flex items-center gap-3">
							<div className="p-2 rounded-lg bg-warning-100 text-warning-600">
								<ClipboardList size={20} />
							</div>
							<div>
								<CardTitle className="text-lg">Laporan Pengadaan</CardTitle>
								<p className="text-xs text-surface-500 mt-1">Ekspor riwayat permintaan barang</p>
							</div>
						</div>
					</CardHeader>
					<CardContent className="p-6 space-y-6">
						<div className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-surface-100">
							<div className="flex items-center gap-3">
								<FileText className="h-8 w-8 text-danger-600" />
								<div>
									<p className="text-sm font-bold text-surface-900">Dokumen Digital</p>
									<p className="text-[11px] text-surface-500">PDF untuk arsip dan bukti fisik</p>
								</div>
							</div>
							<ExportButton
								data={permintaanList}
								columns={permintaanExportColumns}
								filename={`laporan-pengadaan-${new Date().toISOString().split('T')[0]}`}
								title="Laporan Pengadaan Barang"
								subtitle={`Diekspor pada: ${new Date().toLocaleString('id-ID')}`}
							/>
						</div>
						<div className="p-4 bg-warning-50/30 rounded-xl border border-warning-100/50">
							<h4 className="text-xs font-bold text-warning-700 uppercase tracking-wider mb-2">Informasi Ekspor</h4>
							<ul className="text-xs text-surface-600 space-y-1.5 list-disc list-inside">
								<li>Total record: <span className="font-bold">{permintaanList.length}</span> permintaan</li>
								<li>Data mencakup: Item, Prioritas, Status, dan Tanggal</li>
								<li>Gunakan ini untuk audit tahunan pengadaan</li>
							</ul>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

function StatCard({ title, value, subtitle, icon, color, stagger }: any) {
	const colorMap = {
		primary: 'bg-primary-100 text-primary-600',
		warning: 'bg-warning-100 text-warning-600',
		danger: 'bg-danger-100 text-danger-600',
		success: 'bg-success-100 text-success-600',
	}

	return (
		<Card className={`glass-card glass-card-hover lift-card ${stagger}`}>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-xs font-bold text-surface-50 uppercase tracking-widest">{title}</CardTitle>
				<div className={`w-10 h-10 rounded-xl ${colorMap[color as keyof typeof colorMap]} flex items-center justify-center shadow-sm`}>
					{icon}
				</div>
			</CardHeader>
			<CardContent>
				<div className="text-4xl font-black text-surface-900">
					{value}
				</div>
				<p className="text-[11px] text-surface-500 mt-1 font-medium font-mono">{subtitle}</p>
			</CardContent>
		</Card>
	)
}
