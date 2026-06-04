import { useEffect, useRef, useState } from 'react'

export function useAnimatedCounter(target: number, duration = 1200, delay = 0) {
  // FIX: Initialize directly to target instead of 0.
  // Previously, starting at 0 caused the display to flash "0" whenever
  // the component mounted/remounted before the animation completed.
  const [value, setValue] = useState(target)
  const prevTarget = useRef(target)

  useEffect(() => {
    const from = prevTarget.current
    prevTarget.current = target
    if (from === target) return

    let startTime: number | null = null
    let raf: number

    const ease = (t: number) => t < 0.5 ? 2*t*t : -1+(4-2*t)*t

    const step = (ts: number) => {
      if (!startTime) startTime = ts + delay
      const elapsed = Math.max(0, ts - startTime)
      const progress = Math.min(elapsed / duration, 1)
      setValue(Math.round(from + (target - from) * ease(progress)))
      if (progress < 1) raf = requestAnimationFrame(step)
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, delay])

  return value
}