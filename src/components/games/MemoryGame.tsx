import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameTimer } from '../../hooks/useGameTimer'
import { useScore } from '../../hooks/useScore'
import { MEMORY_EMOJIS } from '../../utils/constants'
import { sound } from "../../services/soundService"
import GameLayout from '../GameLayout'

interface Card {
  id: number
  emoji: string
  flipped: boolean
  matched: boolean
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

function buildDeck(size = 8): Card[] {
  const emojis = shuffle(MEMORY_EMOJIS).slice(0, size)
  return shuffle([...emojis, ...emojis]).map((emoji, i) => ({
    id: i,
    emoji,
    flipped: false,
    matched: false,
  }))
}

interface Props {
  onFinish: (score: number) => void
  onExit: () => void
}

export default function MemoryGame({ onFinish, onExit }: Props) {
  const [cards, setCards] = useState<Card[]>(() => buildDeck(8))
  const [flipped, setFlipped] = useState<number[]>([])
  const [locked, setLocked] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const { score, add } = useScore()
  const timer = useGameTimer(60, () => onFinish(score))

  useEffect(() => { timer.start() }, []) // eslint-disable-line

  const matched = cards.filter((c) => c.matched).length

  useEffect(() => {
    if (matched === cards.length && cards.length > 0) {
      timer.stop()
      onFinish(score)
    }
  }, [matched]) // eslint-disable-line

  const flipCard = useCallback(
    (id: number) => {
      if (locked || flipped.includes(id) || cards[id].matched) return
      const next = [...flipped, id]
      sound.cardFlip()
      setCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, flipped: true } : c))
      )
      setFlipped(next)

      if (next.length === 2) {
        setLocked(true)
        const [a, b] = next
        if (cards[a].emoji === cards[b].emoji) {
          setTimeout(() => {
            sound.cardFlip()
      setCards((prev) =>
              prev.map((c) =>
                c.id === a || c.id === b ? { ...c, matched: true } : c
              )
            )
            setFlipped([])
            setLocked(false)
            setFeedback('correct')
            add(50)
            setTimeout(() => setFeedback(null), 800)
          }, 500)
        } else {
          setTimeout(() => {
            sound.cardFlip()
      setCards((prev) =>
              prev.map((c) =>
                c.id === a || c.id === b ? { ...c, flipped: false } : c
              )
            )
            setFlipped([])
            setLocked(false)
            setFeedback('wrong')
            setTimeout(() => setFeedback(null), 600)
          }, 800)
        }
      }
    },
    [locked, flipped, cards, add]
  )

  return (
    <GameLayout
      title="Memory Matrix"
      score={score}
      timerProgress={timer.progress}
      timeLeft={timer.timeLeft}
      onExit={onExit}
    >
      <div className="text-center mb-4 text-sm text-muted">
        Flip cards to find matching pairs • {matched / 2}/{cards.length / 2} pairs found
      </div>

      <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            className="relative aspect-square cursor-pointer"
            style={{ perspective: 600 }}
            whileHover={!card.matched && !card.flipped ? { scale: 1.04 } : {}}
            onClick={() => flipCard(card.id)}
          >
            <motion.div
              className="w-full h-full"
              animate={{ rotateY: card.flipped || card.matched ? 180 : 0 }}
              transition={{ duration: 0.35 }}
              style={{ transformStyle: 'preserve-3d', position: 'relative' }}
            >
              {/* Front */}
              <div
                className="absolute inset-0 flex items-center justify-center rounded-xl border-2"
                style={{
                  backfaceVisibility: 'hidden',
                  background: 'var(--surface)',
                  borderColor: 'var(--border)',
                  fontSize: 22,
                }}
              >
                ❓
              </div>
              {/* Back */}
              <div
                className="absolute inset-0 flex items-center justify-center rounded-xl border-2"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  background: card.matched ? '#00d4aa22' : '#7c6cff22',
                  borderColor: card.matched ? '#00d4aa' : '#7c6cff',
                  fontSize: 26,
                }}
              >
                {card.emoji}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div
            key={feedback}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center mt-4 text-2xl font-bold"
            style={{ color: feedback === 'correct' ? '#00d4aa' : '#ff6b6b' }}
          >
            {feedback === 'correct' ? '✅ Match! +50' : '❌ Try again'}
          </motion.div>
        )}
      </AnimatePresence>
    </GameLayout>
  )
}
