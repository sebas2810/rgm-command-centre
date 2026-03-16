import { useState, useEffect, useRef } from 'react'
import { cn } from '../../utils/cn'

interface AnimatedNumberProps {
  from: number
  to: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
  animating: boolean
  highlightChange?: boolean
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

export function AnimatedNumber({
  from,
  to,
  duration = 800,
  decimals = 1,
  prefix = '',
  suffix = '',
  className,
  animating,
  highlightChange = true,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(to)
  const [flashColor, setFlashColor] = useState<'up' | 'down' | null>(null)
  const animRef = useRef<number | null>(null)
  const startTimeRef = useRef(0)

  useEffect(() => {
    if (!animating || from === to) {
      setDisplayValue(to)
      setFlashColor(null)
      return
    }

    // Determine direction for color flash
    if (highlightChange) {
      setFlashColor(to > from ? 'up' : 'down')
      const timer = setTimeout(() => setFlashColor(null), duration + 200)
      return () => clearTimeout(timer)
    }
  }, [animating, from, to, duration, highlightChange])

  useEffect(() => {
    if (!animating || from === to) {
      setDisplayValue(to)
      return
    }

    startTimeRef.current = performance.now()

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOutCubic(progress)

      setDisplayValue(from + (to - from) * easedProgress)

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate)
      }
    }

    animRef.current = requestAnimationFrame(animate)

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [animating, from, to, duration])

  return (
    <span
      className={cn(
        'tabular-nums transition-colors duration-300',
        flashColor === 'up' && 'text-emerald-400',
        flashColor === 'down' && 'text-red-400',
        !flashColor && className,
      )}
    >
      {prefix}{displayValue.toFixed(decimals)}{suffix}
    </span>
  )
}
