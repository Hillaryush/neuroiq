import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sound } from '../../services/soundService'
import GameLayout from '../GameLayout'
import { TIER_COLORS, TIER_LABELS, getTierFromScore, type DifficultyTier } from '../../utils/questionEngine'

interface Card { id: number; emoji: string; flipped: boolean; matched: boolean }
interface Props { onFinish: (score: number) => void; onExit: () => void }

const ALL_EMOJIS = ['🐶','🐱','🦊','🐻','🦁','🐸','🦄','🌈','⭐','🍕','🚀','🎮','🎯','🏆','💎','🎭','🐧','🦋','🌺','🍎']

// Pair counts scale with difficulty — Expert has 16 pairs (32 cards!)
const PAIRS_BY_TIER: Record<DifficultyTier, number> = { easy: 6, medium: 8, hard: 12, expert: 16 }
const COLS_BY_TIER: Record<DifficultyTier, number>  = { easy: 4, medium: 4, hard: 6, expert: 8 }
const TIME_BY_TIER: Record<DifficultyTier, number>  = { easy: 50, medium: 60, hard: 100, expert: 130 }
const THRESHOLDS = { medium: 150, hard: 450, expert: 900 }

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5) }

function buildDeck(pairCount: number): Card[] {
  const emojis = shuffle(ALL_EMOJIS).slice(0, pairCount)
  return shuffle([...emojis, ...emojis]).map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }))
}

export default function MemoryGame({ onFinish, onExit }: Props) {
  const [tier, setTier]     = useState<DifficultyTier>('easy')
  const [cards, setCards]   = useState<Card[]>(() => buildDeck(PAIRS_BY_TIER.easy))
  const [flipped, setFlipped] = useState<number[]>([])
  const [locked, setLocked] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [score, setScore]   = useState(0)
  const [timeLeft, setTime] = useState(TIME_BY_TIER.easy)
  const [maxTime, setMax]   = useState(TIME_BY_TIER.easy)

  useEffect(() => {
    const t = setInterval(() => setTime(p => {
      if (p <= 1) { clearInterval(t); onFinish(score); return 0 }
      return p - 1
    }), 1000)
    return () => clearInterval(t)
  }, []) // eslint-disable-line

  const matched = cards.filter(c => c.matched).length
  const totalPairs = cards.length / 2

  useEffect(() => {
    if (matched === totalPairs && cards.length > 0) onFinish(score)
  }, [matched]) // eslint-disable-line

  const levelUp = useCallback((newScore: number) => {
    const newTier = getTierFromScore(newScore, THRESHOLDS)
    if (newTier !== tier) {
      // Tier increased — rebuild a bigger board for the next round
      setTier(newTier)
      setCards(buildDeck(PAIRS_BY_TIER[newTier]))
      setTime(t => Math.min(t + 20, TIME_BY_TIER[newTier]))
      setMax(TIME_BY_TIER[newTier])
      sound.levelUp()
    }
  }, [tier])

  const flipCard = useCallback((id: number) => {
    if (locked || flipped.includes(id) || cards[id].matched) return
    sound.cardFlip()
    const next = [...flipped, id]
    setCards(prev => prev.map(c => c.id === id ? { ...c, flipped: true } : c))
    setFlipped(next)

    if (next.length === 2) {
      setLocked(true)
      const [a, b] = next
      if (cards[a].emoji === cards[b].emoji) {
        setTimeout(() => {
          setCards(prev => prev.map(c => (c.id === a || c.id === b) ? { ...c, matched: true } : c))
          setFlipped([]); setLocked(false)
          sound.cardMatch()
          const tierMult = tier === 'expert' ? 3 : tier === 'hard' ? 2 : tier === 'medium' ? 1.3 : 1
          const pts = Math.round(50 * tierMult)
          const newScore = score + pts
          setScore(newScore)
          setFeedback('correct')
          setTimeout(() => setFeedback(null), 800)
          levelUp(newScore)
        }, 500)
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => (c.id === a || c.id === b) ? { ...c, flipped: false } : c))
          setFlipped([]); setLocked(false)
          sound.cardMiss()
          setFeedback('wrong')
          setTimeout(() => setFeedback(null), 600)
        }, 800)
      }
    }
  }, [locked, flipped, cards, score, tier, levelUp])

  const tierColor = TIER_COLORS[tier]
  const cols = COLS_BY_TIER[tier]

  return (
    <GameLayout title="Memory Matrix" score={score} timerProgress={timeLeft / maxTime} timeLeft={timeLeft} onExit={onExit}>
      <div className="flex items-center justify-between mb-3 text-sm">
        <span style={{ color: 'var(--muted)' }}>
          {matched}/{totalPairs} pairs · {totalPairs} pairs at this level
        </span>
        <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: tierColor + '22', color: tierColor }}>
          {TIER_LABELS[tier]}
        </span>
      </div>

      <div className="grid gap-2 mx-auto" style={{ gridTemplateColumns: `repeat(${cols},1fr)`, maxWidth: cols > 4 ? 420 : 320 }}>
        {cards.map(card => (
          <motion.div key={card.id} className="relative aspect-square cursor-pointer"
            style={{ perspective: 600 }}
            whileHover={!card.matched && !card.flipped ? { scale: 1.04 } : {}}
            onClick={() => flipCard(card.id)}>
            <motion.div className="w-full h-full" animate={{ rotateY: card.flipped || card.matched ? 180 : 0 }}
              transition={{ duration: 0.35 }} style={{ transformStyle: 'preserve-3d', position: 'relative' }}>
              <div className="absolute inset-0 flex items-center justify-center rounded-lg border-2"
                style={{ backfaceVisibility: 'hidden', background: 'var(--surface)', borderColor: 'var(--border)',
                  fontSize: cols > 6 ? 14 : 22 }}>
                ❓
              </div>
              <div className="absolute inset-0 flex items-center justify-center rounded-lg border-2"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)',
                  background: card.matched ? '#00d4aa22' : '#7c6cff22',
                  borderColor: card.matched ? '#00d4aa' : '#7c6cff',
                  fontSize: cols > 6 ? 16 : 26 }}>
                {card.emoji}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div key={feedback} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-center mt-4 text-xl font-bold" style={{ color: feedback === 'correct' ? '#00d4aa' : '#ff6b6b' }}>
            {feedback === 'correct' ? '✅ Match!' : '❌ Try again'}
          </motion.div>
        )}
      </AnimatePresence>
    </GameLayout>
  )
}
