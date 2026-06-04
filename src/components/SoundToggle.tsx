import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sound } from '../services/soundService'

export default function SoundToggle() {
  const [on, setOn] = useState(true)
  const [showTip, setShowTip] = useState(false)

  function toggle() {
    const next = !on
    sound.setEnabled(next)
    setOn(next)
    if (next) sound.click()
    setShowTip(true)
    setTimeout(() => setShowTip(false), 1500)
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
      {/* Tooltip */}
      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.9 }}
            transition={{ duration: 0.18 }}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '5px 12px',
              fontSize: 12,
              color: 'white',
              whiteSpace: 'nowrap',
              backdropFilter: 'blur(8px)',
            }}
          >
            {on ? '🔊 Sound on' : '🔇 Sound off'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button */}
      <motion.button
        whileTap={{ scale: 0.85 }}
        whileHover={{ scale: 1.08 }}
        onClick={toggle}
        title={on ? 'Mute' : 'Unmute'}
        className="w-11 h-11 rounded-full flex items-center justify-center text-lg"
        style={{
          background: on ? '#7c6cff22' : '#ffffff0a',
          border: `1px solid ${on ? '#7c6cff66' : 'var(--border)'}`,
          color: on ? '#7c6cff' : 'var(--muted)',
          backdropFilter: 'blur(10px)',
          boxShadow: on ? '0 4px 20px #7c6cff22' : 'none',
          transition: 'background .2s, border-color .2s, box-shadow .2s, color .2s',
          cursor: 'pointer',
        }}
      >
        <motion.span
          key={on ? 'on' : 'off'}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          {on ? '🔊' : '🔇'}
        </motion.span>
      </motion.button>
    </div>
  )
}