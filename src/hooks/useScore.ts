import { useState, useCallback } from 'react'

export function useScore() {
  const [score, setScore] = useState(0)

  const add = useCallback((pts: number) => {
    setScore((s) => s + pts)
  }, [])

  const reset = useCallback(() => setScore(0), [])

  return { score, add, reset }
}
