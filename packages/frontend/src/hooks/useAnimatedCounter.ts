import { useState, useEffect, useRef } from 'react'

interface UseAnimatedCounterOptions {
  duration?: number  // ms
  decimals?: number
  enabled?: boolean
}

export function useAnimatedCounter(
  target: number,
  options: UseAnimatedCounterOptions = {}
) {
  const { duration = 1200, decimals = 1, enabled = true } = options
  const [value, setValue] = useState(enabled ? 0 : target)
  const animRef = useRef<number | null>(null)

  useEffect(() => {
    if (!enabled) {
      setValue(target)
      return
    }

    const start = performance.now()
    const from = 0

    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = from + (target - from) * eased

      setValue(Number(current.toFixed(decimals)))

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate)
      }
    }

    animRef.current = requestAnimationFrame(animate)

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [target, duration, decimals, enabled])

  return value
}
