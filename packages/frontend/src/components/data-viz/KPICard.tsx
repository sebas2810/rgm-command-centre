import { Card } from '../ui/Card'
import { cn } from '../../utils/cn'

interface KPICardProps {
  label: string
  value: string | number
  prefix?: string
  suffix?: string
  change?: number
  changeLabel?: string
  target?: string
  status?: 'good' | 'warning' | 'critical'
  className?: string
}

export function KPICard({ label, value, prefix, suffix, change, changeLabel, target, status, className }: KPICardProps) {
  return (
    <Card className={cn('relative overflow-hidden', className)}>
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-bold text-white tabular-nums">
        {prefix}{value}{suffix}
      </p>
      <div className="flex items-center gap-2 mt-1">
        {change !== undefined && (
          <span className={cn(
            'text-xs font-medium',
            change > 0 ? 'text-emerald-400' : change < 0 ? 'text-red-400' : 'text-slate-500'
          )}>
            {change > 0 ? '+' : ''}{change}{changeLabel || '% YoY'}
          </span>
        )}
        {target && (
          <span className="text-xs text-slate-500">Target: {target}</span>
        )}
      </div>
      {status && (
        <div className={cn(
          'absolute top-0 right-0 h-full w-1',
          status === 'good' ? 'bg-emerald-500' : status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
        )} />
      )}
    </Card>
  )
}
