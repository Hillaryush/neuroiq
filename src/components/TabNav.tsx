import { motion } from 'framer-motion'
import { sound } from '../services/soundService'
import type { Tab } from '../types'

interface Props { active: Tab; onChange: (tab: Tab) => void }

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'games',         label: 'Train',    icon: '🎮' },
  { id: 'progress',     label: 'Progress', icon: '📈' },
  { id: 'achievements', label: 'Awards',   icon: '🏆' },
  { id: 'leaderboard',  label: 'Ranks',    icon: '🌍' },
]

export default function TabNav({ active, onChange }: Props) {
  return (
    <div className="flex gap-1 rounded-2xl mb-4"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        padding: 'clamp(4px,1vw,6px)',
      }}>
      {TABS.map(tab => {
        const isActive = active === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => { sound.tabSwitch(); onChange(tab.id) }}
            className="btn flex-1 rounded-xl relative overflow-hidden"
            style={{
              color: isActive ? 'white' : 'var(--muted)',
              padding: 'clamp(6px,1.5vw,10px) 4px',
              transition: 'color .2s',
            }}
          >
            {isActive && (
              <motion.div
                layoutId="tab-pill"
                className="absolute inset-0 rounded-xl"
                style={{ background: 'linear-gradient(135deg,#7c6cff,#5544ee)' }}
                transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              />
            )}
            {/* Subtle hover state for inactive tabs */}
            {!isActive && (
              <span className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity"
                style={{ background: '#ffffff08' }} />
            )}
            <span className="relative z-10 flex flex-col items-center" style={{ gap: 2 }}>
              <span style={{ fontSize: 'clamp(14px,2.5vw,18px)' }}>{tab.icon}</span>
              <span style={{ fontSize: 'clamp(9px,1.5vw,11px)', fontWeight: 600, letterSpacing: '0.03em' }}>
                {tab.label}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}