import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameTimer } from '../../hooks/useGameTimer'
import { useScore } from '../../hooks/useScore'
import { sound } from '../../services/soundService'
import GameLayout from '../GameLayout'

type Op = '+' | '−' | '×'

interface Question {
  a: number
  b: number
  op: Op
  answer: number
  choices: number[]
}

function genQuestion(level: number): Question {
  const ops: Op[] = ['+', '−', '×']
  const op = ops[Math.floor(Math.random() * (level < 3 ? 2 : 3))]
  let a: number, b: number, answer: number

  const max = 10 + level * 8
  if (op === '+') {
    a = Math.floor(Math.random() * max) + 5
    b = Math.floor(Math.random() * max) + 5
    answer = a + b
  } else if (op === '−') {
    a = Math.floor(Math.random() * max) + 15
    b = Math.floor(Math.random() * a)
    answer = a - b
  } else {
    a = Math.floor(Math.random() * (4 + level)) + 2
    b = Math.floor(Math.random() * (4 + level)) + 2
    answer = a * b
  }

  const wrongSet = new Set<number>()
  while (wrongSet.size < 3) {
    const w = answer + Math.floor(Math.random() * 20) - 10
    if (w !== answer && w > 0) wrongSet.add(w)
  }
  const choices = [answer, ...wrongSet].sort(() => Math.random() - 0.5)
  return { a, b, op, answer, choices }
}

interface Props {
  onFinish: (score: number) => void
  onExit: () => void
}

export default function MathBlitz({ onFinish, onExit }: Props) {
  const [question, setQuestion] = useState<Question>(() => genQuestion(1))
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [answered, setAnswered] = useState(false)
  const [level, setLevel] = useState(1)
  const [combo, setCombo] = useState(0)
  const { score, add } = useScore()
  const timer = useGameTimer(45, () => onFinish(score))

  useEffect(() => { timer.start() }, []) // eslint-disable-line

  const next = useCallback(
    (correct: boolean) => {
      setAnswered(true)
      if (correct) {
        const pts = timer.timeLeft * 3 + 20 + combo * 10
        sound.mathCorrect(); add(pts)
        setFeedback('correct')
        setCombo((c) => c + 1)
        if (combo > 0 && combo % 3 === 0) setLevel((l) => Math.min(l + 1, 5))
      } else {
        sound.mathWrong(); setFeedback('wrong')
        setCombo(0)
      }
      setTimeout(() => {
        setQuestion(genQuestion(level))
        setFeedback(null)
        setAnswered(false)
      }, 600)
    },
    [timer.timeLeft, combo, add, level]
  )

  return (
    <GameLayout
      title="Math Blitz ⚡"
      score={score}
      timerProgress={timer.progress}
      timeLeft={timer.timeLeft}
      onExit={onExit}
    >
      {combo >= 3 && (
        <div
          className="text-center text-xs font-bold mb-2 tracking-widest"
          style={{ color: '#ffd166' }}
        >
          🔥 {combo}x COMBO!
        </div>
      )}

      <div className="text-center mb-6">
        <div className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>
          Level {level} • Solve quickly
        </div>
        <motion.div
          key={question.a + question.op + question.b}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display font-extrabold"
          style={{ fontSize: 52, lineHeight: 1.1, color: 'white' }}
        >
          {question.a} {question.op} {question.b}
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
        {question.choices.map((choice) => (
          <motion.button
            key={choice}
            whileHover={!answered ? { scale: 1.04 } : {}}
            whileTap={!answered ? { scale: 0.97 } : {}}
            disabled={answered}
            onClick={() => next(choice === question.answer)}
            className="py-5 rounded-2xl font-display font-extrabold text-2xl border-2 transition-colors"
            style={{
              background:
                answered && choice === question.answer
                  ? '#00d4aa22'
                  : answered && feedback === 'wrong'
                  ? '#ff6b6b11'
                  : 'var(--surface)',
              borderColor:
                answered && choice === question.answer
                  ? '#00d4aa'
                  : 'var(--border)',
              color: 'white',
            }}
          >
            {choice}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div
            key={feedback}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center mt-4 text-xl font-bold"
            style={{ color: feedback === 'correct' ? '#00d4aa' : '#ff6b6b' }}
          >
            {feedback === 'correct'
              ? `⚡ +${timer.timeLeft * 3 + 20 + (combo - 1) * 10}`
              : `❌ Answer: ${question.answer}`}
          </motion.div>
        )}
      </AnimatePresence>
    </GameLayout>
  )
}
