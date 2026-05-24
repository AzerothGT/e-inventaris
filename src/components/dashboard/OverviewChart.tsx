import { useSuspenseQuery } from '@tanstack/react-query'
import { getTrendData } from '../../server/functions/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { TrendingUp } from 'lucide-react'
import { IconBox } from '../ui/IconBox'

export function OverviewChart() {
  const { data: trend } = useSuspenseQuery({
    queryKey: ['trendData'],
    queryFn: () => getTrendData(),
  })

  const maxVal = Math.max(...trend.map((d) => Math.max(d.totalSubmitted, d.totalSelesai)), 1)

  const totalSubmitted = trend.reduce((s, d) => s + d.totalSubmitted, 0)
  const totalSelesai = trend.reduce((s, d) => s + d.totalSelesai, 0)

  return (
    <Card className="glass-card shadow-sm border-surface-200 stagger-5 h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between border-b border-surface-100 bg-surface-50/30 py-2.5 px-4">
        <div>
          <CardTitle className="text-sm font-semibold">Ringkasan Tren</CardTitle>
          <p className="text-xs text-surface-500 mt-1">Aktivitas pengajuan 7 bulan terakhir</p>
        </div>
        <IconBox icon={TrendingUp} variant="primary" size={18} />
      </CardHeader>
      <CardContent className="p-4 flex-1 flex flex-col gap-4">
        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-medium text-surface-600">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-primary-500 inline-block" />
            Diajukan ({totalSubmitted})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-success-500 inline-block" />
            Selesai ({totalSelesai})
          </span>
        </div>

        {/* Bar chart */}
        <div className="flex-1 flex items-end justify-between gap-2" style={{ minHeight: 140 }}>
          {trend.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="w-full flex items-end justify-center gap-0.5" style={{ height: 140 }}>
                {/* Diajukan bar */}
                <div
                  className="relative flex-1 bg-primary-500/25 group-hover:bg-primary-500/50 transition-all duration-300 rounded-t-md"
                  style={{ height: `${(day.totalSubmitted / maxVal) * 100}%`, minHeight: day.totalSubmitted > 0 ? 4 : 0 }}
                >
                  {day.totalSubmitted > 0 && (
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {day.totalSubmitted}
                    </span>
                  )}
                </div>
                {/* Selesai bar */}
                <div
                  className="relative flex-1 bg-success-500/25 group-hover:bg-success-500/50 transition-all duration-300 rounded-t-md"
                  style={{ height: `${(day.totalSelesai / maxVal) * 100}%`, minHeight: day.totalSelesai > 0 ? 4 : 0 }}
                >
                  {day.totalSelesai > 0 && (
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-success-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {day.totalSelesai}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-[10px] text-surface-400 font-medium capitalize">{day.label}</span>
            </div>
          ))}
        </div>

        {/* Zero state */}
        {totalSubmitted === 0 && totalSelesai === 0 && (
          <p className="text-center text-xs text-surface-400 italic -mt-2">Belum ada aktivitas dalam 7 hari terakhir</p>
        )}
      </CardContent>
    </Card>
  )
}
