import { cn } from '../../utils/cn'

interface StatusDotProps {
  status: 'healthy' | 'degraded' | 'error' | 'active' | 'inactive'
  pulse?: boolean
  size?: 'sm' | 'md'
}

const colors = {
  healthy: 'bg-emerald-500',
  active: 'bg-emerald-500',
  degraded: 'bg-amber-500',
  error: 'bg-red-500',
  inactive: 'bg-slate-600',
}

export function StatusDot({ status, pulse, size = 'sm' }: StatusDotProps) {
  return (
    <span className="relative inline-flex">
      <span className={cn(
        'rounded-full',
        colors[status],
        size === 'sm' ? 'h-2 w-2' : 'h-3 w-3',
      )} />
      {pulse && (
        <span className={cn(
          'absolute inset-0 rounded-full animate-ping opacity-75',
          colors[status],
        )} />
      )}
    </span>
  )
}
