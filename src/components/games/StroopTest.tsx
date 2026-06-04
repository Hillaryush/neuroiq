import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameTimer } from '../../hooks/useGameTimer'
import { useScore } from '../../hooks/useScore'
import { sound } from '../../services/soundService'
import GameLayout from '../GameLayout'

const COLORS = [
  { name:'RED',    hex:'#ef4444' },
  { name:'BLUE',   hex:'#3b82f6' },
  { name:'GREEN',  hex:'#22c55e' },
  { name:'YELLOW', hex:'#eab308' },
  { name:'PURPLE', hex:'#a855f7' },
  { name:'ORANGE', hex:'#f97316' },
]

function genRound() {
  const word  = COLORS[Math.floor(Math.random()*COLORS.length)]
  let color   = COLORS[Math.floor(Math.random()*COLORS.length)]
  while (color.name === word.name) color = COLORS[Math.floor(Math.random()*COLORS.length)]
  return { word: word.name, color }
}

interface Props { onFinish:(s:number)=>void; onExit:()=>void }

export default function StroopTest({ onFinish, onExit }: Props) {
  const [round, setRound]     = useState(genRound)
  const [answered, setAns]    = useState(false)
  const [feedback, setFB]     = useState<'correct'|'wrong'|null>(null)
  const [combo, setCombo]     = useState(0)
  const { score, add }        = useScore()
  const timer = useGameTimer(45, () => onFinish(score))

  useEffect(() => { timer.start() }, []) // eslint-disable-line

  const answer = useCallback((colorName: string) => {
    if (answered) return
    setAns(true)
    if (colorName === round.color.name) {
      const pts = timer.timeLeft*4 + 20 + combo*5
      sound.stroopCorrect(); add(pts); setFB('correct'); setCombo(c=>c+1)
    } else {
      sound.stroopWrong(); setFB('wrong'); setCombo(0)
    }
    setTimeout(() => { setRound(genRound()); setAns(false); setFB(null) }, 500)
  }, [answered, round, timer.timeLeft, combo, add])

  return (
    <GameLayout title="Stroop Challenge 🎨" score={score} timerProgress={timer.progress} timeLeft={timer.timeLeft} onExit={onExit}>
      <div className="text-center mb-2 text-sm" style={{color:'var(--muted)'}}>
        Name the <strong style={{color:'white'}}>INK COLOR</strong>, not the word!
      </div>
      {combo>=3 && <div className="text-center text-xs font-bold mb-2" style={{color:'#ffd166'}}>🔥 {combo}x combo!</div>}

      <motion.div key={round.word+round.color.name} initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}}
        className="text-center my-8">
        <div className="font-display font-extrabold" style={{fontSize:72,color:round.color.hex,letterSpacing:2}}>
          {round.word}
        </div>
        <div className="text-xs mt-2 uppercase tracking-widest" style={{color:'var(--muted)'}}>
          What color is this text?
        </div>
      </motion.div>

      <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
        {COLORS.map(c => (
          <motion.button key={c.name} whileHover={!answered?{scale:1.05}:{}} whileTap={!answered?{scale:0.95}:{}}
            disabled={answered} onClick={()=>answer(c.name)}
            className="py-3 rounded-2xl font-bold text-sm border-2 transition-all"
            style={{background:`${c.hex}22`,borderColor:`${c.hex}66`,color:c.hex}}>
            {c.name}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div key={feedback} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}}
            className="text-center mt-4 text-xl font-bold"
            style={{color:feedback==='correct'?'#00d4aa':'#ff6b6b'}}>
            {feedback==='correct'?`✅ +${timer.timeLeft*4+20+combo*5}`:'❌ Wrong color!'}
          </motion.div>
        )}
      </AnimatePresence>
    </GameLayout>
  )
}
