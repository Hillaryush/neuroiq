import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import { buildResult } from '../services/scoreService'
import { sound } from '../services/soundService'

const QUESTIONS = [
  {q:'What is 17 × 8?',                           opts:['126','136','146','156'], ans:'136'},
  {q:'Bird : Fly :: Fish : ?',                     opts:['Swim','Walk','Crawl','Jump'],  ans:'Swim'},
  {q:'2, 4, 8, 16, ?',                             opts:['28','32','30','24'],     ans:'32'},
  {q:'Odd one out: Apple, Banana, Car, Mango',     opts:['Apple','Banana','Car','Mango'],ans:'Car'},
  {q:'"GREEN" written in red ink — what color?',   opts:['Green','Red','Blue','Yellow'], ans:'Red'},
]

export default function DailyChallenge() {
  const { recordResult } = useAppStore()
  const today   = new Date().toDateString()
  const isDone  = localStorage.getItem('daily-done') === today
  const [open, setOpen]     = useState(false)
  const [idx,  setIdx]      = useState(0)
  const [score,setScore]    = useState(0)
  const [sel,  setSel]      = useState<string|null>(null)
  const [done, setDone]     = useState(isDone)
  const [finish,setFinish]  = useState(false)

  // Listen for hero button
  useEffect(()=>{
    const h = ()=>{ if(!done)setOpen(true) }
    window.addEventListener('open-daily',h)
    return ()=>window.removeEventListener('open-daily',h)
  },[done])

  function answer(opt:string) {
    if(sel) return; setSel(opt)
    const ok = opt===QUESTIONS[idx].ans
    if(ok){sound.correct();setScore(s=>s+100)}else sound.wrong()
    setTimeout(()=>{
      setSel(null)
      if(idx+1>=QUESTIONS.length){
        setFinish(true); setDone(true)
        localStorage.setItem('daily-done',today)
        recordResult(buildResult('math',score+(ok?100:0)))
        sound.levelUp()
      } else setIdx(i=>i+1)
    },700)
  }

  const q = QUESTIONS[idx]

  return (
    <div className="mb-4">
      {/* Banner */}
      <motion.button whileHover={{scale:1.005}} whileTap={{scale:0.998}}
        onClick={()=>{if(!done){sound.click();setOpen(v=>!v)}}}
        className="w-full flex items-center justify-between px-5 py-4 rounded-2xl relative overflow-hidden"
        style={{background:done?'#00d4aa0d':'linear-gradient(135deg,#ffd16610,#7c6cff10)',
          border:`2px solid ${done?'#00d4aa44':'#ffd16666'}`,cursor:done?'default':'pointer'}}>
        {!done && <div className="absolute inset-0 animate-shimmer pointer-events-none" />}
        <div className="flex items-center gap-3">
          <span className="text-2xl">{done?'✅':'🔥'}</span>
          <div className="text-left">
            <div className="font-bold text-sm" style={{color:done?'#00d4aa':'#ffd166'}}>
              Daily Challenge — {done?'Completed!':'Available Now!'}
            </div>
            <div className="text-xs mt-0.5" style={{color:'var(--muted)'}}>
              Reward: <strong style={{color:'#7c6cff'}}>+150 XP</strong> + <strong style={{color:'#00d4aa'}}>+25 IQ Score</strong>
            </div>
          </div>
        </div>
        {!done && <span className="text-xs font-bold px-3 py-1 rounded-full animate-pulse"
          style={{background:'#ffd16622',color:'#ffd166',border:'1px solid #ffd16655'}}>
          TAP TO PLAY
        </span>}
      </motion.button>

      {/* Quiz panel */}
      <AnimatePresence>
        {open && !done && (
          <motion.div key="quiz" initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}}
            exit={{opacity:0,height:0}} className="overflow-hidden">
            <div className="mt-2 p-5 rounded-2xl" style={{background:'var(--card)',border:'1px solid #ffd16633'}}>
              {finish ? (
                <motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} className="text-center py-4">
                  <div className="text-5xl mb-3">🎉</div>
                  <div className="font-display font-extrabold text-3xl gradient-text">{score}/500</div>
                  <div className="text-sm mt-2" style={{color:'var(--muted)'}}>Daily complete! Come back tomorrow.</div>
                  <div className="mt-2 font-bold" style={{color:'#00d4aa'}}>+{Math.floor(score/5)} XP earned!</div>
                </motion.div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs uppercase tracking-widest" style={{color:'var(--muted)'}}>Question {idx+1}/5</span>
                    <div className="flex gap-1.5">
                      {Array(5).fill(0).map((_,i)=>(
                        <div key={i} className="h-1.5 rounded-full transition-all" style={{
                          width: i<idx?20:i===idx?28:16,
                          background:i<idx?'#00d4aa':i===idx?'#ffd166':'var(--dim)'}} />
                      ))}
                    </div>
                  </div>
                  <p className="font-bold text-base mb-5 text-center leading-snug">{q.q}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {q.opts.map(opt=>(
                      <motion.button key={opt} whileTap={{scale:0.96}} onClick={()=>answer(opt)} disabled={!!sel}
                        className="py-3.5 rounded-2xl text-sm font-bold border-2 transition-all"
                        style={{background:opt===q.ans&&sel?'#00d4aa22':sel===opt&&sel!==q.ans?'#ff6b6b22':'var(--surface)',
                          borderColor:opt===q.ans&&sel?'#00d4aa':sel===opt&&sel!==q.ans?'#ff6b6b':'var(--border)',color:'white'}}>
                        {opt}
                      </motion.button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
