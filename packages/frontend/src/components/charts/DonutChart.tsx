import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { cn } from '../../utils/cn'

interface DonutChartProps {
  data: { name: string; value: number; color: string }[]
  height?: number
  centerLabel?: string
  centerValue?: string
  className?: string
}

export function DonutChart({ data, height = 160, centerLabel, centerValue, className }: DonutChartProps) {
  return (
    <div className={cn('relative w-full', className)}>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="80%"
            paddingAngle={2}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      {(centerLabel || centerValue) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {centerValue && <p className="text-lg font-bold text-white">{centerValue}</p>}
          {centerLabel && <p className="text-[10px] text-slate-400">{centerLabel}</p>}
        </div>
      )}
    </div>
  )
}
