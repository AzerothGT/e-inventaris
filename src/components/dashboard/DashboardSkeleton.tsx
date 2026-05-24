import { Card, CardContent, CardHeader } from "../ui/Card"
import { Skeleton } from "../ui/Skeleton"
import { PageHeader } from "../ui/PageHeader"

export function DashboardSkeleton() {
  return (
    <div className="space-y-4 pb-8">
      <PageHeader
        title="Selamat..."
        gradientTitle="......"
        suffix=" 👋"
      />

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="glass-card glass-card-hover lift-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 pt-3.5 px-4">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-7 rounded-lg" />
            </CardHeader>
            <CardContent className="pb-3.5 px-4 pt-0">
              <Skeleton className="h-8 w-14 mb-1.5" />
              <Skeleton className="h-3 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 12-column grid */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-12">

        {/* Approvals (8 cols) */}
        <div className="lg:col-span-8 flex flex-col">
          <Card className="glass-card shadow-sm border-surface-200 overflow-hidden flex flex-col h-full">
            <CardHeader className="flex flex-row items-center justify-between border-b border-surface-100 bg-surface-50/30 py-2.5 px-4">
              <div>
                <Skeleton className="h-4 w-36 mb-1.5" />
                <Skeleton className="h-3 w-52" />
              </div>
              <Skeleton className="h-3 w-16" />
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <div className="divide-y divide-surface-100">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="py-2.5 px-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-8 h-8 rounded-lg" />
                        <div>
                          <Skeleton className="h-3.5 w-32 mb-1" />
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
        <div className="lg:col-span-4 flex flex-col">
          <Card className="glass-card shadow-sm border-surface-200 overflow-hidden flex flex-col h-full">
            <CardHeader className="flex flex-row items-center justify-between border-b border-surface-100 bg-surface-50/30 py-2.5 px-4">
              <div>
                <Skeleton className="h-4 w-24 mb-1.5" />
                <Skeleton className="h-3 w-40" />
              </div>
              <Skeleton className="h-3 w-16" />
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <div className="divide-y divide-surface-100">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="py-2.5 px-4 flex items-center justify-between">
                    <div className="pr-3">
                      <Skeleton className="h-3.5 w-28 mb-1" />
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
        <div className="lg:col-span-8 hidden lg:block">
          <Card className="glass-card shadow-sm border-surface-200">
            <CardHeader className="py-2.5 px-4 border-b border-surface-100 bg-surface-50/30">
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent className="h-[200px] flex items-end justify-between gap-2 p-4">
              {[40, 65, 30, 80, 55, 70, 45].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <Skeleton className="w-full rounded-t-lg" style={{ height: `${h}%` }} />
                  <Skeleton className="h-2.5 w-8" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Procurement Status (4 cols) */}
        <div className="lg:col-span-4 flex flex-col">
          <Card className="glass-card shadow-sm border-surface-200 overflow-hidden flex flex-col h-full">
            <CardHeader className="flex flex-row items-center justify-between border-b border-surface-100 bg-surface-50/30 py-2.5 px-4">
              <div>
                <Skeleton className="h-4 w-32 mb-1.5" />
                <Skeleton className="h-3 w-44" />
              </div>
              <Skeleton className="h-3 w-16" />
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <div className="divide-y divide-surface-100">
                {[1, 2].map((i) => (
                  <div key={i} className="py-2.5 px-4 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Skeleton className="h-3.5 w-32 mb-1" />
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
          <Card className="glass-card shadow-sm border-surface-200 overflow-hidden">
            <CardHeader className="border-b border-surface-100 py-2.5 px-4 flex flex-row items-center justify-between bg-surface-50/30">
              <div>
                <Skeleton className="h-4 w-32 mb-1.5" />
                <Skeleton className="h-3 w-56" />
              </div>
              <Skeleton className="w-8 h-8 rounded-lg" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-surface-100">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="py-2.5 px-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                      <div className="min-w-0">
                        <Skeleton className="h-3.5 w-64 mb-1.5" />
                        <div className="flex gap-2">
                          <Skeleton className="h-2.5 w-28" />
                          <Skeleton className="h-2.5 w-2.5 rounded-full" />
                          <Skeleton className="h-2.5 w-16" />
                        </div>
                      </div>
                    </div>
                    <Skeleton className="h-3.5 w-10 ml-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
