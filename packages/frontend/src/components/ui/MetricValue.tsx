import { cn } from '../../utils/cn'

interface MetricValueProps {
  value: string | number
  label: string
  prefix?: string
  suffix?: string
  change?: number  // positive or negative
  target?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function MetricValue({ value, label, prefix, suffix, change, target, size = 'md', className }: MetricValueProps) {
  const valueSize = { sm: 'text-lg', md: 'text-2xl', lg: 'text-4xl' }
  return (
    <div className={cn('flex flex-col', className)}>
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</p>
      <p className={cn('font-bold text-white tabular-nums', valueSize[size])}>
        {prefix}{value}{suffix}
      </p>
      <div className="flex items-center gap-2 mt-0.5">
        {change !== undefined && (
          <span className={cn(
            'text-xs font-medium',
            change > 0 ? 'text-emerald-400' : change < 0 ? 'text-red-400' : 'text-slate-500'
          )}>
            {change > 0 ? '+' : ''}{change}%
          </span>
        )}
        {target && (
          <span className="text-xs text-slate-500">
            Target: {target}
          </span>
        )}
      </div>
    </div>
  )
}
