import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScore } from '../../hooks/useScore'
import { sound } from '../../services/soundService'
import GameLayout from '../GameLayout'

type Phase = 'show' | 'hide' | 'input' | 'result'

interface Props { onFinish:(s:number)=>void; onExit:()=>void }

export default function NumberRecall({ onFinish, onExit }: Props) {
  const [level, setLevel]   = useState(1)
  const [number, setNumber] = useState('')
  const [phase, setPhase]   = useState<Phase>('show')
  const [input, setInput]   = useState('')
  const [feedback, setFB]   = useState<'correct'|'wrong'|null>(null)
  const [timeLeft, setTime] = useState(60)
  const { score, add }      = useScore()

  const digits = 4 + level

  function genNumber(d: number) {
    return Array.from({length:d}, () => Math.floor(Math.random()*10)).join('')
  }

  function nextRound() {
    const n = genNumber(digits)
    setNumber(n); setInput(''); setFB(null); sound.numberShow(); setPhase('show')
    setTimeout(() => setPhase('hide'), 1500 + level*200)
    setTimeout(() => { sound.numberHide(); setPhase('input') }, 1700 + level*200)
  }

  useEffect(() => { nextRound() }, [level]) // eslint-disable-line

  useEffect(() => {
    const t = setInterval(() => setTime(p => { if(p<=1){clearInterval(t);onFinish(score);return 0} return p-1 }),1000)
    return () => clearInterval(t)
  }, []) // eslint-disable-line

  const submit = useCallback(() => {
    if (input === number) {
      sound.numberRight(); add(digits*40 + 20); setFB('correct')
      setTimeout(() => setLevel(l=>Math.min(l+1,8)), 600)
    } else {
      sound.numberWrong(); setFB('wrong')
      setTimeout(nextRound, 1000)
    }
  }, [input, number, digits, add]) // eslint-disable-line

  return (
    <GameLayout title="Number Recall 🔢" score={score} timerProgress={timeLeft/60} timeLeft={timeLeft} onExit={onExit}>
      <div className="text-center mb-4 text-xs uppercase tracking-widest" style={{color:'var(--muted)'}}>
        Level {level} • {digits} digits
      </div>
      <div className="flex flex-col items-center gap-6">
        <AnimatePresence mode="wait">
          {phase === 'show' && (
            <motion.div key="show" initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:1.1}}
              className="font-display font-extrabold tracking-widest px-8 py-6 rounded-2xl"
              style={{fontSize:48,background:'#7c6cff22',border:'2px solid #7c6cff44',color:'#7c6cff',letterSpacing:8}}>
              {number}
            </motion.div>
          )}
          {phase === 'hide' && (
            <motion.div key="hide" initial={{opacity:1}} animate={{opacity:0}} transition={{duration:0.3}}
              className="font-display font-extrabold px-8 py-6 rounded-2xl"
              style={{fontSize:48,background:'var(--surface)',color:'var(--dim)',letterSpacing:8}}>
              {'•'.repeat(digits)}
            </motion.div>
          )}
          {phase === 'input' && (
            <motion.div key="input" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="w-full max-w-xs">
              <p className="text-center text-sm mb-3" style={{color:'var(--muted)'}}>Type the number you saw:</p>
              <input value={input} onChange={e=>setInput(e.target.value.replace(/\D/g,'').slice(0,digits))}
                onKeyDown={e=>e.key==='Enter'&&submit()}
                className="w-full text-center text-3xl font-display font-bold py-4 rounded-2xl"
                style={{background:'var(--surface)',border:'2px solid var(--border)',color:'white',outline:'none',letterSpacing:6}}
                autoFocus maxLength={digits} inputMode="numeric"
                onFocus={e=>e.target.style.borderColor='#7c6cff'}
                onBlur={e=>e.target.style.borderColor='var(--border)'} />
              <motion.button whileTap={{scale:0.97}} onClick={submit}
                className="w-full mt-3 py-3 rounded-2xl font-bold text-white"
                style={{background:'linear-gradient(135deg,#7c6cff,#00d4aa)',border:'none'}}>
                Submit →
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {feedback && (
            <motion.div key={feedback} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}}
              className="text-xl font-bold"
              style={{color:feedback==='correct'?'#00d4aa':'#ff6b6b'}}>
              {feedback==='correct' ? `✅ Correct! +${digits*40+20}` : `❌ It was: ${number}`}
            </motion.div>
          )}
        </AnimatePresence>
        {phase==='show' && <p className="text-sm" style={{color:'var(--muted)'}}>Memorize this number!</p>}
      </div>
    </GameLayout>
  )
}
