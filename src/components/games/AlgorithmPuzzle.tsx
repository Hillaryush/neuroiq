import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useGameTimer } from '../../hooks/useGameTimer'
import { useScore } from '../../hooks/useScore'
import { sound } from '../../services/soundService'
import GameLayout from '../GameLayout'

interface Puzzle { title:string; steps:string[]; shuffled:string[] }

const PUZZLES: Puzzle[] = [
  { title:'Boil Water for Tea',
    steps:['Fill kettle with water','Turn on kettle','Wait for water to boil','Pour into cup with teabag','Let steep 3 minutes'],
    shuffled:['Let steep 3 minutes','Fill kettle with water','Pour into cup with teabag','Turn on kettle','Wait for water to boil'] },
  { title:'Binary Search Algorithm',
    steps:['Set left=0, right=length-1','Calculate mid=(left+right)/2','If target==arr[mid], return mid','If target>arr[mid], left=mid+1 else right=mid-1','Repeat until found or left>right'],
    shuffled:['If target==arr[mid], return mid','Repeat until found or left>right','Set left=0, right=length-1','If target>arr[mid], left=mid+1 else right=mid-1','Calculate mid=(left+right)/2'] },
  { title:'Login Flow',
    steps:['User enters email and password','Validate input fields','Send credentials to server','Server checks database','Return success or error token'],
    shuffled:['Return success or error token','User enters email and password','Server checks database','Validate input fields','Send credentials to server'] },
  { title:'Bubble Sort',
    steps:['Start from index 0','Compare adjacent elements','If left > right, swap them','Move to next pair','Repeat until no swaps needed'],
    shuffled:['Repeat until no swaps needed','Compare adjacent elements','Start from index 0','Move to next pair','If left > right, swap them'] },
  { title:'Making a Sandwich',
    steps:['Get two slices of bread','Spread butter on one side','Add filling ingredients','Put slices together','Slice diagonally and serve'],
    shuffled:['Slice diagonally and serve','Get two slices of bread','Put slices together','Add filling ingredients','Spread butter on one side'] },
]

let used: number[] = []
function pick(): Puzzle {
  if (used.length>=PUZZLES.length) used=[]
  const avail=PUZZLES.map((_,i)=>i).filter(i=>!used.includes(i))
  const idx=avail[Math.floor(Math.random()*avail.length)]; used.push(idx)
  const p=PUZZLES[idx]; return { ...p, shuffled:[...p.shuffled] }
}

interface Props { onFinish:(s:number)=>void; onExit:()=>void }

export default function AlgorithmPuzzle({ onFinish, onExit }: Props) {
  const [puzzle, setPuzzle]   = useState<Puzzle>(pick)
  const [order, setOrder]     = useState<string[]>([...puzzle.shuffled])
  // drag state removed
  const [checked, setChecked] = useState(false)
  const [correct, setCorrect] = useState(false)
  const { score, add }        = useScore()
  const timer = useGameTimer(45, ()=>onFinish(score))
  useEffect(()=>{ timer.start() },[]) // eslint-disable-line

  useEffect(()=>{ setOrder([...puzzle.shuffled]) },[puzzle])

  const moveUp   = (i: number) => { if(i===0)return; sound.stepMoved(); const o=[...order]; [o[i-1],o[i]]=[o[i],o[i-1]]; setOrder(o) }
  const moveDown = (i: number) => { if(i===order.length-1)return; const o=[...order]; [o[i],o[i+1]]=[o[i+1],o[i]]; setOrder(o) }

  const check = useCallback(()=>{
    const ok = order.every((s,i)=>s===puzzle.steps[i])
    setChecked(true); setCorrect(ok)
    if(ok){ sound.algoCorrect(); add(timer.timeLeft*10+80) }
    setTimeout(()=>{ setPuzzle(pick()); setChecked(false); setCorrect(false); timer.reset(); timer.start() },1200)
  },[order,puzzle.steps,timer,add])

  return (
    <GameLayout title="Algorithm Puzzle ⚙️" score={score} timerProgress={timer.progress} timeLeft={timer.timeLeft} onExit={onExit}>
      <div className="text-center text-sm mb-2" style={{color:'var(--muted)'}}>
        Arrange steps in <strong style={{color:'white'}}>correct order</strong>:
      </div>
      <div className="text-center font-bold mb-4" style={{color:'#7c6cff'}}>{puzzle.title}</div>
      <div className="space-y-2 mb-5">
        {order.map((step,i)=>(
          <motion.div key={step} layout className="flex items-center gap-2">
            <span className="font-display font-bold w-6 text-center text-sm" style={{color:'var(--muted)'}}>{i+1}</span>
            <div className="flex-1 px-4 py-3 rounded-xl text-sm font-medium border"
              style={{background:checked?correct?'#00d4aa11':order[i]===puzzle.steps[i]?'#00d4aa11':'#ff6b6b11':'var(--surface)',
                borderColor:checked?correct?'#00d4aa':order[i]===puzzle.steps[i]?'#00d4aa':'#ff6b6b':'var(--border)',color:'white'}}>
              {step}
            </div>
            <div className="flex flex-col gap-0.5">
              <button onClick={()=>moveUp(i)} className="px-2 py-0.5 rounded text-xs" style={{background:'var(--surface)',color:'var(--muted)',border:'1px solid var(--border)'}}>▲</button>
              <button onClick={()=>moveDown(i)} className="px-2 py-0.5 rounded text-xs" style={{background:'var(--surface)',color:'var(--muted)',border:'1px solid var(--border)'}}>▼</button>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}} onClick={check}
        className="w-full py-3 rounded-2xl font-bold text-white"
        style={{background:'linear-gradient(135deg,#7c6cff,#5544ee)',border:'none'}}>
        ✅ Check Order
      </motion.button>
      {checked && (
        <div className="text-center mt-3 font-bold" style={{color:correct?'#00d4aa':'#ff6b6b'}}>
          {correct?`✅ Perfect! +${timer.timeLeft*10+80}`:'❌ Not quite right, try again!'}
        </div>
      )}
    </GameLayout>
  )
}
