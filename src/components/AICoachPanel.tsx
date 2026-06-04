import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sound } from '../services/soundService'
import type { PlayerStats } from '../types'

interface Props { stats: PlayerStats }

function generateInsight(stats: PlayerStats): { text: string; strongest: string; weakest: string } {
  const { skills, gamesPlayed, dayStreak } = stats
  const entries = Object.entries(skills) as [string,number][]
  const sorted  = [...entries].sort((a,b)=>b[1]-a[1])
  const strongest = sorted[0]
  const weakest   = sorted[sorted.length-1]
  const fmt = (k:string) => k.replace(/([A-Z])/g,' $1').toLowerCase()

  const gameRec: Record<string,string> = {
    workingMemory:'Memory Matrix & Number Recall', processingSpeed:'Math Blitz',
    fluidReasoning:'Pattern IQ & Logic Series', attentionFocus:'Stroop & Focus Challenge',
    verbalAbility:'Word Chain & Analogies', visualSpatial:'Color Memory',
    logicReasoning:'Debug Challenge & Algorithm Puzzle'
  }

  const insights = [
    `Your ${fmt(weakest[0])} (${weakest[1]}/100) needs work. Play ${gameRec[weakest[0]]||'more games'} to strengthen it.`,
    `You're strongest in ${fmt(strongest[0])} (${strongest[1]}/100). Keep it sharp with daily practice.`,
    dayStreak>=7 ? `🔥 ${dayStreak}-day streak! Research shows consistent training creates lasting neural pathways.`
    : `Try to play daily — even 10 minutes of focused brain training shows measurable IQ gains over time.`,
    gamesPlayed > 10 ? `With ${gamesPlayed} games played, your cognitive baseline is forming. Consistency is everything.`
    : `Play all 14 game types to get a complete cognitive profile across all brain areas.`,
  ]

  return {
    text: insights[Math.floor(Date.now()/30000) % insights.length],
    strongest: `${fmt(strongest[0])} · ${strongest[1]}/100`,
    weakest:   `${fmt(weakest[0])} · ${weakest[1]}/100`,
  }
}

export default function AICoachPanel({ stats }: Props) {
  const [visible, setVisible] = useState(false)
  const [typing,  setTyping]  = useState(false)
  const [shown,   setShown]   = useState('')
  const insight = generateInsight(stats)

  useEffect(() => {
    if (!visible) return
    setShown(''); setTyping(true)
    let i = 0
    const t = setInterval(() => {
      setShown(insight.text.slice(0, ++i))
      if (i >= insight.text.length) { clearInterval(t); setTyping(false) }
    }, 16)
    return () => clearInterval(t)
  }, [visible, insight.text])

  return (
    <div className="mb-4">
      <motion.button whileHover={{scale:1.005}} whileTap={{scale:0.995}}
        onClick={()=>{ sound.click(); setVisible(v=>!v) }}
        className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl"
        style={{background:'var(--card)',border:'1px solid var(--border)'}}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
            style={{background:'linear-gradient(135deg,#7c6cff,#00d4aa)'}}>🤖</div>
          <div className="text-left">
            <div className="font-bold text-sm">NeuroCoach AI</div>
            <div className="text-xs" style={{color:'var(--muted)'}}>
              Strongest: <span style={{color:'#00d4aa'}}>{insight.strongest}</span>
            </div>
          </div>
        </div>
        <motion.span animate={{rotate:visible?180:0}} style={{color:'var(--muted)'}}>▾</motion.span>
      </motion.button>

      <AnimatePresence>
        {visible && (
          <motion.div key="coach" initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}}
            exit={{opacity:0,height:0}} className="overflow-hidden">
            <div className="mt-2 p-5 rounded-2xl" style={{background:'#08081a',border:'1px solid #7c6cff33'}}>
              {/* Message */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5"
                  style={{background:'linear-gradient(135deg,#7c6cff,#00d4aa)'}}>🧠</div>
                <div>
                  <div className="text-xs font-bold mb-1" style={{color:'#7c6cff'}}>NeuroCoach</div>
                  <p className="text-sm leading-relaxed" style={{color:'#ccccea'}}>
                    {shown}<span style={{opacity:typing?1:0,color:'#7c6cff'}}>|</span>
                  </p>
                </div>
                {typing && (
                  <div className="flex gap-1 mt-2 ml-auto shrink-0">
                    {[0,1,2].map(i=>(
                      <motion.div key={i} animate={{opacity:[0.3,1,0.3]}}
                        transition={{repeat:Infinity,duration:1,delay:i*0.2}}
                        className="w-1.5 h-1.5 rounded-full" style={{background:'#7c6cff'}}/>
                    ))}
                  </div>
                )}
              </div>

              {/* Needs improvement */}
              <div className="flex gap-2 mb-4">
                <div className="flex-1 p-3 rounded-xl" style={{background:'#ff6b6b11',border:'1px solid #ff6b6b33'}}>
                  <div className="text-xs mb-1" style={{color:'var(--muted)'}}>📈 Needs improvement</div>
                  <div className="text-sm font-bold capitalize" style={{color:'#ff6b6b'}}>{insight.weakest}</div>
                </div>
                <div className="flex-1 p-3 rounded-xl" style={{background:'#00d4aa11',border:'1px solid #00d4aa33'}}>
                  <div className="text-xs mb-1" style={{color:'var(--muted)'}}>💪 Your strength</div>
                  <div className="text-sm font-bold capitalize" style={{color:'#00d4aa'}}>{insight.strongest}</div>
                </div>
              </div>

              {/* All skill bars */}
              <div className="space-y-2">
                {(Object.entries(stats.skills) as [string,number][]).map(([key,val])=>(
                  <div key={key} className="flex items-center gap-2">
                    <div className="text-xs w-28 truncate capitalize" style={{color:'var(--muted)'}}>
                      {key.replace(/([A-Z])/g,' $1')}
                    </div>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{background:'var(--dim)'}}>
                      <motion.div initial={{width:0}} animate={{width:`${val}%`}} transition={{duration:1,ease:'easeOut'}}
                        className="h-full rounded-full"
                        style={{background:val>=75?'#00d4aa':val>=50?'#7c6cff':'#ff6b6b'}}/>
                    </div>
                    <div className="text-xs w-6 text-right font-bold"
                      style={{color:val>=75?'#00d4aa':val>=50?'#7c6cff':'#ff6b6b'}}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
