import { Skeleton } from "./Skeleton"
import { PageHeader } from "./PageHeader"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./Table"

interface TablePageSkeletonProps {
  title: string
  gradientTitle: string
}

export function TablePageSkeleton({ title, gradientTitle }: TablePageSkeletonProps) {
  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        gradientTitle={gradientTitle}
        actions={
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-28 rounded-lg" />
            <Skeleton className="h-9 w-36 rounded-lg" />
          </div>
        }
      />

      <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-surface-200/50 shadow-sm">
        {/* Section title row */}
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-4 w-40" />
        </div>

        <div className="space-y-4">
          {/* Search bar row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Skeleton className="h-9 w-full max-w-sm rounded-lg" />
          </div>

          {/* Table — matches DataTable: border-y only, bg-surface-100 header */}
          <div className="border-y border-surface-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-surface-100">
                <TableRow className="hover:bg-transparent border-surface-100">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <TableHead key={i} className="py-3">
                      <Skeleton className="h-3.5 w-20" />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <TableRow key={i} className="border-surface-100/50">
                    {[1, 2, 3, 4, 5, 6].map((j) => (
                      <TableCell key={j} className="py-3">
                        <Skeleton className="h-4 w-full max-w-[120px]" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination row */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-44" />
            <div className="flex gap-1.5">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
