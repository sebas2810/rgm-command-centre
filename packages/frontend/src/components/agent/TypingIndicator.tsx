import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

interface TypingIndicatorProps {
  agentColor: string  // tailwind bg class like 'bg-red-500'
  className?: string
}

export function TypingIndicator({ agentColor, className }: TypingIndicatorProps) {
  return (
    <div className={cn('flex items-center gap-2 py-3', className)}>
      <div className={cn('h-6 w-6 rounded-full flex items-center justify-center', agentColor.replace('bg-', 'bg-').replace('500', '500/20'))}>
        <div className={cn('h-2 w-2 rounded-full', agentColor)} />
      </div>
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className={cn('h-2 w-2 rounded-full bg-slate-500')}
            animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  )
}
