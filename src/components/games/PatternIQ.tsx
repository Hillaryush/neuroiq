import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameTimer } from '../../hooks/useGameTimer'
import { useScore } from '../../hooks/useScore'
import { sound } from '../../services/soundService'
import GameLayout from '../GameLayout'

interface Pattern {
  grid: string[]
  answer: string
  options: string[]
  hint: string
}

const PATTERNS: Pattern[] = [
  {
    grid: ['🔴','🔵','🔴','🔵','🔴','🔵','🔴','🔵','❓'],
    answer: '🔴',
    options: ['🔴','🟢','🟡','🟣'],
    hint: 'Alternating pattern',
  },
  {
    grid: ['🌑','🌒','🌓','🌒','🌓','🌔','🌓','🌔','❓'],
    answer: '🌕',
    options: ['🌕','🌑','🌒','🌔'],
    hint: 'Moon phases progression',
  },
  {
    grid: ['🟥','🟥','⬜','🟥','⬜','⬜','⬜','⬜','❓'],
    answer: '⬜',
    options: ['⬜','🟥','🟦','🟨'],
    hint: 'Diagonal decrease',
  },
  {
    grid: ['⬆️','➡️','⬇️','➡️','⬇️','⬅️','⬇️','⬅️','❓'],
    answer: '⬆️',
    options: ['⬆️','⬇️','➡️','⬅️'],
    hint: 'Rotation pattern',
  },
  {
    grid: ['1️⃣','2️⃣','3️⃣','2️⃣','3️⃣','4️⃣','3️⃣','4️⃣','❓'],
    answer: '5️⃣',
    options: ['5️⃣','4️⃣','6️⃣','2️⃣'],
    hint: 'Each row +1',
  },
  {
    grid: ['🔺','🔺','🔷','🔺','🔷','🔷','🔷','🔷','❓'],
    answer: '🔷',
    options: ['🔷','🔺','🟦','🟠'],
    hint: 'Filling pattern',
  },
  {
    grid: ['🐣','🐥','🐔','🐥','🐔','🦅','🐔','🦅','❓'],
    answer: '🦅',
    options: ['🦅','🐔','🐣','🐥'],
    hint: 'Growth sequence shifts',
  },
  {
    grid: ['🌱','🌿','🌳','🌿','🌳','🌲','🌳','🌲','❓'],
    answer: '🌲',
    options: ['🌲','🌳','🌿','🌱'],
    hint: 'Maturation pattern',
  },
]

let usedPatterns: number[] = []
function pickPattern(): Pattern {
  if (usedPatterns.length >= PATTERNS.length) usedPatterns = []
  const available = PATTERNS.map((_, i) => i).filter((i) => !usedPatterns.includes(i))
  const idx = available[Math.floor(Math.random() * available.length)]
  usedPatterns.push(idx)
  return PATTERNS[idx]
}

interface Props {
  onFinish: (score: number) => void
  onExit: () => void
}

export default function PatternIQ({ onFinish, onExit }: Props) {
  const [pattern, setPattern] = useState<Pattern>(pickPattern)
  const [selected, setSelected] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [answered, setAnswered] = useState(false)
  const { score, add } = useScore()
  const timer = useGameTimer(30, () => onFinish(score))

  useEffect(() => { timer.start() }, []) // eslint-disable-line

  const check = useCallback(
    (val: string) => {
      if (answered) return
      setAnswered(true)
      setSelected(val)
      if (val === pattern.answer) {
        const pts = timer.timeLeft * 8 + 50
        sound.patternSolve(); add(pts)
        setFeedback('correct')
        setTimeout(() => {
          setPattern(pickPattern())
          setSelected(null)
          setFeedback(null)
          setAnswered(false)
          timer.reset()
          timer.start()
        }, 900)
      } else {
        setFeedback('wrong')
        setTimeout(() => {
          setPattern(pickPattern())
          setSelected(null)
          setFeedback(null)
          setAnswered(false)
          timer.reset()
          timer.start()
        }, 1200)
      }
    },
    [answered, pattern.answer, timer, add]
  )

  return (
    <GameLayout
      title="Pattern IQ 🔷"
      score={score}
      timerProgress={timer.progress}
      timeLeft={timer.timeLeft}
      onExit={onExit}
    >
      <div
        className="text-center text-sm mb-4 rounded-xl px-4 py-2"
        style={{ background: '#7c6cff11', color: 'var(--muted)' }}
      >
        <strong style={{ color: 'white' }}>Hint:</strong> {pattern.hint}
      </div>

      {/* 3×3 grid */}
      <div className="grid gap-2 mx-auto mb-6" style={{ gridTemplateColumns: 'repeat(3,1fr)', maxWidth: 300 }}>
        {pattern.grid.map((cell, i) => (
          <div
            key={i}
            className="aspect-square flex items-center justify-center rounded-xl border-2 text-3xl"
            style={{
              background: cell === '❓' ? '#ffffff08' : 'var(--surface)',
              borderColor: cell === '❓' ? 'var(--dim)' : 'var(--border)',
              borderStyle: cell === '❓' ? 'dashed' : 'solid',
            }}
          >
            {cell}
          </div>
        ))}
      </div>

      <div className="text-center text-sm mb-3" style={{ color: 'var(--muted)' }}>
        Choose the missing piece:
      </div>

      <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
        {pattern.options.map((opt) => (
          <motion.button
            key={opt}
            whileHover={!answered ? { scale: 1.06 } : {}}
            whileTap={!answered ? { scale: 0.95 } : {}}
            disabled={answered}
            onClick={() => check(opt)}
            className="aspect-square flex items-center justify-center rounded-xl border-2 text-2xl"
            style={{
              background:
                selected === opt && feedback === 'correct'
                  ? '#00d4aa22'
                  : opt === pattern.answer && feedback === 'wrong'
                  ? '#00d4aa22'
                  : 'var(--surface)',
              borderColor:
                selected === opt && feedback === 'correct'
                  ? '#00d4aa'
                  : opt === pattern.answer && feedback === 'wrong'
                  ? '#00d4aa'
                  : selected === opt && feedback === 'wrong'
                  ? '#ff6b6b'
                  : 'var(--border)',
            }}
          >
            {opt}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div
            key={feedback}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center mt-4 text-xl font-bold"
            style={{ color: feedback === 'correct' ? '#00d4aa' : '#ff6b6b' }}
          >
            {feedback === 'correct'
              ? `✅ Brilliant! +${timer.timeLeft * 8 + 50}`
              : `❌ Not quite! Answer: ${pattern.answer}`}
          </motion.div>
        )}
      </AnimatePresence>
    </GameLayout>
  )
}
