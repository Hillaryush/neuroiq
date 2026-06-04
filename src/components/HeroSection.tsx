import { motion } from 'framer-motion'
import { useAnimatedCounter } from '../hooks/useAnimatedCounter'
import { BRAIN_LEVELS } from '../utils/constants'
import { sound } from '../services/soundService'
import type { PlayerStats, User } from '../types'

interface Props { stats: PlayerStats; user: User | null; onStart: () => void }

export default function HeroSection({ stats, user, onStart }: Props) {
  const currentLevel = BRAIN_LEVELS.slice().reverse().find(b => stats.totalXP >= b.minXP)!
  const nextLevel    = BRAIN_LEVELS[BRAIN_LEVELS.findIndex(b => b.level === currentLevel.level) + 1]
  const levelPct     = nextLevel
    ? Math.round(((stats.totalXP - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP)) * 100)
    : 100
  const brainAge = stats.gamesPlayed > 0
    ? Math.max(16, Math.round(35 - (stats.iqScore - 100) * 0.18 - stats.gamesPlayed * 0.05))
    : null

  const animIQ = useAnimatedCounter(stats.iqScore, 1400, 200)
  const animXP = useAnimatedCounter(stats.totalXP, 1600, 300)

  const miniStats = [
    { label: 'Brain Age', value: brainAge ? `${brainAge}y` : '—', color: '#00d4aa' },
    { label: 'Streak',    value: stats.dayStreak > 0 ? `${stats.dayStreak}🔥` : '—', color: '#ffd166' },
    { label: 'Rank',      value: stats.totalXP > 6000 ? 'Top 1%' : stats.totalXP > 1000 ? 'Top 10%' : 'Unranked', color: '#7c6cff' },
  ]

  return (
    <div className="relative overflow-hidden rounded-3xl mb-4"
      style={{ background: 'linear-gradient(135deg,#0d0d1c,#10102a,#0a0f1c)', border: '1px solid #2a2a4a' }}>

      {/* Glow orbs */}
      <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle,#7c6cff1a,transparent 70%)' }} />
      <div className="absolute -bottom-12 -right-12 w-56 h-56 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle,#00d4aa14,transparent 70%)' }} />

      <div className="relative z-10" style={{ padding: 'clamp(16px,3vw,28px)' }}>

        {/* Top row */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-3">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span style={{ fontSize: 'clamp(16px,2.5vw,22px)' }}>{user?.avatar || '🧠'}</span>
            <span className="font-bold" style={{ fontSize: 'clamp(13px,2vw,16px)' }}>
              {user ? `Hey ${user.name}!` : 'Train Your Brain'}
            </span>
            <span className="rounded-full font-bold"
              style={{
                background: `${currentLevel.color}22`,
                border: `1px solid ${currentLevel.color}44`,
                color: currentLevel.color,
                padding: '2px 10px',
                fontSize: 'clamp(10px,1.5vw,12px)',
              }}>
              {currentLevel.icon} {currentLevel.level}
            </span>
          </div>

          <h2 className="font-display font-extrabold leading-tight"
            style={{ fontSize: 'clamp(18px,4vw,30px)' }}>
            {stats.gamesPlayed === 0
              ? <><span className="gradient-text">Increase Memory.</span> Boost IQ.</>
              : <>IQ: <span className="gradient-text">{animIQ}</span> · {animXP.toLocaleString()} XP</>}
          </h2>
        </motion.div>

        {/* XP progress bar */}
        {nextLevel && stats.totalXP > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-3">
            <div className="flex justify-between mb-1"
              style={{ fontSize: 'clamp(9px,1.5vw,11px)', color: 'var(--muted)' }}>
              <span>{currentLevel.icon} {currentLevel.level}</span>
              <span style={{ color: nextLevel.color }}>
                {nextLevel.icon} {nextLevel.level} — {(nextLevel.minXP - stats.totalXP).toLocaleString()} XP to go
              </span>
            </div>
            <div className="rounded-full overflow-hidden" style={{ height: 6, background: '#ffffff0a' }}>
              <motion.div
                initial={{ width: 0 }} animate={{ width: `${levelPct}%` }}
                transition={{ duration: 1.4, ease: 'easeOut', delay: 0.5 }}
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg,${currentLevel.color},${nextLevel.color})` }} />
            </div>
            <div className="text-right mt-0.5" style={{ fontSize: 'clamp(9px,1.3vw,10px)', color: 'var(--muted)' }}>
              {levelPct}%
            </div>
          </motion.div>
        )}

        {/* Mini stats */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {miniStats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.07 }}
              className="text-center rounded-2xl relative overflow-hidden group"
              style={{
                background: '#ffffff07',
                border: '1px solid #ffffff10',
                padding: 'clamp(8px,1.5vw,12px) 4px',
                transition: 'border-color .2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = s.color + '44')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#ffffff10')}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{ background: `radial-gradient(circle at 50% 0%,${s.color}12,transparent 70%)` }} />
              <div className="font-display font-bold relative z-10"
                style={{ color: s.color, fontSize: 'clamp(12px,2vw,17px)' }}>
                {s.value}
              </div>
              <div className="relative z-10" style={{ color: 'var(--muted)', fontSize: 'clamp(9px,1.3vw,11px)' }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
          className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => { sound.gameStart(); onStart() }}
            className="btn flex-1 rounded-2xl font-bold text-white"
            style={{
              background: 'linear-gradient(135deg,#7c6cff,#5544ee)',
              border: '1px solid #7c6cff44',
              padding: 'clamp(10px,2vw,14px)',
              fontSize: 'clamp(12px,2vw,15px)',
              boxShadow: '0 4px 20px #7c6cff30',
            }}>
            🎮 {stats.gamesPlayed === 0 ? 'Start Training' : 'Play Now'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => { sound.click(); window.dispatchEvent(new CustomEvent('open-daily')) }}
            className="btn rounded-2xl font-bold"
            style={{
              background: '#ffd16618',
              border: '1px solid #ffd16655',
              color: '#ffd166',
              padding: 'clamp(10px,2vw,14px) clamp(12px,2.5vw,20px)',
              fontSize: 'clamp(11px,1.8vw,14px)',
              boxShadow: '0 4px 16px #ffd16618',
            }}>
            ⭐ Daily
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}