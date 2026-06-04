import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScore } from '../../hooks/useScore'
import { sound } from '../../services/soundService'
import GameLayout from '../GameLayout'

interface Target { id:number; x:number; y:number; isTarget:boolean; color:string }

interface Props { onFinish:(s:number)=>void; onExit:()=>void }

export default function FocusChallenge({ onFinish, onExit }: Props) {
  const [targets, setTargets] = useState<Target[]>([])
  const [timeLeft, setTime]   = useState(45)
  const [misses, setMisses]   = useState(0)
  const [hits, setHits]       = useState(0)
  const [feedback, setFB]     = useState<{id:number;ok:boolean}|null>(null)
  const { score, add }        = useScore()
  const idRef                 = useRef(0)
  const timerRef              = useRef<ReturnType<typeof setInterval>|null>(null)

  function spawnTarget() {
    const id = idRef.current++
    const x  = 5 + Math.random()*85
    const y  = 10 + Math.random()*75
    const isTarget = Math.random() > 0.35
    const distractor_colors = ['#ff6b6b44','#ffd16644','#f472b644']
    const color = isTarget ? '#00d4aa' : distractor_colors[Math.floor(Math.random()*3)]
    const t: Target = { id, x, y, isTarget, color }
    setTargets(prev => [...prev.slice(-8), t])
    setTimeout(() => setTargets(prev => prev.filter(t2=>t2.id!==id)), isTarget?2000:3000)
  }

  useEffect(() => {
    timerRef.current = setInterval(() => setTime(p=>{
      if (p<=1){ clearInterval(timerRef.current!); onFinish(score); return 0 }
      return p-1
    }),1000)
    const spawn = setInterval(spawnTarget, 800)
    return () => { clearInterval(timerRef.current!); clearInterval(spawn) }
  }, []) // eslint-disable-line

  const click = useCallback((t: Target) => {
    setFB({id:t.id, ok:t.isTarget})
    if (t.isTarget) { sound.targetHit(); add(30+Math.floor(score/100)); setHits(h=>h+1) }
    else { sound.targetMiss(); setMisses(m=>m+1) }
    setTargets(prev=>prev.filter(t2=>t2.id!==t.id))
    setTimeout(()=>setFB(null),300)
  },[add, score])

  return (
    <GameLayout title="Focus Challenge 🎯" score={score} timerProgress={timeLeft/45} timeLeft={timeLeft} onExit={onExit}>
      <div className="flex justify-between text-xs mb-2 px-2" style={{color:'var(--muted)'}}>
        <span>✅ Hits: <strong style={{color:'#00d4aa'}}>{hits}</strong></span>
        <span style={{color:'var(--muted)'}}>Click <strong style={{color:'white'}}>green circles</strong> only!</span>
        <span>❌ Misses: <strong style={{color:'#ff6b6b'}}>{misses}</strong></span>
      </div>
      <div className="relative rounded-2xl overflow-hidden" style={{height:320,background:'var(--surface)',border:'1px solid var(--border)'}}>
        <AnimatePresence>
          {targets.map(t => (
            <motion.button key={t.id}
              initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0,opacity:0}}
              onClick={()=>click(t)}
              className="absolute rounded-full border-2 cursor-pointer"
              style={{
                left:`${t.x}%`, top:`${t.y}%`,
                width: t.isTarget?40:28, height: t.isTarget?40:28,
                transform:'translate(-50%,-50%)',
                background: t.color,
                borderColor: t.isTarget?'#00d4aa':'transparent',
                boxShadow: t.isTarget?`0 0 15px #00d4aa88`:'none',
              }} />
          ))}
        </AnimatePresence>
        <AnimatePresence>
          {feedback && (
            <motion.div key={feedback.id} initial={{opacity:1,scale:1}} animate={{opacity:0,scale:1.5}} exit={{opacity:0}}
              className="absolute top-4 right-4 font-bold text-lg pointer-events-none"
              style={{color:feedback.ok?'#00d4aa':'#ff6b6b'}}>
              {feedback.ok?'+30':'Miss!'}
            </motion.div>
          )}
        </AnimatePresence>
        {targets.length===0&&<div className="absolute inset-0 flex items-center justify-center text-sm" style={{color:'var(--dim)'}}>Get ready...</div>}
      </div>
    </GameLayout>
  )
}
