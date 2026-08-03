import { format } from "date-fns";
import { id } from "date-fns/locale";
import { AlertCircle, MapPin, Package, Tag } from "lucide-react";
import {
	type PermintaanStatus,
	ROLE_DEPARTMENTS,
	type UserRole,
} from "../../lib/approvals";
import { PermintaanStatusBadge } from "./PermintaanStatusBadge";

interface PengadaanEventDetailProps {
	data: Record<string, unknown>;
}

export function PengadaanEventDetail({ data }: PengadaanEventDetailProps) {
	if (!data) return null;

	const requesterDept = data.requesterRole
		? ROLE_DEPARTMENTS[data.requesterRole as UserRole]
		: null;
	const olehValue = data.requesterName
		? `${data.requesterName}${requesterDept ? ` (${requesterDept})` : ""}`
		: "-";

	const prioritasColor =
		data.prioritas === "tinggi"
			? "text-danger-600"
			: data.prioritas === "sedang"
				? "text-warning-600"
				: "text-success-600";

	return (
		<div className="space-y-6">
			{/* Event Title Banner */}
			<div className="flex items-center gap-3 rounded-xl border border-primary-100 bg-primary-50/50 p-4">
				<div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary-600 shadow-sm">
					<Tag className="h-5 w-5" />
				</div>
				<div>
					<div className="mb-1 flex items-center gap-2">
						<h4 className="font-bold text-surface-500 text-xs uppercase tracking-widest">
							Nama Event
						</h4>
						<span className="rounded border border-primary-200 bg-white px-1.5 py-0.5 font-bold font-mono text-[10px] text-primary-700">
							{(data.kodePengadaan as string) || "-"}
						</span>
					</div>
					<p className="font-bold text-lg text-primary-700">{data.namaEvent as string}</p>
				</div>
			</div>

			{/* Meta info */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				<div className="space-y-1 rounded-xl border border-surface-100 bg-white p-4 shadow-sm">
					<p className="font-medium text-surface-400 text-xs uppercase tracking-wider">
						Prioritas
					</p>
					<p className={`font-semibold capitalize ${prioritasColor}`}>
						{data.prioritas as string}
					</p>
				</div>
				<div className="space-y-1 rounded-xl border border-surface-100 bg-white p-4 shadow-sm">
					<p className="font-medium text-surface-400 text-xs uppercase tracking-wider">
						Status
					</p>
					<PermintaanStatusBadge status={data.status as PermintaanStatus} />
				</div>
				<div className="space-y-1 rounded-xl border border-surface-100 bg-white p-4 shadow-sm">
					<p className="font-medium text-surface-400 text-xs uppercase tracking-wider">
						Diajukan
					</p>
					<p className="font-semibold text-sm text-surface-900 leading-snug">
						{olehValue}
					</p>
					<p className="text-surface-400 text-xs">
						{data.createdAt
							? format(new Date(data.createdAt as string), "dd MMM yyyy HH:mm", {
									locale: id,
								})
							: "-"}
					</p>
				</div>
			</div>

			{/* Deskripsi */}
			<div className="space-y-2">
				<h5 className="flex items-center gap-2 font-bold text-surface-400 text-xs uppercase tracking-widest">
					<AlertCircle className="h-3 w-3" />
					Deskripsi / Alasan Pengadaan
				</h5>
				<div className="rounded-xl border border-surface-100 bg-surface-50 p-4 text-sm text-surface-700 italic leading-relaxed">
					"{data.deskripsi as string}"
				</div>
			</div>

			{/* Items Table */}
			<div className="space-y-3">
				<h5 className="flex items-center gap-2 font-bold text-surface-400 text-xs uppercase tracking-widest">
					<Package className="h-3 w-3" />
					Daftar Barang ({(data.items as Record<string, unknown>[] ?? []).length ?? 0} item)
				</h5>

				<div className="overflow-hidden rounded-xl border border-surface-200">
					<table className="w-full text-sm">
						<thead className="border-surface-200 border-b bg-surface-50">
							<tr>
								<th className="px-4 py-3 text-left font-bold text-surface-500 text-xs uppercase tracking-wider">
									Nama Barang
								</th>
								<th className="px-4 py-3 text-left font-bold text-surface-500 text-xs uppercase tracking-wider">
									Merek
								</th>
								<th className="px-4 py-3 text-left font-bold text-surface-500 text-xs uppercase tracking-wider">
									Kategori
								</th>
								<th className="px-4 py-3 text-right font-bold text-surface-500 text-xs uppercase tracking-wider">
									Jumlah
								</th>
								{data.status === "selesai" && (
									<>
										<th className="px-4 py-3 text-left font-bold text-surface-500 text-xs uppercase tracking-wider">
											Ruangan
										</th>
										<th className="px-4 py-3 text-left font-bold text-surface-500 text-xs uppercase tracking-wider">
											Kondisi
										</th>
									</>
								)}
							</tr>
						</thead>
						<tbody className="divide-y divide-surface-100">
							{(data.items as Record<string, unknown>[] ?? []).map((item: Record<string, unknown>, i: number) => (
								<tr
									key={(item.id as string) ?? i}
									className="transition-colors hover:bg-surface-50/50"
								>
									<td className="px-4 py-3 font-medium text-surface-900">
										<div className="flex items-center gap-3">
											{(item.imageUrl as string) && (
												<div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-surface-200 bg-surface-50 shadow-sm">
													<img
														src={item.imageUrl as string}
														alt={item.namaBarang as string}
														className="h-full w-full object-cover"
													/>
												</div>
											)}
											{!item.imageUrl && (
												<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-surface-200 bg-surface-100">
													<Package className="h-4 w-4 text-surface-400" />
												</div>
											)}
											<span>{item.namaBarang as string}</span>
										</div>
									</td>
									<td className="px-4 py-3 text-surface-500">
										{(item.merek as string) || "-"}
									</td>
									<td className="px-4 py-3 text-surface-500">
										{(item.kategori as string) || "-"}
									</td>
									<td className="px-4 py-3 text-right font-semibold text-surface-900">
										{item.jumlah as number} {(item.satuan as string) || "unit"}
									</td>
									{data.status === "selesai" && (
										<>
											<td className="px-4 py-3 text-surface-700 text-xs">
												<div className="flex items-center gap-1">
													<MapPin className="h-3 w-3 text-surface-400" />
													{(item.targetRuanganId as string)
														? (item.namaRuangan as string) || (item.targetRuanganId as string)
														: "-"}
													{(item.targetLemari as string) ? ` / ${item.targetLemari}` : ""}
												</div>
											</td>
											<td className="px-4 py-3">
												<span className="font-medium text-surface-600 text-xs capitalize">
													{(item.kondisiDiterima as string)?.replace("_", " ") || "-"}
												</span>
											</td>
										</>
									)}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
