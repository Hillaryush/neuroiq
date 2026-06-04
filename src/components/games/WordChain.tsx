import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameTimer } from '../../hooks/useGameTimer'
import { useScore } from '../../hooks/useScore'
import { WORD_LIST } from '../../utils/constants'
import { sound } from '../../services/soundService'
import GameLayout from '../GameLayout'

interface Props {
  onFinish: (score: number) => void
  onExit: () => void
}

export default function WordChain({ onFinish, onExit }: Props) {
  const [currentWord, setCurrentWord] = useState(
    () => WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]
  )
  const [chain, setChain] = useState<string[]>([])
  const [used, setUsed] = useState<Set<string>>(new Set())
  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null)
  const { score, add } = useScore()
  const timer = useGameTimer(60, () => onFinish(score))
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    timer.start()
    setUsed(new Set([currentWord]))
  }, []) // eslint-disable-line

  useEffect(() => {
    inputRef.current?.focus()
  }, [currentWord])

  const submit = useCallback(() => {
    const word = input.trim().toLowerCase()
    if (!word) return

    const needed = currentWord.slice(-1)
    if (word[0] !== needed) {
      setFeedback({ msg: `Must start with "${needed.toUpperCase()}"`, type: 'err' })
      setTimeout(() => setFeedback(null), 900)
      return
    }
    if (word.length < 2) {
      setFeedback({ msg: 'Too short! (min 2 letters)', type: 'err' })
      setTimeout(() => setFeedback(null), 900)
      return
    }
    if (used.has(word)) {
      setFeedback({ msg: 'Already used!', type: 'err' })
      setTimeout(() => setFeedback(null), 900)
      return
    }

    const pts = word.length * 15 + 10
    sound.wordAccepted(); add(pts)
    setUsed((u) => new Set([...u, word]))
    setChain((c) => [...c, word])
    setCurrentWord(word)
    setInput('')
    setFeedback({ msg: `+${pts} pts!`, type: 'ok' })
    setTimeout(() => setFeedback(null), 600)
  }, [input, currentWord, used, add])

  const lastLetter = currentWord.slice(-1).toUpperCase()

  return (
    <GameLayout
      title="Word Chain 💬"
      score={score}
      timerProgress={timer.progress}
      timeLeft={timer.timeLeft}
      onExit={onExit}
    >
      <div
        className="text-center text-sm mb-4 px-4 py-2 rounded-xl"
        style={{ background: '#7c6cff11', color: 'var(--muted)' }}
      >
        Enter a word starting with the <strong style={{ color: 'white' }}>last letter</strong> of the current word
      </div>

      <div className="text-center mb-6">
        <motion.div
          key={currentWord}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="font-display font-extrabold tracking-widest mb-2"
          style={{ fontSize: 48, color: '#7c6cff' }}
        >
          {currentWord.toUpperCase()}
        </motion.div>
        <div className="text-sm" style={{ color: 'var(--muted)' }}>
          Next word must start with:{' '}
          <strong style={{ color: '#00d4aa', fontSize: 18 }}>{lastLetter}</strong>
        </div>
      </div>

      <input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value.toLowerCase())}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        placeholder={`Type a word starting with ${lastLetter}...`}
        maxLength={20}
        className="w-full px-4 py-4 rounded-2xl text-center text-xl mb-3"
        style={{
          background: 'var(--surface)',
          border: '2px solid var(--border)',
          color: 'white',
          outline: 'none',
        }}
        onFocus={(e) =>
          (e.target.style.borderColor = '#7c6cff')
        }
        onBlur={(e) =>
          (e.target.style.borderColor = 'var(--border)')
        }
      />

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={submit}
        className="w-full py-4 rounded-2xl font-bold text-base text-white mb-4"
        style={{
          background: 'linear-gradient(135deg, #7c6cff, #00d4aa)',
          border: 'none',
        }}
      >
        Submit Word →
      </motion.button>

      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center font-bold text-lg mb-3"
            style={{ color: feedback.type === 'ok' ? '#00d4aa' : '#ff6b6b' }}
          >
            {feedback.type === 'ok' ? '✅' : '❌'} {feedback.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {chain.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {chain.slice(-10).map((w, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full text-sm"
              style={{ background: '#7c6cff22', color: '#7c6cff', border: '1px solid #7c6cff44' }}
            >
              {w}
            </span>
          ))}
          {chain.length > 10 && (
            <span className="text-sm" style={{ color: 'var(--muted)' }}>
              +{chain.length - 10} more
            </span>
          )}
        </div>
      )}
    </GameLayout>
  )
}
