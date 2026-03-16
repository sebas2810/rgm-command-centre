import { useState, useEffect, useRef, useCallback } from 'react'
import { TYPING_SPEED } from '../utils/constants'

interface UseTypewriterOptions {
  speed?: number  // chars per second
  onComplete?: () => void
  enabled?: boolean
}

export function useTypewriter(text: string, options: UseTypewriterOptions = {}) {
  const { speed = TYPING_SPEED, onComplete, enabled = true } = options
  const [displayedText, setDisplayedText] = useState(enabled ? '' : text)
  const [isComplete, setIsComplete] = useState(!enabled)
  const animRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const skip = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current)
    setDisplayedText(text)
    setIsComplete(true)
    onCompleteRef.current?.()
  }, [text])

  useEffect(() => {
    if (!enabled) {
      setDisplayedText(text)
      setIsComplete(true)
      return
    }

    setDisplayedText('')
    setIsComplete(false)
    startTimeRef.current = performance.now()

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current
      const charsToShow = Math.floor((elapsed / 1000) * speed)

      if (charsToShow >= text.length) {
        setDisplayedText(text)
        setIsComplete(true)
        onCompleteRef.current?.()
        return
      }

      setDisplayedText(text.slice(0, charsToShow))
      animRef.current = requestAnimationFrame(animate)
    }

    animRef.current = requestAnimationFrame(animate)

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [text, speed, enabled])

  return { displayedText, isComplete, skip }
}
