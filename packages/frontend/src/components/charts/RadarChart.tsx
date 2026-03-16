import {
  Radar,
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'
import type { TripleWinScore } from '../../types'
import { TRIPLE_WIN_COLORS } from '../../utils/constants'
import { cn } from '../../utils/cn'

interface TripleWinRadarProps {
  score: TripleWinScore
  height?: number
  showLabels?: boolean
  className?: string
}

export function TripleWinRadar({ score, height = 250, showLabels = true, className }: TripleWinRadarProps) {
  const data = [
    { dimension: 'Consumer', value: score.consumer.score, fullMark: 100 },
    { dimension: 'Manufacturer', value: score.manufacturer.score, fullMark: 100 },
    { dimension: 'Retailer', value: score.retailer.score, fullMark: 100 },
  ]

  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsRadar data={data}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: '#475569', fontSize: 9 }}
            axisLine={false}
          />
          <Radar
            name="Score"
            dataKey="value"
            stroke="#8b5cf6"
            fill="#8b5cf6"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </RechartsRadar>
      </ResponsiveContainer>
      {showLabels && (
        <div className="flex justify-center gap-4 mt-2">
          {data.map(d => (
            <div key={d.dimension} className="text-center">
              <div className="flex items-center gap-1.5">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: TRIPLE_WIN_COLORS[d.dimension.toLowerCase() as keyof typeof TRIPLE_WIN_COLORS] }}
                />
                <span className="text-xs text-slate-400">{d.dimension}</span>
              </div>
              <p className="text-sm font-bold text-white">{d.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
