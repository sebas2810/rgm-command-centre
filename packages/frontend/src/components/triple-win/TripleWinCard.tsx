import type { TripleWinScore } from '../../types'
import { TRIPLE_WIN_COLORS } from '../../utils/constants'
import { cn } from '../../utils/cn'

interface TripleWinCardProps {
  score: TripleWinScore
  variant?: 'full' | 'compact' | 'inline'
  className?: string
}

export function TripleWinCard({ score, variant = 'full', className }: TripleWinCardProps) {
  if (variant === 'inline') {
    return (
      <div className={cn('flex items-center gap-4', className)}>
        <ScorePill label="Consumer" score={score.consumer.score} color={TRIPLE_WIN_COLORS.consumer} />
        <ScorePill label="Manufacturer" score={score.manufacturer.score} color={TRIPLE_WIN_COLORS.manufacturer} />
        <ScorePill label="Retailer" score={score.retailer.score} color={TRIPLE_WIN_COLORS.retailer} />
        <div className="text-xs text-slate-500 ml-1">Overall: <span className="text-white font-bold">{score.overall}</span></div>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={cn('grid grid-cols-3 gap-3', className)}>
        <DimensionCompact label="Consumer" dim={score.consumer} color={TRIPLE_WIN_COLORS.consumer} />
        <DimensionCompact label="Manufacturer" dim={score.manufacturer} color={TRIPLE_WIN_COLORS.manufacturer} />
        <DimensionCompact label="Retailer" dim={score.retailer} color={TRIPLE_WIN_COLORS.retailer} />
      </div>
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-white">Triple Win Assessment</h4>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400">Overall:</span>
          <span className={cn(
            'text-sm font-bold',
            score.overall >= 70 ? 'text-emerald-400' : score.overall >= 50 ? 'text-amber-400' : 'text-red-400'
          )}>
            {score.overall}/100
          </span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <DimensionFull label="Consumer" dim={score.consumer} color={TRIPLE_WIN_COLORS.consumer} icon="👤" />
        <DimensionFull label="Manufacturer" dim={score.manufacturer} color={TRIPLE_WIN_COLORS.manufacturer} icon="🏭" />
        <DimensionFull label="Retailer" dim={score.retailer} color={TRIPLE_WIN_COLORS.retailer} icon="🏪" />
      </div>
    </div>
  )
}

function ScorePill({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-xs text-slate-400">{label}</span>
      <span className="text-xs font-bold text-white">{score}</span>
    </div>
  )
}

function DimensionCompact({ label, dim, color }: { label: string; dim: TripleWinScore['consumer']; color: string }) {
  return (
    <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-3">
      <div className="flex items-center gap-1.5 mb-1">
        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-xs text-slate-400">{label}</span>
      </div>
      <p className="text-lg font-bold text-white">{dim.score}</p>
      <p className={cn(
        'text-xs font-medium',
        dim.label === 'Strong' ? 'text-emerald-400' : dim.label === 'Moderate' ? 'text-amber-400' : 'text-red-400'
      )}>
        {dim.label}
      </p>
    </div>
  )
}

function DimensionFull({ label, dim, color, icon }: { label: string; dim: TripleWinScore['consumer']; color: string; icon: string }) {
  return (
    <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-3">
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-sm">{icon}</span>
        <span className="text-xs font-medium text-slate-300">{label}</span>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1 h-1.5 rounded-full bg-slate-700">
          <div
            className="h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${dim.score}%`, backgroundColor: color }}
          />
        </div>
        <span className="text-sm font-bold text-white tabular-nums">{dim.score}</span>
      </div>
      <p className={cn(
        'text-xs font-medium mb-2',
        dim.label === 'Strong' ? 'text-emerald-400' : dim.label === 'Moderate' ? 'text-amber-400' : 'text-red-400'
      )}>
        {dim.label}
      </p>
      <div className="space-y-1">
        {dim.factors.map((f, i) => (
          <div key={i} className="flex items-start gap-1.5">
            <span className={cn(
              'text-xs mt-0.5',
              f.impact === 'positive' ? 'text-emerald-400' : f.impact === 'negative' ? 'text-red-400' : 'text-slate-500'
            )}>
              {f.impact === 'positive' ? '↑' : f.impact === 'negative' ? '↓' : '→'}
            </span>
            <div>
              <p className="text-[10px] font-medium text-slate-300">{f.name}</p>
              <p className="text-[10px] text-slate-500">{f.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
