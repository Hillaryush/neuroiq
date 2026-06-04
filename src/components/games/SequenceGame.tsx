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

export default function SequenceGame({ onFinish, onExit }: Props) {
  const [sequence, setSequence] = useState<number[]>([])
  const [playerInput, setPlayerInput] = useState<number[]>([])
  const [phase, setPhase] = useState<Phase>('watch')
  const [litIndex, setLitIndex] = useState<number | null>(null)
  const [feedback, setFeedback] = useState('')
  const { score, add } = useScore()
  const level = sequence.length
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTO = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }

  const playSequence = useCallback((seq: number[]) => {
    setPhase('watch')
    setPlayerInput([])
    setFeedback('Watch carefully...')
    let i = 0
    const interval = setInterval(() => {
      if (i > 0) setLitIndex(null)
      if (i >= seq.length) {
        clearInterval(interval)
        timeoutRef.current = setTimeout(() => {
          setPhase('input')
          setFeedback('Your turn! Repeat the sequence')
        }, 400)
        return
      }
      sound.seqLight(seq[i]); setLitIndex(seq[i])
      i++
    }, 700)
    return () => clearInterval(interval)
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

  const pressButton = useCallback(
    (idx: number) => {
      if (phase !== 'input') return
      sound.seqPress(idx); setLitIndex(idx)
      setTimeout(() => setLitIndex(null), 200)

      const newInput = [...playerInput, idx]
      setPlayerInput(newInput)
      const pos = newInput.length - 1

      if (newInput[pos] !== sequence[pos]) {
        setFeedback(`❌ Game Over — Level ${level} reached!`)
        setPhase('result')
        clearTO()
        timeoutRef.current = setTimeout(() => onFinish(score), 1500)
        return
      }

      if (newInput.length === sequence.length) {
        sound.seqSuccess(); add(level * 30)
        setFeedback(`✅ Level ${level} complete! +${level * 30}`)
        setPhase('watch')
        clearTO()
        timeoutRef.current = setTimeout(nextRound, 1000)
      }
    },
    [phase, playerInput, sequence, level, add, score, onFinish, nextRound]
  )

  return (
    <GameLayout
      title="Simon Says+"
      score={score}
      timerProgress={1}
      timeLeft={level}
      onExit={onExit}
      timerLabel="Level"
    >
      <div className="text-center mb-2">
        <div className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>
          Sequence length: {level}
        </div>
        <div className="flex justify-center gap-1 mb-4">
          {Array.from({ length: Math.max(level, 1) }).map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ background: SEQUENCE_COLORS[i % 6] }}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-3 mb-6 flex-wrap">
        {SEQUENCE_COLORS.map((color, i) => (
          <motion.button
            key={i}
            animate={
              litIndex === i
                ? { scale: 1.2, boxShadow: `0 0 28px ${color}` }
                : { scale: 1, boxShadow: 'none' }
            }
            transition={{ duration: 0.15 }}
            onClick={() => pressButton(i)}
            className="w-16 h-16 rounded-2xl border-2 font-bold text-xl"
            style={{
              background: `${color}22`,
              borderColor: `${color}88`,
              color,
              cursor: phase === 'input' ? 'pointer' : 'default',
            }}
            title={SEQUENCE_COLOR_NAMES[i]}
          >
            {['①', '②', '③', '④', '⑤', '⑥'][i]}
          </motion.button>
        ))}
      </div>

      <div
        className="text-center font-semibold text-base"
        style={{
          color:
            feedback.startsWith('✅')
              ? '#00d4aa'
              : feedback.startsWith('❌')
              ? '#ff6b6b'
              : 'var(--muted)',
        }}
      >
        {feedback}
      </div>

      {phase === 'input' && (
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: sequence.length }).map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full border"
              style={{
                background:
                  i < playerInput.length
                    ? SEQUENCE_COLORS[playerInput[i]]
                    : 'transparent',
                borderColor: 'var(--dim)',
              }}
            />
          ))}
        </div>
      )}
    </GameLayout>
  )
}
