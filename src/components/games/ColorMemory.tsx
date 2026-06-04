import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useScore } from '../../hooks/useScore'
import { SEQUENCE_COLORS, SEQUENCE_COLOR_NAMES } from '../../utils/constants'
import { sound } from '../../services/soundService'
import GameLayout from '../GameLayout'

type Phase = 'watch' | 'input' | 'result'

interface Props {
  onFinish: (score: number) => void
  onExit: () => void
}

export default function ColorMemory({ onFinish, onExit }: Props) {
  const [sequence, setSequence] = useState<number[]>([])
  const [playerInput, setPlayerInput] = useState<number[]>([])
  const [phase, setPhase] = useState<Phase>('watch')
  const [litIndex, setLitIndex] = useState<number | null>(null)
  const [showSeq, setShowSeq] = useState<boolean[]>([])
  const [feedback, setFeedback] = useState('')
  const { score, add } = useScore()
  const toRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTO = () => {
    if (toRef.current) clearTimeout(toRef.current)
  }

  const playSequence = useCallback((seq: number[]) => {
    setPhase('watch')
    setPlayerInput([])
    setShowSeq(new Array(seq.length).fill(false))
    setFeedback('Memorize the sequence...')

    let i = 0
    const delay = Math.max(500, 900 - seq.length * 40)
    const tick = () => {
      if (i > 0) setLitIndex(null)
      if (i >= seq.length) {
        toRef.current = setTimeout(() => {
          setShowSeq([])
          setPhase('input')
          setFeedback('Now repeat it!')
        }, 600)
        return
      }
      sound.seqLight(seq[i]); setLitIndex(seq[i])
      setShowSeq((prev) => {
        const next = [...prev]
        next[i] = true
        return next
      })
      i++
      toRef.current = setTimeout(tick, delay)
    }
    toRef.current = setTimeout(tick, 400)
  }, [])

  const nextRound = useCallback(() => {
    const next = [...sequence, Math.floor(Math.random() * 6)]
    setSequence(next)
    playSequence(next)
  }, [sequence, playSequence])

  useEffect(() => {
    const first = [Math.floor(Math.random() * 6)]
    setSequence(first)
    playSequence(first)
    return clearTO
  }, []) // eslint-disable-line

  const press = useCallback(
    (i: number) => {
      if (phase !== 'input') return
      sound.seqPress(i); setLitIndex(i)
      setTimeout(() => setLitIndex(null), 250)

      const next = [...playerInput, i]
      setPlayerInput(next)
      const pos = next.length - 1

      if (next[pos] !== sequence[pos]) {
        setFeedback(
          `❌ Wrong! Was: ${sequence.map((c) => SEQUENCE_COLOR_NAMES[c]).join(' → ')}`
        )
        setPhase('result')
        clearTO()
        toRef.current = setTimeout(() => onFinish(score), 1800)
        return
      }

      if (next.length === sequence.length) {
        sound.seqSuccess(); add(sequence.length * 40)
        setFeedback(`✅ Perfect! +${sequence.length * 40}`)
        setPhase('watch')
        clearTO()
        toRef.current = setTimeout(nextRound, 900)
      }
    },
    [phase, playerInput, sequence, add, score, onFinish, nextRound]
  )

  return (
    <GameLayout
      title="Color Memory 🎨"
      score={score}
      timerProgress={1}
      timeLeft={sequence.length}
      onExit={onExit}
      timerLabel="Seq"
    >
      <div className="text-center mb-4 text-sm" style={{ color: 'var(--muted)' }}>
        Sequence length: <strong style={{ color: 'white' }}>{sequence.length}</strong>
      </div>

      {/* Sequence display */}
      <div className="flex justify-center gap-3 mb-6 min-h-16 items-center flex-wrap">
        {phase === 'watch' && showSeq.length > 0
          ? showSeq.map((shown, idx) => (
              <motion.div
                key={idx}
                animate={shown ? { opacity: 1, scale: 1 } : { opacity: 0.15, scale: 0.8 }}
                className="w-10 h-10 rounded-xl"
                style={{ background: shown ? SEQUENCE_COLORS[sequence[idx]] : 'var(--dim)' }}
              />
            ))
          : phase === 'input' && (
              <div className="flex gap-2">
                {sequence.map((_, idx) => (
                  <div
                    key={idx}
                    className="w-8 h-8 rounded-lg border-2"
                    style={{
                      background:
                        idx < playerInput.length
                          ? SEQUENCE_COLORS[playerInput[idx]]
                          : 'transparent',
                      borderColor:
                        idx < playerInput.length
                          ? SEQUENCE_COLORS[playerInput[idx]]
                          : 'var(--dim)',
                    }}
                  />
                ))}
              </div>
            )}
      </div>

      {/* Color buttons */}
      <div className="flex justify-center gap-3 mb-6 flex-wrap">
        {SEQUENCE_COLORS.map((color, i) => (
          <motion.button
            key={i}
            animate={
              litIndex === i
                ? { scale: 1.25, boxShadow: `0 0 30px ${color}` }
                : { scale: 1, boxShadow: 'none' }
            }
            transition={{ duration: 0.15 }}
            onClick={() => press(i)}
            className="w-14 h-14 rounded-2xl border-2"
            style={{
              background: color,
              borderColor: `${color}cc`,
              cursor: phase === 'input' ? 'pointer' : 'default',
              opacity: phase === 'input' ? 1 : 0.6,
            }}
            title={SEQUENCE_COLOR_NAMES[i]}
          />
        ))}
      </div>

      <div
        className="text-center font-semibold"
        style={{
          color: feedback.startsWith('✅')
            ? '#00d4aa'
            : feedback.startsWith('❌')
            ? '#ff6b6b'
            : 'var(--muted)',
        }}
      >
        {feedback}
      </div>
    </GameLayout>
  )
}
