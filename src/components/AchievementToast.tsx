import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import { sound } from '../services/soundService'

export default function AchievementToast() {
  const { newAchievement, clearNewAchievement } = useAppStore()

  useEffect(() => {
    if (newAchievement) {
      sound.achievement()
      const t = setTimeout(clearNewAchievement, 4000)
      return () => clearTimeout(t)
    }
  }, [newAchievement, clearNewAchievement])

  return (
    <AnimatePresence>
      {newAchievement && (
        <motion.div
          initial={{ opacity:0, y:-70, scale:0.88 }}
          animate={{ opacity:1, y:0,   scale:1    }}
          exit={{    opacity:0, y:-50, scale:0.92 }}
          transition={{ type:'spring', stiffness:280, damping:26 }}
          className="fixed top-4 left-1/2 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl"
          style={{ transform:'translateX(-50%)', minWidth:300, maxWidth:'90vw',
            background:'linear-gradient(135deg,#1a1428,#1a2028)',
            border:'1px solid #7c6cff66', backdropFilter:'blur(16px)' }}>
          {/* Glow */}
          <div className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ background:'radial-gradient(circle at 20% 50%,#7c6cff18,transparent 60%)' }} />
          <motion.span initial={{scale:0}} animate={{scale:1}} transition={{type:'spring',delay:0.1}}
            className="text-3xl relative z-10">{newAchievement.icon}</motion.span>
          <div className="relative z-10">
            <div className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{color:'#7c6cff'}}>
              🏆 Achievement Unlocked!
            </div>
            <div className="font-bold text-sm text-white">{newAchievement.title}</div>
            <div className="text-xs" style={{color:'var(--muted)'}}>{newAchievement.description}</div>
          </div>
          <button onClick={clearNewAchievement} className="ml-auto text-xs relative z-10" style={{color:'var(--dim)'}}>✕</button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
