import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"
import { Skeleton } from "../ui/Skeleton"
import { PageHeader } from "../ui/PageHeader"

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Selamat..."
        gradientTitle="......"
        suffix=" 👋"
      />

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-10 rounded-xl" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4 space-y-6">
          <Card className="glass-card shadow-sm border-surface-200 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-surface-100 bg-surface-50/30">
              <div>
                <CardTitle className="text-lg">
                  <Skeleton className="h-6 w-40" />
                </CardTitle>
                <div className="mt-2">
                  <Skeleton className="h-3 w-60" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-surface-100">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-xl" />
                        <div>
                          <Skeleton className="h-4 w-32 mb-1" />
                          <Skeleton className="h-3 w-48" />
                        </div>
                      </div>
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-7 w-16 rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <Card className="glass-card shadow-sm border-surface-200 h-full min-h-[400px]">
            <CardHeader className="border-b border-surface-100">
              <CardTitle className="text-lg">
                <Skeleton className="h-6 w-32" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-surface-100">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="p-4 flex gap-3">
                    <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-3 w-full" />
                      <div className="flex gap-2">
                        <Skeleton className="h-2 w-10" />
                        <Skeleton className="h-2 w-16" />
                      </div>
                    </div>
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
