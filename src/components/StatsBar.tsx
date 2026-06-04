import { motion } from 'framer-motion'
import { useAnimatedCounter } from '../hooks/useAnimatedCounter'
import type { PlayerStats } from '../types'

function getRank(iq: number) {
  if (iq >= 145) return 'S+'
  if (iq >= 130) return 'S'
  if (iq >= 120) return 'A+'
  if (iq >= 110) return 'A'
  if (iq >= 100) return 'B+'
  return 'B'
}

function StatCard({ label, rawVal, color, delay, suffix = '', trend }: {
  label: string; rawVal: number | string; color: string
  delay: number; suffix?: string; trend?: string
}) {
  const isNum    = typeof rawVal === 'number'
  const animated = useAnimatedCounter(isNum ? (rawVal as number) : 0, 1400, delay)

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000 }}
      className="rounded-2xl text-center relative overflow-hidden group cursor-default"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        padding: 'clamp(10px,2vw,18px) 8px',
        transition: 'border-color .2s, box-shadow .2s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = color + '66';
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 24px ${color}18`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
      }}
    >
      {/* Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 0%,${color}14,transparent 70%)` }} />

      {/* Top accent line */}
      <div className="absolute top-0 left-4 right-4 rounded-full"
        style={{ height: 2, background: `linear-gradient(90deg,transparent,${color},transparent)` }} />

      <div className="font-display font-extrabold leading-none mb-0.5 tabular-nums truncate relative z-10"
        style={{ fontSize: 'clamp(16px,3.5vw,26px)', color }}>
        {isNum ? animated.toLocaleString() : rawVal}{suffix}
      </div>

      {trend && (
        <div className="font-semibold relative z-10" style={{ color: '#00d4aa', fontSize: 'clamp(9px,1.5vw,11px)' }}>
          ↑ {trend}
        </div>
      )}

      <div className="uppercase tracking-wider relative z-10"
        style={{ color: 'var(--muted)', fontSize: 'clamp(8px,1.5vw,11px)', marginTop: 2 }}>
        {label}
      </div>
    </motion.div>
  )
}

export default function StatsBar({ stats }: { stats: PlayerStats }) {
  const recentGain = stats.history.slice(0, 5).reduce((a, r) => a + r.iqGain, 0)
  return (
    <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
      <StatCard label="IQ Score"  rawVal={stats.iqScore}   color="#7c6cff" delay={0}
        trend={recentGain > 0 ? `+${recentGain}` : undefined} />
      <StatCard label="Streak"    rawVal={stats.dayStreak} color="#ffd166" delay={60}  suffix="🔥" />
      <StatCard label="Total XP"  rawVal={stats.totalXP}   color="#00d4aa" delay={120} />
      <StatCard label="Rank"      rawVal={getRank(stats.iqScore)} color="#ff6b6b" delay={180} />
    </div>
  )
}