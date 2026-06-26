import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sound } from '../../services/soundService'
import GameLayout from '../GameLayout'
import { TIER_COLORS, TIER_LABELS, getTierFromScore, type DifficultyTier } from '../../utils/questionEngine'

interface Props { onFinish: (s: number) => void; onExit: () => void }

const ALL_COLORS = [
  { name: 'RED', hex: '#ef4444' },
  { name: 'BLUE', hex: '#3b82f6' },
  { name: 'GREEN', hex: '#22c55e' },
  { name: 'YELLOW', hex: '#eab308' },
  { name: 'PURPLE', hex: '#a855f7' },
  { name: 'ORANGE', hex: '#f97316' },
  { name: 'PINK', hex: '#ec4899' },
  { name: 'CYAN', hex: '#06b6d4' },
]

// Expert tier reverses the rule: must tap the WORD meaning, not the ink color (true cognitive interference test)
const COLORS_BY_TIER: Record<DifficultyTier, number> = { easy: 4, medium: 5, hard: 6, expert: 8 }
const THRESHOLDS = { medium: 100, hard: 300, expert: 600 }

function genRound(colorPool: typeof ALL_COLORS, reversed: boolean) {
  const word = colorPool[Math.floor(Math.random() * colorPool.length)]
  let color = colorPool[Math.floor(Math.random() * colorPool.length)]
  while (color.name === word.name) color = colorPool[Math.floor(Math.random() * colorPool.length)]
  return { word: word.name, color, reversed }
}

export default function StroopTest({ onFinish, onExit }: Props) {
  const [tier, setTier]     = useState<DifficultyTier>('easy')
  const [round, setRound]   = useState(() => genRound(ALL_COLORS.slice(0, COLORS_BY_TIER.easy), false))
  const [answered, setAns]  = useState(false)
  const [feedback, setFB]   = useState<'correct' | 'wrong' | null>(null)
  const [combo, setCombo]   = useState(0)
  const [score, setScore]   = useState(0)
  const [timeLeft, setTime] = useState(45)
  const [maxTime, setMax]   = useState(45)

  useEffect(() => {
    const t = setInterval(() => setTime(p => {
      if (p <= 1) { clearInterval(t); onFinish(score); return 0 }
      return p - 1
    }), 1000)
    return () => clearInterval(t)
  }, []) // eslint-disable-line

  const tierColors = ALL_COLORS.slice(0, COLORS_BY_TIER[tier])
  const isReversed = tier === 'expert'

  const answer = useCallback((colorName: string) => {
    if (answered) return
    setAns(true)
    const correctAnswer = isReversed ? round.word : round.color.name
    if (colorName === correctAnswer) {
      const tierMult = tier === 'expert' ? 3.5 : tier === 'hard' ? 2.2 : tier === 'medium' ? 1.4 : 1
      const pts = Math.round((timeLeft * 4 + 20 + combo * 5) * tierMult)
      sound.stroopCorrect()
      const newScore = score + pts
      setScore(newScore); setFB('correct'); setCombo(c => c + 1)

      const newTier = getTierFromScore(newScore, THRESHOLDS)
      if (newTier !== tier) {
        setTier(newTier)
        setTime(t => Math.min(t + 25, 120))
        setMax(m => Math.max(m, timeLeft + 25))
        sound.levelUp()
      }
    } else {
      sound.stroopWrong(); setFB('wrong'); setCombo(0)
    }
    setTimeout(() => {
      setRound(genRound(tierColors, isReversed)); setAns(false); setFB(null)
    }, 500)
  }, [answered, round, timeLeft, combo, score, tier, tierColors, isReversed])

  const tierColor = TIER_COLORS[tier]

  return (
    <GameLayout title="Stroop Challenge 🎨" score={score} timerProgress={timeLeft / maxTime} timeLeft={timeLeft} onExit={onExit}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm" style={{ color: 'var(--muted)' }}>
          {isReversed
            ? <>Tap the <strong style={{ color: 'white' }}>WORD MEANING</strong>, not the ink color!</>
            : <>Tap the <strong style={{ color: 'white' }}>INK COLOR</strong>, not the word!</>}
        </div>
        <span className="text-xs font-bold px-2 py-1 rounded-full shrink-0" style={{ background: tierColor + '22', color: tierColor }}>
          {TIER_LABELS[tier]}
        </span>
      </div>
      {isReversed && (
        <div className="text-center text-xs mb-2 px-3 py-1.5 rounded-full inline-block mx-auto"
          style={{ background: '#7c6cff22', color: '#7c6cff' }}>
          🔄 Reversed mode — true cognitive interference test
        </div>
      )}
      {combo >= 3 && <div className="text-center text-xs font-bold mb-2" style={{ color: '#ffd166' }}>🔥 {combo}x combo!</div>}

      <motion.div key={round.word + round.color.name} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center my-8">
        <div className="font-display font-extrabold" style={{ fontSize: 'clamp(48px,10vw,72px)', color: round.color.hex, letterSpacing: 2 }}>
          {round.word}
        </div>
        <div className="text-xs mt-2 uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
          {isReversed ? 'What does this word mean?' : 'What color is this text?'}
        </div>
      </motion.div>

      <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto" style={{ gridTemplateColumns: `repeat(${Math.min(tierColors.length, 4)},1fr)` }}>
        {tierColors.map(c => (
          <motion.button key={c.name} whileHover={!answered ? { scale: 1.05 } : {}} whileTap={!answered ? { scale: 0.95 } : {}}
            disabled={answered} onClick={() => answer(c.name)}
            className="py-3 rounded-2xl font-bold border-2 transition-all"
            style={{ fontSize: 'clamp(10px,1.8vw,13px)', background: `${c.hex}22`, borderColor: `${c.hex}66`, color: c.hex }}>
            {c.name}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div key={feedback} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-center mt-4 text-xl font-bold" style={{ color: feedback === 'correct' ? '#00d4aa' : '#ff6b6b' }}>
            {feedback === 'correct' ? '✅ Correct!' : '❌ Wrong answer!'}
          </motion.div>
        )}
      </AnimatePresence>
    </GameLayout>
  )
}
