import { useRef } from 'react'
import { useParticles } from '../hooks/useParticles'

export default function FloatingBackground() {
  const ref = useRef<HTMLCanvasElement>(null)
  useParticles(ref)
  return (
    <canvas
      ref={ref}
      className="fixed inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%', zIndex: 0, opacity: 0.6 }}
    />
  )
}
