import { cn } from '../../utils/cn'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'critical' | 'warning' | 'success' | 'info' | 'muted'
  size?: 'sm' | 'md'
  className?: string
}

const variants = {
  default: 'bg-slate-700/50 text-slate-300',
  critical: 'bg-red-500/15 text-red-400 border border-red-500/30',
  warning: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  success: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  info: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
  muted: 'bg-slate-800 text-slate-500',
}

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full font-medium',
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
      variants[variant],
      className
    )}>
      {children}
    </span>
  )
}
