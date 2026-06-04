import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAnimatedCounter } from '../hooks/useAnimatedCounter'
import { sound } from '../services/soundService'
import type { GameId } from '../types'

interface Props { score:number; gameId:GameId; onPlayAgain:()=>void; onExit:()=>void }

function getGrade(score: number) {
  if (score>=800) return { label:'GENIUS',      color:'#7c6cff', emoji:'🧠', grade:'S+' }
  if (score>=500) return { label:'OUTSTANDING', color:'#ffd166', emoji:'🌟', grade:'A+' }
  if (score>=300) return { label:'EXCELLENT',   color:'#00d4aa', emoji:'✨', grade:'A'  }
  if (score>=150) return { label:'GOOD JOB',    color:'#60a5fa', emoji:'👍', grade:'B+' }
  return              { label:'KEEP GOING',  color:'#f472b6', emoji:'💪', grade:'B'  }
}

export default function GameResultScreen({ score, onPlayAgain, onExit }: Props) {
  const xp     = Math.floor(score/5)
  const iqGain = Math.min(Math.floor(score/50),5)
  const grade  = getGrade(score)
  const animScore = useAnimatedCounter(score, 1600, 300)
  const animXP    = useAnimatedCounter(xp,    1200, 500)

  useEffect(() => {
    if (score >= 300) sound.achievement()
    else sound.gameOver()
  }, [score])

  return (
    <motion.div initial={{opacity:0,scale:0.92}} animate={{opacity:1,scale:1}}
      className="rounded-3xl p-6 md:p-8 text-center relative overflow-hidden"
      style={{background:'var(--card)',border:'1px solid var(--border)'}}>
      <div className="absolute inset-0 pointer-events-none"
        style={{background:`radial-gradient(circle at 50% 30%,${grade.color}12,transparent 65%)`}} />

      <motion.div initial={{scale:0,rotate:-10}} animate={{scale:1,rotate:0}}
        transition={{type:'spring',stiffness:200,delay:0.1}} className="text-5xl mb-2">{grade.emoji}</motion.div>

      <div className="text-xs font-bold tracking-widest mb-1 uppercase" style={{color:grade.color}}>{grade.label}</div>

      <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:'spring',stiffness:150,delay:0.2}}
        className="font-display font-extrabold gradient-text mb-4" style={{fontSize:'clamp(56px,14vw,88px)',lineHeight:1}}>
        {animScore.toLocaleString()}
      </motion.div>

      {/* Reward row */}
      <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:0.35}}
        className="flex justify-center gap-3 mb-6 flex-wrap">
        {[
          {label:'XP Earned',  value:`+${animXP}`,  color:'#7c6cff'},
          {label:'IQ Points',  value:`+${iqGain}`,  color:'#00d4aa'},
          {label:'Grade',      value:grade.grade,   color:grade.color},
        ].map(r=>(
          <div key={r.label} className="px-5 py-3 rounded-2xl text-center"
            style={{background:`${r.color}18`,border:`1px solid ${r.color}44`}}>
            <div className="font-display font-extrabold text-2xl" style={{color:r.color}}>{r.value}</div>
            <div className="text-xs mt-0.5" style={{color:'var(--muted)'}}>{r.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Score bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs mb-1.5" style={{color:'var(--muted)'}}>
          <span>0</span><span>Score out of 1000</span><span>1000</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{background:'var(--dim)'}}>
          <motion.div initial={{width:0}} animate={{width:`${Math.min((score/1000)*100,100)}%`}}
            transition={{duration:1.4,delay:0.4,ease:'easeOut'}}
            className="h-full rounded-full"
            style={{background:`linear-gradient(90deg,${grade.color},${grade.color}88)`}} />
        </div>
      </div>

      <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.5}}
        className="flex gap-3 justify-center flex-wrap">
        <motion.button whileHover={{scale:1.04,boxShadow:'0 0 30px #7c6cff55'}} whileTap={{scale:0.97}}
          onClick={()=>{sound.gameStart();onPlayAgain()}}
          className="btn px-8 py-3.5 rounded-2xl font-bold text-white"
          style={{background:'linear-gradient(135deg,#7c6cff,#5544ee)',fontSize:14}}>
          🔄 Play Again
        </motion.button>
        <motion.button whileHover={{scale:1.04}} whileTap={{scale:0.97}}
          onClick={()=>{sound.click();onExit()}}
          className="btn px-8 py-3.5 rounded-2xl font-bold"
          style={{background:'transparent',border:'2px solid var(--border)',color:'white',fontSize:14}}>
          All Games
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
