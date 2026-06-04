import { motion } from 'framer-motion'
import { sound } from '../services/soundService'

interface Props {
  title: string; score: number; timerProgress: number
  timeLeft: number; onExit: () => void; timerLabel?: string
  children: React.ReactNode
}

export default function GameLayout({
  title, score, timerProgress, timeLeft, onExit, timerLabel = 'Time', children
}: Props) {
  const pct = Math.max(0, Math.min(1, timerProgress)) * 100
  const barColor = pct > 50
    ? 'linear-gradient(90deg,#7c6cff,#00d4aa)'
    : pct > 25
      ? 'linear-gradient(90deg,#ffd166,#f59e0b)'
      : 'linear-gradient(90deg,#ff6b6b,#ef4444)'

  const isUrgent = pct < 25

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl"
      style={{
        background: 'var(--card)',
        border: `1px solid ${isUrgent ? '#ff6b6b44' : 'var(--border)'}`,
        minHeight: 'min(480px, 80vh)',
        padding: 'clamp(16px,3vw,24px)',
        transition: 'border-color .4s',
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-display font-extrabold" style={{ fontSize: 'clamp(15px,3vw,20px)' }}>
          {title}
        </h2>
        <div className="flex items-center gap-2">
          {/* Score */}
          <motion.span
            key={score}
            initial={{ scale: 1.3, color: '#00d4aa' }}
            animate={{ scale: 1, color: '#7c6cff' }}
            transition={{ duration: 0.3 }}
            className="font-display font-bold tabular-nums"
            style={{ fontSize: 'clamp(14px,2.5vw,18px)' }}
          >
            {score.toLocaleString()}
          </motion.span>
          <button
            onClick={() => { sound.click(); onExit() }}
            className="btn rounded-xl font-semibold"
            style={{
              background: '#ffffff0a',
              border: '1px solid var(--border)',
              color: 'var(--muted)',
              padding: 'clamp(5px,1vw,8px) clamp(10px,2vw,16px)',
              fontSize: 'clamp(11px,1.8vw,13px)',
              transition: 'border-color .15s, color .15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#ff6b6b66';
              (e.currentTarget as HTMLButtonElement).style.color = '#ff6b6b';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--muted)';
            }}
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Timer bar */}
      <div className="mb-4">
        <div className="rounded-full overflow-hidden mb-1"
          style={{ height: 5, background: 'var(--dim)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: barColor }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <div className="flex justify-between"
          style={{ fontSize: 'clamp(9px,1.4vw,11px)', color: 'var(--muted)' }}>
          <span>{timerLabel}</span>
          <motion.span
            animate={isUrgent ? { opacity: [1, 0.4, 1] } : { opacity: 1 }}
            transition={isUrgent ? { repeat: Infinity, duration: 0.8 } : {}}
            style={{ color: isUrgent ? '#ff6b6b' : 'var(--muted)', fontWeight: isUrgent ? 700 : 400 }}
          >
            {timerLabel === 'Level' || timerLabel === 'Seq' ? `#${timeLeft}` : `${timeLeft}s`}
          </motion.span>
        </div>
      </div>

      {children}
    </motion.div>
  )
}