import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScore } from '../../hooks/useScore'
import { sound } from '../../services/soundService'
import GameLayout from '../GameLayout'
import { MATH_BANK, choicesFor, type MathQuestion } from '../../data/mathQuestions'
import { pickQuestion, getTierFromScore, TIER_COLORS, TIER_LABELS, type DifficultyTier } from '../../utils/questionEngine'

interface Props { onFinish: (score: number) => void; onExit: () => void }

const THRESHOLDS = { medium: 80, hard: 250, expert: 600 }

// Time budget grows with difficulty: Easy/Medium get the base game timer (45s shared pool),
// but Hard/Expert questions individually grant up to 2 minutes extra "think time" via bonus seconds.
const TIER_BONUS_SECONDS: Record<DifficultyTier, number> = {
  easy: 0, medium: 0, hard: 45, expert: 75,
}

export default function MathBlitz({ onFinish, onExit }: Props) {
  const { score, add } = useScore()
  const [tier, setTier]         = useState<DifficultyTier>('easy')
  const [question, setQuestion] = useState<MathQuestion>(() => pickQuestion('math', MATH_BANK, 'easy'))
  const [choices, setChoices]   = useState<number[]>(() => choicesFor(question.answer, 12))
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [answered, setAnswered] = useState(false)
  const [combo, setCombo]       = useState(0)
  const [timeLeft, setTimeLeft] = useState(45)
  const [maxTime, setMaxTime]   = useState(45)

  // Timer loop
  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft(p => {
        if (p <= 1) { clearInterval(t); onFinish(score); return 0 }
        return p - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, []) // eslint-disable-line

  const nextQuestion = useCallback((currentScore: number) => {
    const newTier = getTierFromScore(currentScore, THRESHOLDS)
    setTier(newTier)
    const q = pickQuestion('math', MATH_BANK, newTier)
    setQuestion(q)
    setChoices(choicesFor(q.answer, newTier === 'expert' ? 40 : newTier === 'hard' ? 25 : 12))
    // Grant bonus think-time when entering a harder tier for the first time on this question
    const bonus = TIER_BONUS_SECONDS[newTier]
    if (bonus > 0) {
      setTimeLeft(t => Math.min(t + Math.floor(bonus / 3), 120))
      setMaxTime(m => Math.max(m, timeLeft + Math.floor(bonus / 3)))
    }
  }, [timeLeft])

  const next = useCallback((correct: boolean) => {
    setAnswered(true)
    if (correct) {
      const tierMultiplier = tier === 'expert' ? 4 : tier === 'hard' ? 2.5 : tier === 'medium' ? 1.5 : 1
      const pts = Math.round((timeLeft * 3 + 20 + combo * 10) * tierMultiplier)
      sound.mathCorrect(); add(pts)
      setFeedback('correct')
      setCombo(c => {
        const nc = c + 1
        if (nc > 0 && nc % 3 === 0) sound.comboUp()
        return nc
      })
    } else {
      sound.mathWrong(); setFeedback('wrong')
      setCombo(0)
    }
    setTimeout(() => {
      nextQuestion(score + (correct ? 1 : 0))
      setFeedback(null)
      setAnswered(false)
    }, 600)
  }, [timeLeft, combo, add, tier, score, nextQuestion])

  const tierColor = TIER_COLORS[tier]

  return (
    <GameLayout
      title="Math Blitz ⚡"
      score={score}
      timerProgress={timeLeft / maxTime}
      timeLeft={timeLeft}
      onExit={onExit}
    >
      <div className="flex items-center justify-between mb-3">
        {combo >= 3 ? (
          <div className="text-xs font-bold tracking-widest" style={{ color: '#ffd166' }}>
            🔥 {combo}x COMBO!
          </div>
        ) : <div />}
        <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: tierColor + '22', color: tierColor }}>
          {TIER_LABELS[tier]}
        </span>
      </div>

      <div className="text-center mb-6">
        <div className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>
          Solve quickly {tier === 'hard' || tier === 'expert' ? '· take your time' : ''}
        </div>
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display font-extrabold"
          style={{ fontSize: 'clamp(28px,6vw,48px)', lineHeight: 1.1, color: 'white' }}
        >
          {question.expr}
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
        {choices.map((choice) => (
          <motion.button
            key={choice}
            whileHover={!answered ? { scale: 1.04 } : {}}
            whileTap={!answered ? { scale: 0.97 } : {}}
            disabled={answered}
            onClick={() => next(choice === question.answer)}
            className="py-5 rounded-2xl font-display font-extrabold text-2xl border-2 transition-colors"
            style={{
              background: answered && choice === question.answer ? '#00d4aa22'
                : answered && feedback === 'wrong' ? '#ff6b6b11' : 'var(--surface)',
              borderColor: answered && choice === question.answer ? '#00d4aa' : 'var(--border)',
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
            className="text-center mt-4 text-base font-bold"
            style={{ color: feedback === 'correct' ? '#00d4aa' : '#ff6b6b' }}
          >
            {feedback === 'correct'
              ? `⚡ Correct!${question.explanation ? ' · ' + question.explanation : ''}`
              : `❌ Answer: ${question.answer}${question.explanation ? ' · ' + question.explanation : ''}`}
          </motion.div>
        )}
      </AnimatePresence>
    </GameLayout>
  )
}
