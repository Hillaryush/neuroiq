import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import { BRAIN_LEVELS } from '../utils/constants'
import { sound } from '../services/soundService'
import SettingsModal from './SettingsModal'
import type { BrainLevel } from '../types'

export default function Header() {
  const { user, stats, setUser } = useAppStore()
  const [menu, setMenu]         = useState(false)
  const [settings, setSettings] = useState(false)
  const level = BRAIN_LEVELS.find(b => b.level === stats.brainLevel as BrainLevel) || BRAIN_LEVELS[0]

  return (
    <>
      <SettingsModal open={settings} onClose={() => setSettings(false)} />

      <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-3"
        style={{ padding: 'clamp(8px,2vw,16px) 0' }}>

        {/* Logo */}
        <div>
          <h1 className="font-display font-extrabold gradient-text leading-none"
            style={{ fontSize: 'clamp(20px,4vw,30px)', letterSpacing: -1 }}>
            NeuroIQ
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 'clamp(8px,1.5vw,11px)', letterSpacing: 3 }}>
            BRAIN TRAINING
          </p>
        </div>

        {/* Right badges + avatar */}
        <div className="flex items-center gap-1.5">
          {stats.dayStreak > 0 && (
            <div className="flex items-center gap-1 rounded-full font-bold"
              style={{ background: '#ffd16618', border: '1px solid #ffd16644', color: '#ffd166',
                padding: 'clamp(4px,1vw,6px) clamp(8px,2vw,12px)', fontSize: 'clamp(10px,1.5vw,12px)' }}>
              🔥{stats.dayStreak}
            </div>
          )}
          <div className="rounded-full font-bold"
            style={{ background: `${level.color}18`, border: `1px solid ${level.color}44`, color: level.color,
              padding: 'clamp(4px,1vw,6px) clamp(8px,2vw,12px)', fontSize: 'clamp(10px,1.5vw,12px)' }}>
            {level.icon} <span className="hidden sm:inline">{level.level}</span>
          </div>

          {/* Avatar dropdown */}
          <div className="relative">
            <button onClick={() => { sound.click(); setMenu(v => !v) }}
              className="rounded-full flex items-center justify-center border-2 transition-all"
              style={{ background: '#7c6cff22', borderColor: '#7c6cff44', cursor: 'pointer',
                width: 'clamp(32px,4vw,38px)', height: 'clamp(32px,4vw,38px)',
                fontSize: 'clamp(14px,2vw,18px)' }}>
              {user?.avatar || '🧠'}
            </button>

            <AnimatePresence>
              {menu && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setMenu(false)} />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -8 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                    className="absolute right-0 top-11 w-44 rounded-2xl p-2 z-40 shadow-2xl"
                    style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                    <div className="px-3 py-2 mb-1">
                      <div className="text-sm font-bold truncate">{user?.name || 'Guest'}</div>
                      <div className="text-xs truncate" style={{ color: 'var(--muted)' }}>{user?.email}</div>
                    </div>
                    <div style={{ height: 1, background: 'var(--border)', margin: '4px 8px' }} />
                    <button onClick={() => { sound.click(); setMenu(false); setSettings(true) }}
                      className="w-full text-left px-3 py-2.5 text-sm rounded-xl"
                      style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#ffffff08')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                      ⚙️ Settings
                    </button>
                    <button onClick={() => { sound.click(); setUser(null); setMenu(false) }}
                      className="w-full text-left px-3 py-2.5 text-sm rounded-xl"
                      style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#ff6b6b11')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                      🚪 Sign Out
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </>
  )
}
