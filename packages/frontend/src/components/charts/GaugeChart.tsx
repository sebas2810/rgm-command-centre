import { cn } from '../../utils/cn'

interface GaugeChartProps {
  value: number
  max: number
  label: string
  status: 'critical' | 'amber' | 'green'
  size?: 'sm' | 'md'
  className?: string
}

const statusColors = {
  critical: { stroke: '#ef4444', bg: 'text-red-400' },
  amber: { stroke: '#f59e0b', bg: 'text-amber-400' },
  green: { stroke: '#10b981', bg: 'text-emerald-400' },
}

export function GaugeChart({ value, max, label, status, size = 'sm', className }: GaugeChartProps) {
  const pct = Math.min(1, value / max)
  const dims = size === 'sm' ? { r: 28, sw: 5, vw: 70, vh: 45 } : { r: 40, sw: 6, vw: 100, vh: 60 }
  const circumference = Math.PI * dims.r
  const dashOffset = circumference * (1 - pct)
  const { stroke, bg } = statusColors[status]

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <svg width={dims.vw} height={dims.vh} viewBox={`0 0 ${dims.vw} ${dims.vh}`}>
        {/* Background arc */}
        <path
          d={`M ${dims.vw * 0.1} ${dims.vh - 4} A ${dims.r} ${dims.r} 0 0 1 ${dims.vw * 0.9} ${dims.vh - 4}`}
          fill="none"
          stroke="#1e293b"
          strokeWidth={dims.sw}
          strokeLinecap="round"
        />
        {/* Value arc */}
        <path
          d={`M ${dims.vw * 0.1} ${dims.vh - 4} A ${dims.r} ${dims.r} 0 0 1 ${dims.vw * 0.9} ${dims.vh - 4}`}
          fill="none"
          stroke={stroke}
          strokeWidth={dims.sw}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-all duration-700"
        />
        {/* Value text */}
        <text
          x={dims.vw / 2}
          y={dims.vh - 10}
          textAnchor="middle"
          className={cn('font-bold', bg)}
          fill="currentColor"
          fontSize={size === 'sm' ? 14 : 18}
        >
          {value}/{max}
        </text>
      </svg>
      <p className="text-[10px] text-slate-400 mt-1 text-center leading-tight">{label}</p>
    </div>
  )
}
