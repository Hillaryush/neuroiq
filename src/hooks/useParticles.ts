import { useEffect, useRef } from 'react'

interface Particle {
  x: number; y: number; vx: number; vy: number
  radius: number; opacity: number; color: string; pulse: number
}

const COLORS = ['#7c6cff', '#00d4aa', '#ffd166', '#f472b6', '#60a5fa']

export function useParticles(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const rafRef = useRef<number>()
  const particles = useRef<Particle[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    function resize() {
      canvas!.width  = canvas!.offsetWidth
      canvas!.height = canvas!.offsetHeight
    }
    resize()

    // Build particles
    const count = Math.floor((canvas.width * canvas.height) / 18000)
    particles.current = Array.from({ length: Math.max(count, 20) }, () => ({
      x: Math.random() * canvas!.width,
      y: Math.random() * canvas!.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      pulse: Math.random() * Math.PI * 2,
    }))

    function draw() {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height)

      particles.current.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.pulse += 0.015
        if (p.x < 0) p.x = canvas!.width
        if (p.x > canvas!.width) p.x = 0
        if (p.y < 0) p.y = canvas!.height
        if (p.y > canvas!.height) p.y = 0

        const r = p.radius + Math.sin(p.pulse) * 0.5
        const a = p.opacity + Math.sin(p.pulse * 1.3) * 0.1
        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fillStyle = p.color + Math.floor(Math.max(0, Math.min(255, a * 255))).toString(16).padStart(2, '0')
        ctx.fill()
      })

      // Draw faint connecting lines
      for (let i = 0; i < particles.current.length; i++) {
        for (let j = i + 1; j < particles.current.length; j++) {
          const a = particles.current[i], b = particles.current[j]
          const dx = a.x - b.x, dy = a.y - b.y
          const dist = Math.sqrt(dx*dx + dy*dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(124,108,255,${0.12 * (1 - dist/120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    draw()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(rafRef.current!)
      window.removeEventListener('resize', resize)
    }
  }, [canvasRef])
}
