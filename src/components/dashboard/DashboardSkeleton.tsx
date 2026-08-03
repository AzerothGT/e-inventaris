import { Card, CardContent, CardHeader } from "../ui/Card";
import { PageHeader } from "../ui/PageHeader";
import { Skeleton } from "../ui/Skeleton";

export function DashboardSkeleton() {
	return (
		<div className="space-y-4 pb-8">
			<PageHeader title="Selamat..." gradientTitle="......" suffix=" 👋" />
			<p className="-mt-2 animate-pulse px-0.5 font-medium text-surface-500 text-xs">
				Memuat ringkasan inventaris, antrean, dan aktivitas…
			</p>

			{/* KPI Cards */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{[1, 2, 3, 4].map((i) => (
					<Card key={i} className="glass-card glass-card-hover lift-card">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 pt-3.5 pb-1.5">
							<Skeleton className="h-3 w-24" />
							<Skeleton className="h-7 w-7 rounded-lg" />
						</CardHeader>
						<CardContent className="px-4 pt-0 pb-3.5">
							<Skeleton className="mb-1.5 h-8 w-14" />
							<Skeleton className="h-3 w-28" />
						</CardContent>
					</Card>
				))}
			</div>

			{/* 12-column grid */}
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
				{/* Approvals (8 cols) */}
				<div className="flex flex-col lg:col-span-8">
					<Card className="glass-card flex h-full flex-col overflow-hidden border-surface-200 shadow-sm">
						<CardHeader className="flex flex-row items-center justify-between border-surface-100 border-b bg-surface-50/30 px-4 py-2.5">
							<div>
								<Skeleton className="mb-1.5 h-4 w-36" />
								<Skeleton className="h-3 w-52" />
							</div>
							<Skeleton className="h-3 w-16" />
						</CardHeader>
						<CardContent className="flex-1 p-0">
							<div className="divide-y divide-surface-100">
								{[1, 2, 3].map((i) => (
									<div key={i} className="px-4 py-2.5">
										<div className="mb-2 flex items-center justify-between">
											<div className="flex items-center gap-3">
												<Skeleton className="h-8 w-8 rounded-lg" />
												<div>
													<Skeleton className="mb-1 h-3.5 w-32" />
													<Skeleton className="h-3 w-48" />
												</div>
											</div>
											<Skeleton className="h-5 w-20 rounded-full" />
										</div>
										<div className="flex items-center justify-between">
											<Skeleton className="h-3 w-24" />
											<Skeleton className="h-6 w-16 rounded-lg" />
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Low Stock (4 cols) */}
				<div className="flex flex-col lg:col-span-4">
					<Card className="glass-card flex h-full flex-col overflow-hidden border-surface-200 shadow-sm">
						<CardHeader className="flex flex-row items-center justify-between border-surface-100 border-b bg-surface-50/30 px-4 py-2.5">
							<div>
								<Skeleton className="mb-1.5 h-4 w-24" />
								<Skeleton className="h-3 w-40" />
							</div>
							<Skeleton className="h-3 w-16" />
						</CardHeader>
						<CardContent className="flex-1 p-0">
							<div className="divide-y divide-surface-100">
								{[1, 2, 3].map((i) => (
									<div
										key={i}
										className="flex items-center justify-between px-4 py-2.5"
									>
										<div className="pr-3">
											<Skeleton className="mb-1 h-3.5 w-28" />
											<Skeleton className="h-3 w-20" />
										</div>
										<Skeleton className="h-6 w-14 rounded-lg" />
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Inventory Chart (8 cols, hidden on mobile) */}
				<div className="hidden lg:col-span-8 lg:block">
					<Card className="glass-card border-surface-200 shadow-sm">
						<CardHeader className="border-surface-100 border-b bg-surface-50/30 px-4 py-2.5">
							<Skeleton className="h-4 w-32" />
						</CardHeader>
						<CardContent className="flex h-[200px] items-end justify-between gap-2 p-4">
							{[40, 65, 30, 80, 55, 70, 45].map((h, i) => (
								<div
									key={i}
									className="flex flex-1 flex-col items-center gap-2"
								>
									<Skeleton
										className="w-full rounded-t-lg"
										style={{ height: `${h}%` }}
									/>
									<Skeleton className="h-2.5 w-8" />
								</div>
							))}
						</CardContent>
					</Card>
				</div>

				{/* Procurement Status (4 cols) */}
				<div className="flex flex-col lg:col-span-4">
					<Card className="glass-card flex h-full flex-col overflow-hidden border-surface-200 shadow-sm">
						<CardHeader className="flex flex-row items-center justify-between border-surface-100 border-b bg-surface-50/30 px-4 py-2.5">
							<div>
								<Skeleton className="mb-1.5 h-4 w-32" />
								<Skeleton className="h-3 w-44" />
							</div>
							<Skeleton className="h-3 w-16" />
						</CardHeader>
						<CardContent className="flex-1 p-0">
							<div className="divide-y divide-surface-100">
								{[1, 2].map((i) => (
									<div key={i} className="space-y-1.5 px-4 py-2.5">
										<div className="flex items-start justify-between gap-2">
											<div>
												<Skeleton className="mb-1 h-3.5 w-32" />
												<Skeleton className="h-3 w-20" />
											</div>
											<Skeleton className="h-5 w-16 rounded-full" />
										</div>
										<Skeleton className="h-1.5 w-full rounded-full" />
										<div className="flex justify-between">
											<Skeleton className="h-2.5 w-14" />
											<Skeleton className="h-2.5 w-10" />
											<Skeleton className="h-2.5 w-12" />
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Recent Activity (12 cols) */}
				<div className="lg:col-span-12">
					<Card className="glass-card overflow-hidden border-surface-200 shadow-sm">
						<CardHeader className="flex flex-row items-center justify-between border-surface-100 border-b bg-surface-50/30 px-4 py-2.5">
							<div>
								<Skeleton className="mb-1.5 h-4 w-32" />
								<Skeleton className="h-3 w-56" />
							</div>
							<Skeleton className="h-8 w-8 rounded-lg" />
						</CardHeader>
						<CardContent className="p-0">
							<div className="divide-y divide-surface-100">
								{[1, 2, 3, 4, 5].map((i) => (
									<div
										key={i}
										className="flex items-center justify-between px-4 py-2.5"
									>
										<div className="flex min-w-0 items-center gap-3">
											<Skeleton className="h-8 w-8 shrink-0 rounded-full" />
											<div className="min-w-0">
												<Skeleton className="mb-1.5 h-3.5 w-64" />
												<div className="flex gap-2">
													<Skeleton className="h-2.5 w-28" />
													<Skeleton className="h-2.5 w-2.5 rounded-full" />
													<Skeleton className="h-2.5 w-16" />
												</div>
											</div>
										</div>
										<Skeleton className="ml-2 h-3.5 w-10" />
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
