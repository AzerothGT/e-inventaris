import { useSuspenseQuery } from "@tanstack/react-query";
import { TrendingUp } from "lucide-react";
import { getTrendData } from "../../server/functions/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { IconBox } from "../ui/IconBox";

export function OverviewChart() {
	const { data: trend } = useSuspenseQuery({
		queryKey: ["trendData"],
		queryFn: () => getTrendData(),
	});

	const maxVal = Math.max(
		...trend.map((d) => Math.max(d.totalSubmitted, d.totalSelesai)),
		1,
	);
	const yTicks = [maxVal, Math.round(maxVal / 2), 0];

	const totalSubmitted = trend.reduce((s, d) => s + d.totalSubmitted, 0);
	const totalSelesai = trend.reduce((s, d) => s + d.totalSelesai, 0);

	return (
		<Card className="glass-card stagger-5 flex h-full flex-col border-surface-200 shadow-sm">
			<CardHeader className="flex flex-row items-center justify-between border-surface-100 border-b bg-surface-50/30 px-4 py-2.5">
				<div>
					<CardTitle className="font-semibold text-sm">
						Ringkasan Tren
					</CardTitle>
					<p className="mt-1 text-surface-500 text-xs">
						Aktivitas pengajuan 7 bulan terakhir
					</p>
				</div>
				<IconBox icon={TrendingUp} variant="primary" size={18} />
			</CardHeader>
			<CardContent className="flex flex-1 flex-col gap-4 p-4">
				{/* Legend + contextual totals */}
				<div className="flex items-center gap-4 font-medium text-surface-600 text-xs">
					<span className="flex items-center gap-1.5">
						<span className="inline-block h-3 w-3 rounded-sm bg-primary-500" />
						Diajukan ({totalSubmitted})
					</span>
					<span className="flex items-center gap-1.5">
						<span className="inline-block h-3 w-3 rounded-sm bg-success-500" />
						Selesai ({totalSelesai})
					</span>
				</div>

				{/* Chart with Y-axis */}
				<div className="flex flex-1 gap-2" style={{ minHeight: 140 }}>
					<div
						className="flex shrink-0 flex-col items-end justify-between py-0 pr-1"
						style={{ height: 140 }}
					>
						{yTicks.map((tick) => (
							<span
								key={tick}
								className="font-semibold text-[10px] text-surface-400 tabular-nums leading-none"
							>
								{tick}
							</span>
						))}
					</div>

					<div className="relative flex-1">
						{/* Grid lines */}
						<div
							className="pointer-events-none absolute inset-0 flex flex-col justify-between"
							style={{ height: 140 }}
						>
							{yTicks.map((tick) => (
								<div
									key={tick}
									className="w-full border-surface-100 border-t border-dashed"
								/>
							))}
						</div>

						<div
							className="relative flex items-end justify-between gap-2"
							style={{ height: 140 }}
						>
							{trend.map((day, i) => (
								<div
									key={i}
									className="group flex flex-1 flex-col items-center gap-1"
								>
									<div
										className="flex w-full items-end justify-center gap-0.5"
										style={{ height: 140 }}
									>
										<div
											className="relative flex-1 rounded-t-md bg-primary-500/25 transition-all duration-300 group-hover:bg-primary-500/50"
											style={{
												height: `${(day.totalSubmitted / maxVal) * 100}%`,
												minHeight: day.totalSubmitted > 0 ? 4 : 0,
											}}
											title={`${day.label}: ${day.totalSubmitted} diajukan`}
										>
											{day.totalSubmitted > 0 && (
												<span className="-top-5 -translate-x-1/2 absolute left-1/2 whitespace-nowrap font-bold text-[9px] text-primary-600 opacity-0 transition-opacity group-hover:opacity-100">
													{day.totalSubmitted}
												</span>
											)}
										</div>
										<div
											className="relative flex-1 rounded-t-md bg-success-500/25 transition-all duration-300 group-hover:bg-success-500/50"
											style={{
												height: `${(day.totalSelesai / maxVal) * 100}%`,
												minHeight: day.totalSelesai > 0 ? 4 : 0,
											}}
											title={`${day.label}: ${day.totalSelesai} selesai`}
										>
											{day.totalSelesai > 0 && (
												<span className="-top-5 -translate-x-1/2 absolute left-1/2 whitespace-nowrap font-bold text-[9px] text-success-600 opacity-0 transition-opacity group-hover:opacity-100">
													{day.totalSelesai}
												</span>
											)}
										</div>
									</div>
								</div>
							))}
						</div>

						<div className="mt-1 flex justify-between gap-2">
							{trend.map((day, i) => (
								<span
									key={i}
									className="flex-1 text-center font-medium text-[10px] text-surface-400 capitalize"
								>
									{day.label}
								</span>
							))}
						</div>
					</div>
				</div>

				{totalSubmitted === 0 && totalSelesai === 0 && (
					<p className="-mt-1 text-center text-surface-400 text-xs">
						Belum ada aktivitas dalam 7 bulan terakhir
					</p>
				)}
			</CardContent>
		</Card>
	);
}
