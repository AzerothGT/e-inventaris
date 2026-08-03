import { useQuery } from "@tanstack/react-query";
import type { PermintaanStatus } from "../../lib/approvals";
import { getApprovalLogs } from "../../server/functions/pengadaan";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/Table";
import { PermintaanStatusBadge } from "./PermintaanStatusBadge";

const formatDate = (date: Date) => {
	return new Intl.DateTimeFormat("id-ID", {
		day: "2-digit",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(date);
};

interface ApprovalLogTableProps {
	permintaanId: string;
}

export function ApprovalLogTable({ permintaanId }: ApprovalLogTableProps) {
	const { data: logs, isLoading } = useQuery({
		queryKey: ["approvalLogs", permintaanId],
		queryFn: () => getApprovalLogs({ data: permintaanId }),
	});

	if (isLoading) {
		return (
			<div className="p-8 text-center text-surface-500">Memuat riwayat...</div>
		);
	}

	if (!logs || logs.length === 0) {
		return (
			<div className="p-8 text-center text-surface-400">
				Belum ada riwayat aktivitas untuk permintaan ini.
			</div>
		);
	}

	return (
		<div className="overflow-hidden rounded-xl border border-surface-200/50 bg-white/50">
			<Table>
				<TableHeader className="bg-surface-50/50">
					<TableRow>
						<TableHead className="w-[180px]">Waktu</TableHead>
						<TableHead>Pengguna</TableHead>
						<TableHead>Aksi</TableHead>
						<TableHead>Status Akhir</TableHead>
						<TableHead>Catatan</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{logs.map((log) => (
						<TableRow
							key={log.id}
							className="transition-colors hover:bg-white/80"
						>
							<TableCell className="font-medium text-surface-500 text-xs">
								{formatDate(new Date(log.createdAt))}
							</TableCell>
							<TableCell>
								<div className="flex flex-col">
									<span className="font-semibold text-sm text-surface-900">
										{log.userName}
									</span>
									<span className="font-bold text-[10px] text-surface-400 uppercase tracking-wider">
										{log.userRole?.replace("_", " ")}
									</span>
								</div>
							</TableCell>
							<TableCell className="text-sm text-surface-600">
								{log.action}
							</TableCell>
							<TableCell>
								<PermintaanStatusBadge
									status={log.newStatus as PermintaanStatus}
								/>
							</TableCell>
							<TableCell className="max-w-[200px] truncate text-sm text-surface-500 italic">
								{log.catatan || "-"}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
