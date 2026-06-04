import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameTimer } from '../../hooks/useGameTimer'
import { useScore } from '../../hooks/useScore'
import { sound } from '../../services/soundService'
import GameLayout from '../GameLayout'

interface Analogy { q: string; options: string[]; answer: string; explanation: string }

const ANALOGIES: Analogy[] = [
  { q:'Bird : Fly :: Fish : ?',          options:['Swim','Walk','Crawl','Run'],         answer:'Swim',      explanation:'Bird flies, fish swims' },
  { q:'Doctor : Hospital :: Teacher : ?', options:['Library','School','Office','Lab'],  answer:'School',    explanation:'Where they work' },
  { q:'Hot : Cold :: Day : ?',           options:['Warm','Night','Sun','Light'],        answer:'Night',     explanation:'Opposite pairs' },
  { q:'Book : Read :: Music : ?',        options:['Write','Listen','Play','Watch'],     answer:'Listen',    explanation:'How you consume it' },
  { q:'Pen : Write :: Knife : ?',        options:['Cook','Cut','Stab','Draw'],          answer:'Cut',       explanation:'Function/purpose' },
  { q:'Cat : Kitten :: Dog : ?',         options:['Puppy','Cub','Foal','Calf'],        answer:'Puppy',     explanation:'Adult to offspring' },
  { q:'Eye : See :: Ear : ?',            options:['Hear','Smell','Touch','Taste'],     answer:'Hear',      explanation:'Sense organs' },
  { q:'Fast : Slow :: Big : ?',          options:['Huge','Tiny','Small','Little'],     answer:'Small',     explanation:'Antonym pairs' },
  { q:'Keyboard : Type :: Camera : ?',   options:['Record','Film','Shoot','Click'],    answer:'Shoot',     explanation:'Primary function' },
  { q:'Forest : Trees :: Ocean : ?',     options:['Water','Fish','Waves','Sand'],      answer:'Water',     explanation:'Composed of' },
  { q:'Pilot : Plane :: Captain : ?',    options:['Ship','Train','Car','Bus'],         answer:'Ship',      explanation:'Who commands what' },
  { q:'Hunger : Eat :: Thirst : ?',      options:['Sleep','Drink','Rest','Swim'],      answer:'Drink',     explanation:'Problem to solution' },
]

let used: number[] = []
function pick(): Analogy {
  if (used.length>=ANALOGIES.length) used=[]
  const avail = ANALOGIES.map((_,i)=>i).filter(i=>!used.includes(i))
  const idx=avail[Math.floor(Math.random()*avail.length)]; used.push(idx)
  return ANALOGIES[idx]
}

interface Props { onFinish:(s:number)=>void; onExit:()=>void }

export default function Analogies({ onFinish, onExit }: Props) {
  const [analogy, setAnal]  = useState<Analogy>(pick)
  const [selected, setSel]  = useState<string|null>(null)
  const [feedback, setFB]   = useState<'correct'|'wrong'|null>(null)
  const { score, add }      = useScore()
  const timer = useGameTimer(25, () => onFinish(score))
  useEffect(() => { timer.start() }, []) // eslint-disable-line

  const choose = useCallback((opt: string) => {
    if (selected) return; setSel(opt)
    if (opt===analogy.answer) { sound.correct(); add(timer.timeLeft*6+35); setFB('correct') } else { sound.wrong(); setFB('wrong') }
    setTimeout(() => { setAnal(pick()); setSel(null); setFB(null); timer.reset(); timer.start() }, 1000)
  }, [selected, analogy.answer, timer, add])

  return (
    <GameLayout title="Analogies 🧠" score={score} timerProgress={timer.progress} timeLeft={timer.timeLeft} onExit={onExit}>
      <div className="text-center text-sm mb-6" style={{color:'var(--muted)'}}>Complete the <strong style={{color:'white'}}>analogy</strong></div>
      <motion.div key={analogy.q} initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}}
        className="text-center mb-8">
        <div className="font-display font-bold px-6 py-5 rounded-2xl"
          style={{fontSize:26,background:'var(--surface)',border:'2px solid var(--border)',color:'white'}}>
          {analogy.q}
        </div>
      </motion.div>
      <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
        {analogy.options.map(opt => (
          <motion.button key={opt} whileHover={!selected?{scale:1.04}:{}} whileTap={!selected?{scale:0.96}:{}}
            disabled={!!selected} onClick={()=>choose(opt)}
            className="py-5 rounded-2xl font-bold text-lg border-2"
            style={{
              background: opt===analogy.answer&&feedback?'#00d4aa22':selected===opt&&feedback==='wrong'?'#ff6b6b22':'var(--surface)',
              borderColor: opt===analogy.answer&&feedback?'#00d4aa':selected===opt&&feedback==='wrong'?'#ff6b6b':'var(--border)',
              color:'white',
            }}>
            {opt}
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {feedback && (
          <motion.div key={feedback} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="text-center mt-4 font-bold text-sm"
            style={{color:feedback==='correct'?'#00d4aa':'#ff6b6b'}}>
            {feedback==='correct'?`✅ Correct! ${analogy.explanation}`:`❌ Answer: ${analogy.answer} — ${analogy.explanation}`}
          </motion.div>
        )}
      </AnimatePresence>
    </GameLayout>
  )
}
