import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameTimer } from '../../hooks/useGameTimer'
import { useScore } from '../../hooks/useScore'
import { sound } from '../../services/soundService'
import GameLayout from '../GameLayout'

interface Puzzle { sequence: string; options: string[]; answer: string; explanation: string }

const PUZZLES: Puzzle[] = [
  { sequence:'2, 4, 8, 16, ?',         options:['24','32','30','28'],        answer:'32',    explanation:'×2 each time' },
  { sequence:'1, 1, 2, 3, 5, 8, ?',   options:['11','12','13','14'],        answer:'13',    explanation:'Fibonacci sequence' },
  { sequence:'3, 6, 9, 12, ?',         options:['14','15','16','18'],        answer:'15',    explanation:'+3 each time' },
  { sequence:'100, 50, 25, ?',         options:['10','12','12.5','15'],      answer:'12.5',  explanation:'÷2 each time' },
  { sequence:'1, 4, 9, 16, 25, ?',    options:['30','36','35','32'],        answer:'36',    explanation:'Perfect squares: 6²=36' },
  { sequence:'2, 3, 5, 7, 11, ?',     options:['12','13','14','15'],        answer:'13',    explanation:'Prime numbers' },
  { sequence:'5, 10, 20, 40, ?',       options:['60','70','80','90'],        answer:'80',    explanation:'×2 each time' },
  { sequence:'A, C, E, G, ?',          options:['H','I','J','K'],           answer:'I',     explanation:'Every other letter +2' },
  { sequence:'1, 8, 27, 64, ?',        options:['100','121','125','130'],    answer:'125',   explanation:'Cubes: 5³=125' },
  { sequence:'10, 9, 7, 4, ?',         options:['-1','0','1','2'],          answer:'0',     explanation:'-1,-2,-3,-4' },
  { sequence:'2, 6, 12, 20, ?',        options:['28','30','32','36'],        answer:'30',    explanation:'+4,+6,+8,+10' },
  { sequence:'Z, X, V, T, ?',          options:['S','R','Q','P'],           answer:'R',     explanation:'Every other letter -2' },
]

let used: number[] = []
function pick(): Puzzle {
  if (used.length>=PUZZLES.length) used=[]
  const avail = PUZZLES.map((_,i)=>i).filter(i=>!used.includes(i))
  const idx=avail[Math.floor(Math.random()*avail.length)]; used.push(idx)
  return PUZZLES[idx]
}

interface Props { onFinish:(s:number)=>void; onExit:()=>void }

export default function LogicSeries({ onFinish, onExit }: Props) {
  const [puzzle, setPuzzle] = useState<Puzzle>(pick)
  const [selected, setSel]  = useState<string|null>(null)
  const [feedback, setFB]   = useState<'correct'|'wrong'|null>(null)
  const { score, add }      = useScore()
  const timer = useGameTimer(30, () => onFinish(score))
  useEffect(() => { timer.start() }, []) // eslint-disable-line

  const choose = useCallback((opt: string) => {
    if (selected) return; setSel(opt)
    if (opt===puzzle.answer) { sound.logicSolve(); add(timer.timeLeft*7+40); setFB('correct') } else { sound.wrong(); setFB('wrong') }
    setTimeout(() => { setPuzzle(pick()); setSel(null); setFB(null); timer.reset(); timer.start() }, 1000)
  }, [selected, puzzle.answer, timer, add])

  return (
    <GameLayout title="Logic Series 📐" score={score} timerProgress={timer.progress} timeLeft={timer.timeLeft} onExit={onExit}>
      <div className="text-center text-sm mb-6" style={{color:'var(--muted)'}}>Find the <strong style={{color:'white'}}>next number</strong> in the sequence</div>
      <motion.div key={puzzle.sequence} initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}
        className="text-center mb-8">
        <div className="font-display font-extrabold px-6 py-5 rounded-2xl inline-block"
          style={{fontSize:32,background:'#7c6cff11',border:'2px solid #7c6cff33',color:'white',letterSpacing:2}}>
          {puzzle.sequence}
        </div>
      </motion.div>
      <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
        {puzzle.options.map(opt => (
          <motion.button key={opt} whileHover={!selected?{scale:1.04}:{}} whileTap={!selected?{scale:0.96}:{}}
            disabled={!!selected} onClick={()=>choose(opt)}
            className="py-5 rounded-2xl font-display font-bold text-2xl border-2"
            style={{
              background: opt===puzzle.answer&&feedback?'#00d4aa22':selected===opt&&feedback==='wrong'?'#ff6b6b22':'var(--surface)',
              borderColor: opt===puzzle.answer&&feedback?'#00d4aa':selected===opt&&feedback==='wrong'?'#ff6b6b':'var(--border)',
              color:'white',
            }}>
            {opt}
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {feedback && (
          <motion.div key={feedback} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}}
            className="text-center mt-4 font-bold"
            style={{color:feedback==='correct'?'#00d4aa':'#ff6b6b'}}>
            {feedback==='correct'?`✅ Correct! ${puzzle.explanation}`:`❌ Answer: ${puzzle.answer} — ${puzzle.explanation}`}
          </motion.div>
        )}
      </AnimatePresence>
    </GameLayout>
  )
}
