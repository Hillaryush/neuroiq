import { motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import { BRAIN_LEVELS } from '../utils/constants'

export default function AchievementsPage() {
  const { stats } = useAppStore()
  const unlocked = stats.achievements.filter(a=>a.unlocked).length
  const total    = stats.achievements.length
  const pct      = Math.round((unlocked/total)*100)

  const current  = BRAIN_LEVELS.slice().reverse().find(b=>stats.totalXP>=b.minXP)!
  const next     = BRAIN_LEVELS[BRAIN_LEVELS.findIndex(b=>b.level===current.level)+1]
  const levelPct = next ? Math.round(((stats.totalXP-current.minXP)/(next.minXP-current.minXP))*100) : 100

  return (
    <div className="space-y-4">
      {/* Brain Level */}
      <div className="rounded-2xl p-5" style={{background:'var(--card)',border:'1px solid var(--border)'}}>
        <h3 className="text-xs uppercase tracking-widest mb-4" style={{color:'var(--muted)'}}>Brain Level</h3>
        <div className="flex items-center gap-4 mb-4">
          <div className="text-5xl">{current.icon}</div>
          <div className="flex-1">
            <div className="font-display font-extrabold text-2xl" style={{color:current.color}}>{current.level}</div>
            <div className="text-sm" style={{color:'var(--muted)'}}>{stats.totalXP.toLocaleString()} XP</div>
            {next && (
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1" style={{color:'var(--muted)'}}>
                  <span>→ {next.icon} {next.level}</span>
                  <span>{(next.minXP-stats.totalXP).toLocaleString()} XP needed</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{background:'var(--dim)'}}>
                  <motion.div initial={{width:0}} animate={{width:`${levelPct}%`}} transition={{duration:1.2}}
                    className="h-full rounded-full"
                    style={{background:`linear-gradient(90deg,${current.color},${next.color})`}}/>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Level path */}
        <div className="flex gap-2 flex-wrap">
          {BRAIN_LEVELS.map(l=>(
            <div key={l.level} className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
              style={{background:stats.totalXP>=l.minXP?`${l.color}22`:'var(--surface)',
                border:`1px solid ${stats.totalXP>=l.minXP?l.color:'var(--border)'}`,
                color:stats.totalXP>=l.minXP?l.color:'var(--dim)'}}>
              {l.icon} {l.level}
            </div>
          ))}
        </div>
      </div>

      {/* Tournament widget */}
      <div className="rounded-2xl p-4 relative overflow-hidden" style={{background:'linear-gradient(135deg,#1a1428,#14281a)',border:'1px solid #ffd16633'}}>
        <div className="absolute inset-0 animate-shimmer pointer-events-none opacity-30"/>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span>🏆</span>
              <span className="font-bold text-sm" style={{color:'#ffd166'}}>NeuroIQ Championship</span>
            </div>
            <div className="text-xs" style={{color:'var(--muted)'}}>Weekly tournament • Ends in 3 days</div>
            <div className="text-xs mt-1" style={{color:'var(--muted)'}}>Current rank: <span style={{color:'#ffd166'}}>#542 Worldwide</span></div>
          </div>
          <div className="text-3xl">🎯</div>
        </div>
      </div>

      {/* Achievements */}
      <div className="rounded-2xl p-5" style={{background:'var(--card)',border:'1px solid var(--border)'}}>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs uppercase tracking-widest" style={{color:'var(--muted)'}}>Achievements</h3>
          <span className="text-xs font-bold" style={{color:'#7c6cff'}}>{unlocked}/{total} · {pct}%</span>
        </div>
        <div className="h-1.5 rounded-full mb-4 overflow-hidden" style={{background:'var(--dim)'}}>
          <motion.div initial={{width:0}} animate={{width:`${pct}%`}} transition={{duration:1.2}}
            className="h-full rounded-full" style={{background:'linear-gradient(90deg,#7c6cff,#00d4aa)'}}/>
        </div>
        <div className="space-y-2">
          {stats.achievements.map((a,i)=>(
            <motion.div key={a.id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.025}}
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{background:a.unlocked?'#7c6cff0a':'var(--surface)',
                border:`1px solid ${a.unlocked?'#7c6cff33':'var(--border)'}`,opacity:a.unlocked?1:0.5}}>
              <span className="text-2xl">{a.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate" style={{color:a.unlocked?'white':'var(--muted)'}}>{a.title}</div>
                <div className="text-xs truncate" style={{color:'var(--muted)'}}>{a.description}</div>
              </div>
              {a.unlocked
                ? <span className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0" style={{background:'#00d4aa22',color:'#00d4aa'}}>✓</span>
                : <span className="shrink-0" style={{color:'var(--dim)'}}>🔒</span>}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
