import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'

export function OverviewChart() {
  // A very simple SVG "chart" to replace the placeholder
  return (
    <Card className="glass-card shadow-sm border-surface-200 stagger-5">
      <CardHeader>
        <CardTitle className="text-lg">Ringkasan Tren</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] flex items-end justify-between gap-2 p-6 bg-surface-50/30 rounded-xl m-2 border border-dashed border-surface-200">
        {[40, 70, 45, 90, 65, 80, 50].map((height, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
            <div 
              className="w-full bg-primary-500/20 group-hover:bg-primary-500/40 transition-all rounded-t-lg relative"
              style={{ height: `${height}%` }}
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
                {height}
              </div>
            </div>
            <span className="text-[10px] text-surface-400 font-medium">H-{7-i}</span>
          </div>
        ))}
        {/* Placeholder for real chart data in the future */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <p className="text-xs font-bold uppercase tracking-widest text-surface-400 -rotate-12">Simulated Data</p>
        </div>
      </CardContent>
    </Card>
  )
}
