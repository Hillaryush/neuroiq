import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameTimer } from '../../hooks/useGameTimer'
import { useScore } from '../../hooks/useScore'
import { sound } from '../../services/soundService'
import GameLayout from '../GameLayout'

interface Bug { code: string; bugLine: number; options: string[]; answer: string; explanation: string }

const BUGS: Bug[] = [
  {
    code:`for i in range(5):\n  print(i)\nprint("Sum:", i)`,
    bugLine:2, options:['i is undefined','Should use range(6)','print needs quotes','Missing colon'],
    answer:'i is undefined', explanation:'i is only in loop scope in some languages, and sum is wrong anyway'
  },
  {
    code:`def add(a, b):\n  return a - b\n\nresult = add(3, 4)`,
    bugLine:1, options:['Wrong function name','Should be a + b','Missing return','Wrong params'],
    answer:'Should be a + b', explanation:'Subtraction instead of addition'
  },
  {
    code:`arr = [1, 2, 3, 4, 5]\nprint(arr[5])`,
    bugLine:1, options:['Wrong variable','Index out of range','Missing brackets','Syntax error'],
    answer:'Index out of range', explanation:'Array has 5 elements (0-4), index 5 is invalid'
  },
  {
    code:`x = 10\nif x = 10:\n  print("Ten")`,
    bugLine:1, options:['Wrong indentation','Should use ==','Missing colon','Wrong variable'],
    answer:'Should use ==', explanation:'= is assignment, == is comparison'
  },
  {
    code:`count = 0\nwhile count < 5:\n  print(count)\ncount += 1`,
    bugLine:3, options:['Wrong condition','count++ not valid','count += 1 is outside loop','Missing break'],
    answer:'count += 1 is outside loop', explanation:'Increment must be inside the while loop'
  },
  {
    code:`def greet(name):\n  return "Hello " + name\n\ngreet("World")`,
    bugLine:3, options:['Missing print()','Wrong string','name is undefined','Wrong function'],
    answer:'Missing print()', explanation:'Function returns value but it is never printed'
  },
  {
    code:`nums = [1,2,3]\nfor num in nums\n  print(num)`,
    bugLine:1, options:['Missing colon after for','nums is wrong','Should be range()','Wrong variable'],
    answer:'Missing colon after for', explanation:'for...in statement requires a colon at end'
  },
]

let used: number[] = []
function pick(): Bug {
  if (used.length>=BUGS.length) used=[]
  const avail=BUGS.map((_,i)=>i).filter(i=>!used.includes(i))
  const idx=avail[Math.floor(Math.random()*avail.length)]; used.push(idx)
  return BUGS[idx]
}

interface Props { onFinish:(s:number)=>void; onExit:()=>void }

export default function DebugChallenge({ onFinish, onExit }: Props) {
  const [bug, setBug]       = useState<Bug>(pick)
  const [selected, setSel]  = useState<string|null>(null)
  const [feedback, setFB]   = useState<'correct'|'wrong'|null>(null)
  const { score, add }      = useScore()
  const timer = useGameTimer(35, () => onFinish(score))
  useEffect(() => { timer.start() }, []) // eslint-disable-line

  const choose = useCallback((opt: string) => {
    if (selected) return; setSel(opt)
    if (opt===bug.answer) { sound.bugFound(); add(timer.timeLeft*8+50); setFB('correct') } else { sound.wrong(); setFB('wrong') }
    setTimeout(()=>{ setBug(pick()); setSel(null); setFB(null); timer.reset(); timer.start() },1200)
  },[selected, bug.answer, timer, add])

  return (
    <GameLayout title="Debug Challenge 🐛" score={score} timerProgress={timer.progress} timeLeft={timer.timeLeft} onExit={onExit}>
      <div className="text-center text-sm mb-4" style={{color:'var(--muted)'}}>Find the <strong style={{color:'#ff6b6b'}}>bug</strong> in this code:</div>
      <div className="rounded-2xl p-4 mb-5 font-mono text-sm" style={{background:'#0d0d14',border:'1px solid #2a2a3a',color:'#e2e8f0',lineHeight:1.8}}>
        {bug.code.split('\n').map((line, i) => (
          <div key={i} className="flex gap-3" style={{background:i===bug.bugLine?'#ff6b6b11':'transparent',borderLeft:i===bug.bugLine?'3px solid #ff6b6b':'3px solid transparent',paddingLeft:8}}>
            <span style={{color:'#44445a',userSelect:'none',minWidth:16}}>{i+1}</span>
            <span style={{color:i===bug.bugLine?'#fca5a5':'#e2e8f0'}}>{line}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-2">
        {bug.options.map(opt=>(
          <motion.button key={opt} whileHover={!selected?{x:4}:{}} whileTap={!selected?{scale:0.98}:{}}
            disabled={!!selected} onClick={()=>choose(opt)}
            className="py-3 px-4 rounded-xl text-sm font-semibold text-left border"
            style={{
              background: opt===bug.answer&&feedback?'#00d4aa22':selected===opt&&feedback==='wrong'?'#ff6b6b22':'var(--surface)',
              borderColor: opt===bug.answer&&feedback?'#00d4aa':selected===opt&&feedback==='wrong'?'#ff6b6b':'var(--border)',
              color:'white',
            }}>
            🔍 {opt}
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {feedback && (
          <motion.div key={feedback} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="text-center mt-3 text-sm font-bold"
            style={{color:feedback==='correct'?'#00d4aa':'#ff6b6b'}}>
            {feedback==='correct'?`✅ Found it! ${bug.explanation}`:`❌ Bug: ${bug.answer}`}
          </motion.div>
        )}
      </AnimatePresence>
    </GameLayout>
  )
}
