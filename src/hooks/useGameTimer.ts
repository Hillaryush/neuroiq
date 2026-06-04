import { useState, useEffect, useRef, useCallback } from 'react'

export function useGameTimer(
  initialSeconds: number,
  onExpire: () => void
) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds)
  const [running, setRunning] = useState(false)
  const expireRef = useRef(onExpire)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  expireRef.current = onExpire

  const start = useCallback(() => {
    setTimeLeft(initialSeconds)
    setRunning(true)
  }, [initialSeconds])

  const stop = useCallback(() => {
    setRunning(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [])

  const reset = useCallback(() => {
    stop()
    setTimeLeft(initialSeconds)
  }, [initialSeconds, stop])

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(intervalRef.current!)
          setRunning(false)
          expireRef.current()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running])

  const progress = timeLeft / initialSeconds

  return { timeLeft, progress, running, start, stop, reset }
}
