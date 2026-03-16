import { AreaChart, Area, ResponsiveContainer } from 'recharts'
import { cn } from '../../utils/cn'

interface SparklineChartProps {
  data: number[]
  color?: string
  height?: number
  className?: string
}

export function SparklineChart({ data, color = '#3b82f6', height = 32, className }: SparklineChartProps) {
  const chartData = data.map((value, i) => ({ i, value }))
  const trend = data.length >= 2 ? data[data.length - 1] - data[0] : 0
  const effectiveColor = trend >= 0 ? color : '#ef4444'

  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <defs>
            <linearGradient id={`spark-${effectiveColor.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={effectiveColor} stopOpacity={0.3} />
              <stop offset="100%" stopColor={effectiveColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={effectiveColor}
            strokeWidth={1.5}
            fill={`url(#spark-${effectiveColor.replace('#', '')})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
