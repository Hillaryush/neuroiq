import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import { BRAIN_LEVELS } from '../utils/constants'
import { sound } from '../services/soundService'

export default function BrainReport() {
  const { stats, user } = useAppStore()
  const [open, setOpen] = useState(false)

  const currentLevel = BRAIN_LEVELS.slice().reverse().find(b=>stats.totalXP>=b.minXP)!
  const brainAge = stats.gamesPlayed>0 ? Math.max(16,Math.round(35-(stats.iqScore-100)*0.18-stats.gamesPlayed*0.05)) : null
  const skills = stats.skills as Record<string,number>
  const skillEntries = Object.entries(skills)
  const strongest = skillEntries.sort((a,b)=>b[1]-a[1])[0]
  const weakest   = skillEntries.sort((a,b)=>a[1]-b[1])[0]

  function fmt(key:string){ return key.replace(/([A-Z])/g,' $1').replace(/^./,s=>s.toUpperCase()) }

  function copyReport() {
    const text = `NeuroIQ Cognitive Report\n\nPlayer: ${user?.name||'Brain Trainee'}\nIQ Score: ${stats.iqScore}\nBrain Age: ${brainAge||'?'}\nLevel: ${currentLevel.level}\nStrength: ${fmt(strongest[0])}\nWeakness: ${fmt(weakest[0])}\n\nTrain at neuroiq.app`
    navigator.clipboard.writeText(text).then(()=>sound.correct())
  }

  return (
    <div className="mb-4">
      <motion.button whileHover={{scale:1.01}} whileTap={{scale:0.99}}
        onClick={()=>{sound.click();setOpen(v=>!v)}}
        className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl"
        style={{background:'var(--card)',border:'1px solid var(--border)'}}>
        <div className="flex items-center gap-2.5">
          <span className="text-xl">📊</span>
          <div className="text-left">
            <div className="font-bold text-sm">Brain Report</div>
            <div className="text-xs" style={{color:'var(--muted)'}}>Your cognitive profile — shareable</div>
          </div>
        </div>
        <motion.span animate={{rotate:open?180:0}} style={{color:'var(--muted)'}}>▾</motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div key="report" initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}}
            exit={{opacity:0,height:0}} className="overflow-hidden">
            <div className="mt-2 p-5 rounded-2xl relative" style={{background:'#0a0a14',border:'1px solid #7c6cff44'}}>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs uppercase tracking-widest" style={{color:'#7c6cff'}}>NeuroIQ Cognitive Report</div>
                  <div className="font-display font-bold text-lg gradient-text">{user?.name||'Brain Trainee'}</div>
                </div>
                <button onClick={copyReport}
                  className="text-xs px-3 py-1.5 rounded-full font-bold"
                  style={{background:'#7c6cff22',color:'#7c6cff',border:'1px solid #7c6cff44',cursor:'pointer'}}>
                  📋 Copy
                </button>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  {l:'IQ Score',   v:stats.iqScore,        c:'#7c6cff'},
                  {l:'Brain Age',  v:`${brainAge||'?'}y`,  c:'#00d4aa'},
                  {l:'Level',      v:currentLevel.level,   c:currentLevel.color},
                  {l:'Games',      v:stats.gamesPlayed,    c:'#ffd166'},
                ].map(s=>(
                  <div key={s.l} className="py-3 px-3 rounded-xl text-center"
                    style={{background:'var(--surface)'}}>
                    <div className="font-display font-extrabold text-xl" style={{color:s.c}}>{s.v}</div>
                    <div className="text-xs" style={{color:'var(--muted)'}}>{s.l}</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <div className="flex-1 p-3 rounded-xl" style={{background:'#00d4aa11',border:'1px solid #00d4aa33'}}>
                  <div className="text-xs mb-1" style={{color:'var(--muted)'}}>💪 Strength</div>
                  <div className="font-bold text-sm" style={{color:'#00d4aa'}}>{fmt(strongest[0])}</div>
                  <div className="text-xs" style={{color:'#00d4aa'}}>{strongest[1]}/100</div>
                </div>
                <div className="flex-1 p-3 rounded-xl" style={{background:'#ff6b6b11',border:'1px solid #ff6b6b33'}}>
                  <div className="text-xs mb-1" style={{color:'var(--muted)'}}>📈 Improve</div>
                  <div className="font-bold text-sm" style={{color:'#ff6b6b'}}>{fmt(weakest[0])}</div>
                  <div className="text-xs" style={{color:'#ff6b6b'}}>{weakest[1]}/100</div>
                </div>
              </div>

              <div className="mt-3 text-center text-xs" style={{color:'var(--dim)'}}>
                Trained at neuroiq.app • {new Date().toLocaleDateString()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
