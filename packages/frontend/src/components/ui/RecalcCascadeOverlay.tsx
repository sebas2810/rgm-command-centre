import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../utils/cn'

export interface CascadeStep {
  label: string
  detail: string
  durationMs: number
  status: 'pending' | 'running' | 'complete'
  progress: number // 0..1
}

interface RecalcCascadeOverlayProps {
  visible: boolean
  steps: CascadeStep[]
  currentStepIndex: number
  className?: string
}

const MARKET_BADGES = ['DE', 'NL', 'FR', 'UK', 'PL'] as const

export function RecalcCascadeOverlay({ visible, steps, currentStepIndex, className }: RecalcCascadeOverlayProps) {
  const overallProgress = steps.length > 0
    ? steps.reduce((sum, s) => sum + s.progress, 0) / steps.length
    : 0

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            'absolute inset-0 z-30 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center',
            className,
          )}
        >
          {/* Scanning line effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="cascade-scan-line" />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 25 }}
            className="cascade-overlay w-[420px] rounded-xl border border-purple-500/30 bg-slate-900/95 shadow-2xl shadow-purple-500/10 p-5"
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-lg cascade-pulse">
                  ⚙
                </div>
                <div className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-purple-400 animate-ping" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">RGM Intelligence Engine</h3>
                <p className="text-[10px] text-purple-300">Recalculating portfolio impact...</p>
              </div>
            </div>

            {/* Overall progress bar */}
            <div className="h-1 rounded-full bg-slate-800 mb-4 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-400"
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress * 100}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>

            {/* Market badges */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] text-slate-500 mr-1">Markets:</span>
              {MARKET_BADGES.map((m, i) => (
                <span
                  key={m}
                  className={cn(
                    'text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all duration-300',
                    currentStepIndex >= 0 && (i <= currentStepIndex || currentStepIndex >= 3)
                      ? 'text-purple-300 border-purple-500/50 bg-purple-500/20 cascade-badge-pulse'
                      : 'text-slate-600 border-slate-700/50 bg-slate-800/50',
                  )}
                >
                  {m}
                </span>
              ))}
            </div>

            {/* Steps */}
            <div className="space-y-2">
              {steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  {/* Status icon */}
                  <div className="mt-0.5 shrink-0">
                    {step.status === 'complete' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center"
                      >
                        <svg className="h-3 w-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    )}
                    {step.status === 'running' && (
                      <div className="h-5 w-5 rounded-full border-2 border-purple-400 border-t-transparent animate-spin" />
                    )}
                    {step.status === 'pending' && (
                      <div className="h-5 w-5 rounded-full bg-slate-700/50 border border-slate-600/50" />
                    )}
                  </div>

                  {/* Label and progress */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        'text-xs font-medium',
                        step.status === 'complete' ? 'text-emerald-400' :
                          step.status === 'running' ? 'text-white' : 'text-slate-500',
                      )}>
                        {step.label}
                      </span>
                      {step.status === 'running' && (
                        <span className="text-[10px] text-purple-300 tabular-nums">
                          {Math.round(step.progress * 100)}%
                        </span>
                      )}
                    </div>
                    <p className={cn(
                      'text-[10px]',
                      step.status === 'complete' ? 'text-emerald-400/60' :
                        step.status === 'running' ? 'text-slate-400' : 'text-slate-600',
                    )}>
                      {step.detail}
                    </p>
                    {step.status === 'running' && (
                      <div className="h-0.5 rounded-full bg-slate-800 mt-1 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-purple-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${step.progress * 100}%` }}
                          transition={{ duration: 0.15 }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <p className="text-[10px] text-slate-600 text-center">
                5 markets × 86 SKUs × 1,000 demand scenarios
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
