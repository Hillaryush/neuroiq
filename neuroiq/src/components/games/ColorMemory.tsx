import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { sound } from '../../services/soundService'
import GameLayout from '../GameLayout'
import { SEQUENCE_COLORS, SEQUENCE_COLOR_NAMES } from '../../utils/constants'
import { TIER_COLORS, TIER_LABELS, getTierFromScore, type DifficultyTier } from '../../utils/questionEngine'

type Phase = 'watch' | 'input' | 'result'
interface Props { onFinish: (s: number) => void; onExit: () => void }

const COLORS_BY_TIER: Record<DifficultyTier, number> = { easy: 4, medium: 5, hard: 6, expert: 6 }
const THRESHOLDS = { medium: 150, hard: 450, expert: 900 }

export default function ColorMemory({ onFinish, onExit }: Props) {
  const [tier, setTier]         = useState<DifficultyTier>('easy')
  const [sequence, setSequence] = useState<number[]>([])
  const [playerInput, setPlayerInput] = useState<number[]>([])
  const [phase, setPhase]       = useState<Phase>('watch')
  const [litIndex, setLitIndex] = useState<number | null>(null)
  const [showSeq, setShowSeq]   = useState<boolean[]>([])
  const [feedback, setFeedback] = useState('')
  const [score, setScore]       = useState(0)
  const toRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const numColors = COLORS_BY_TIER[tier]
  const clearTO = () => { if (toRef.current) clearTimeout(toRef.current) }

  const playSequence = useCallback((seq: number[]) => {
    setPhase('watch'); setPlayerInput([])
    setShowSeq(new Array(seq.length).fill(false))
    setFeedback('Memorize the sequence...')

    // Higher tiers play faster — less time per color
    const delay = Math.max(280, (tier === 'expert' ? 420 : tier === 'hard' ? 550 : tier === 'medium' ? 700 : 900) - seq.length * 20)
    let i = 0
    const tick = () => {
      if (i > 0) setLitIndex(null)
      if (i >= seq.length) {
        toRef.current = setTimeout(() => { setShowSeq([]); setPhase('input'); setFeedback('Now repeat it!') }, 600)
        return
      }
      sound.seqLight(seq[i])
      setLitIndex(seq[i])
      setShowSeq(prev => { const next = [...prev]; next[i] = true; return next })
      i++
      toRef.current = setTimeout(tick, delay)
    }
    toRef.current = setTimeout(tick, 400)
  }, [tier])

  const nextRound = useCallback((currentScore: number) => {
    const newTier = getTierFromScore(currentScore, THRESHOLDS)
    if (newTier !== tier) { setTier(newTier); sound.levelUp() }
    const colorCount = COLORS_BY_TIER[newTier]
    const next = [...sequence, Math.floor(Math.random() * colorCount)]
    setSequence(next)
    playSequence(next)
  }, [sequence, tier, playSequence])

  useEffect(() => {
    const first = [Math.floor(Math.random() * numColors)]
    setSequence(first)
    playSequence(first)
    return clearTO
  }, []) // eslint-disable-line

  const press = useCallback((i: number) => {
    if (phase !== 'input') return
    sound.seqPress(i)
    setLitIndex(i)
    setTimeout(() => setLitIndex(null), 250)

    const next = [...playerInput, i]
    setPlayerInput(next)
    const pos = next.length - 1

    if (next[pos] !== sequence[pos]) {
      setFeedback(`❌ Wrong! Was: ${sequence.map(c => SEQUENCE_COLOR_NAMES[c]).join(' → ')}`)
      setPhase('result')
      clearTO()
      toRef.current = setTimeout(() => onFinish(score), 1800)
      return
    }

    if (next.length === sequence.length) {
      const tierMult = tier === 'expert' ? 3 : tier === 'hard' ? 2 : tier === 'medium' ? 1.3 : 1
      const pts = Math.round(sequence.length * 40 * tierMult)
      sound.seqSuccess()
      const newScore = score + pts
      setScore(newScore)
      setFeedback(`✅ Perfect! +${pts}`)
      setPhase('watch')
      clearTO()
      toRef.current = setTimeout(() => nextRound(newScore), 900)
    }
  }, [phase, playerInput, sequence, score, tier, nextRound, onFinish])

  const tierColor = TIER_COLORS[tier]

  return (
    <GameLayout title="Color Memory 🎨" score={score} timerProgress={1} timeLeft={sequence.length} onExit={onExit} timerLabel="Seq">
      <div className="flex items-center justify-between mb-4 text-sm">
        <span style={{ color: 'var(--muted)' }}>Sequence length: <strong style={{ color: 'white' }}>{sequence.length}</strong></span>
        <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: tierColor + '22', color: tierColor }}>
          {TIER_LABELS[tier]}
        </span>
      </div>

      <div className="flex justify-center gap-3 mb-6 min-h-16 items-center flex-wrap">
        {phase === 'watch' && showSeq.length > 0
          ? showSeq.map((shown, idx) => (
              <motion.div key={idx} animate={shown ? { opacity: 1, scale: 1 } : { opacity: 0.15, scale: 0.8 }}
                className="w-10 h-10 rounded-xl" style={{ background: shown ? SEQUENCE_COLORS[sequence[idx]] : 'var(--dim)' }} />
            ))
          : phase === 'input' && (
              <div className="flex gap-2 flex-wrap">
                {sequence.map((_, idx) => (
                  <div key={idx} className="w-8 h-8 rounded-lg border-2"
                    style={{ background: idx < playerInput.length ? SEQUENCE_COLORS[playerInput[idx]] : 'transparent',
                      borderColor: idx < playerInput.length ? SEQUENCE_COLORS[playerInput[idx]] : 'var(--dim)' }} />
                ))}
              </div>
            )}
      </div>

      <div className="flex justify-center gap-3 mb-6 flex-wrap">
        {SEQUENCE_COLORS.slice(0, numColors).map((color, i) => (
          <motion.button key={i}
            animate={litIndex === i ? { scale: 1.25, boxShadow: `0 0 30px ${color}` } : { scale: 1, boxShadow: 'none' }}
            transition={{ duration: 0.15 }}
            onClick={() => press(i)}
            className="rounded-2xl border-2"
            style={{ width: 'clamp(44px,9vw,56px)', height: 'clamp(44px,9vw,56px)',
              background: color, borderColor: `${color}cc`,
              cursor: phase === 'input' ? 'pointer' : 'default', opacity: phase === 'input' ? 1 : 0.6 }}
            title={SEQUENCE_COLOR_NAMES[i]} />
        ))}
      </div>

      <div className="text-center font-semibold"
        style={{ color: feedback.startsWith('✅') ? '#00d4aa' : feedback.startsWith('❌') ? '#ff6b6b' : 'var(--muted)' }}>
        {feedback}
      </div>
    </GameLayout>
  )
}
