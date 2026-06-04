import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameTimer } from '../../hooks/useGameTimer'
import { useScore } from '../../hooks/useScore'
import { sound } from '../../services/soundService'
import GameLayout from '../GameLayout'

interface Round { items: string[]; odd: string; hint: string }

const ROUNDS: Round[] = [
  { items:['Apple','Banana','Mango','Car'],      odd:'Car',      hint:'Not a fruit' },
  { items:['Paris','London','Berlin','Amazon'],  odd:'Amazon',   hint:'Not a capital city' },
  { items:['2','4','7','8'],                    odd:'7',        hint:'Not even' },
  { items:['Dog','Cat','Eagle','Fish'],          odd:'Eagle',    hint:'Not a pet / has wings' },
  { items:['Red','Blue','Fast','Green'],         odd:'Fast',     hint:'Not a color' },
  { items:['Piano','Guitar','Brush','Violin'],   odd:'Brush',    hint:'Not a musical instrument' },
  { items:['1','3','5','8'],                    odd:'8',        hint:'Not odd number' },
  { items:['Sun','Moon','Star','River'],         odd:'River',    hint:'Not in the sky' },
  { items:['Square','Circle','Triangle','Cube'], odd:'Cube',     hint:'Not 2D shape' },
  { items:['Oxygen','Nitrogen','Gold','Carbon'], odd:'Gold',     hint:'Not a gas at room temp' },
  { items:['Run','Jump','Sleep','Swim'],         odd:'Sleep',    hint:'Not an active exercise' },
  { items:['Rose','Lily','Oak','Daisy'],         odd:'Oak',      hint:'Not a flower' },
  { items:['3','6','9','10'],                   odd:'10',       hint:'Not divisible by 3' },
  { items:['Python','Java','HTML','C++'],        odd:'HTML',     hint:'Not a programming language' },
  { items:['Mercury','Venus','Moon','Mars'],     odd:'Moon',     hint:'Not a planet' },
]

let usedIdx: number[] = []

function pick(): Round {
  if (usedIdx.length >= ROUNDS.length) usedIdx = []
  const avail = ROUNDS.map((_,i)=>i).filter(i=>!usedIdx.includes(i))
  const idx = avail[Math.floor(Math.random()*avail.length)]
  usedIdx.push(idx)
  return ROUNDS[idx]
}

interface Props { onFinish:(s:number)=>void; onExit:()=>void }

export default function OddOneOut({ onFinish, onExit }: Props) {
  const [round, setRound]   = useState<Round>(pick)
  const [selected, setSel]  = useState<string|null>(null)
  const [feedback, setFB]   = useState<'correct'|'wrong'|null>(null)
  const [showHint, setHint] = useState(false)
  const { score, add }      = useScore()
  const timer = useGameTimer(30, () => onFinish(score))

  useEffect(() => { timer.start() }, []) // eslint-disable-line

  const choose = useCallback((item: string) => {
    if (selected) return
    setSel(item)
    if (item === round.odd) {
      const pts = timer.timeLeft*6+40; sound.correct(); add(pts); setFB('correct')
    } else { sound.wrong(); setFB('wrong') }
    setTimeout(() => {
      setRound(pick()); setSel(null); setFB(null); setHint(false)
      timer.reset(); timer.start()
    }, 900)
  }, [selected, round.odd, timer, add])

  return (
    <GameLayout title="Odd One Out 🔍" score={score} timerProgress={timer.progress} timeLeft={timer.timeLeft} onExit={onExit}>
      <div className="text-center text-sm mb-6" style={{color:'var(--muted)'}}>
        Which one <strong style={{color:'white'}}>doesn't belong</strong>?
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto mb-6">
        {round.items.map(item => (
          <motion.button key={item} whileHover={!selected?{scale:1.04}:{}} whileTap={!selected?{scale:0.96}:{}}
            disabled={!!selected} onClick={()=>choose(item)}
            className="py-5 rounded-2xl font-bold text-base border-2 transition-all"
            style={{
              background: selected===item&&feedback==='correct' ? '#00d4aa22'
                        : item===round.odd&&feedback==='wrong'  ? '#00d4aa22'
                        : selected===item&&feedback==='wrong'   ? '#ff6b6b22'
                        : 'var(--surface)',
              borderColor: selected===item&&feedback==='correct' ? '#00d4aa'
                         : item===round.odd&&feedback==='wrong'  ? '#00d4aa'
                         : selected===item&&feedback==='wrong'   ? '#ff6b6b'
                         : 'var(--border)',
              color:'white',
            }}>
            {item}
          </motion.button>
        ))}
      </div>

      <div className="flex justify-center mb-4">
        <button onClick={()=>setHint(true)} className="text-xs px-3 py-1.5 rounded-full"
          style={{background:'#ffffff0a',border:'1px solid var(--border)',color:'var(--muted)'}}>
          💡 Hint (-10pts)
        </button>
      </div>
      {showHint && <div className="text-center text-sm" style={{color:'#ffd166'}}>Hint: {round.hint}</div>}

      <AnimatePresence>
        {feedback && (
          <motion.div key={feedback} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="text-center mt-3 text-xl font-bold"
            style={{color:feedback==='correct'?'#00d4aa':'#ff6b6b'}}>
            {feedback==='correct'?`✅ Correct! Odd one: ${round.odd}`:`❌ It was: ${round.odd}`}
          </motion.div>
        )}
      </AnimatePresence>
    </GameLayout>
  )
}
