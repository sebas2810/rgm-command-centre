import { cn } from '../../utils/cn'

interface ProgressBarProps {
  value: number  // 0-100
  max?: number
  color?: string  // tailwind bg class
  size?: 'sm' | 'md'
  showLabel?: boolean
  className?: string
}

export function ProgressBar({ value, max = 100, color = 'bg-blue-500', size = 'sm', showLabel, className }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn('flex-1 rounded-full bg-slate-800', size === 'sm' ? 'h-1.5' : 'h-2.5')}>
        <div
          className={cn('rounded-full transition-all duration-500', color, size === 'sm' ? 'h-1.5' : 'h-2.5')}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && <span className="text-xs text-slate-400 tabular-nums">{Math.round(pct)}%</span>}
    </div>
  )
}
