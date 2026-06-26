import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sound } from '../../services/soundService'
import GameLayout from '../GameLayout'
import { WORD_CHAIN_BANK, MIN_LENGTH_BY_TIER } from '../../data/wordChainSeeds'
import { pickQuestion, getTierFromScore, TIER_COLORS, TIER_LABELS, type DifficultyTier } from '../../utils/questionEngine'

interface Props { onFinish: (s: number) => void; onExit: () => void }

const THRESHOLDS = { medium: 100, hard: 280, expert: 550 }

export default function WordChain({ onFinish, onExit }: Props) {
  const [tier, setTier]           = useState<DifficultyTier>('easy')
  const [currentWord, setCurrent] = useState(() => pickQuestion('wordchain', WORD_CHAIN_BANK, 'easy').word)
  const [chain, setChain]         = useState<string[]>([])
  const [used, setUsed]           = useState<Set<string>>(new Set())
  const [input, setInput]         = useState('')
  const [score, setScore]         = useState(0)
  const [feedback, setFeedback]   = useState<{ msg: string; type: 'ok' | 'err' } | null>(null)
  const [timeLeft, setTime]       = useState(60)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setUsed(new Set([currentWord]))
  }, []) // eslint-disable-line

  useEffect(() => {
    const t = setInterval(() => setTime(p => {
      if (p <= 1) { clearInterval(t); onFinish(score); return 0 }
      return p - 1
    }), 1000)
    return () => clearInterval(t)
  }, []) // eslint-disable-line

  useEffect(() => { inputRef.current?.focus() }, [currentWord])

  const minLen = MIN_LENGTH_BY_TIER[tier]
  const lastLetter = currentWord.slice(-1).toUpperCase()

  const submit = useCallback(() => {
    const word = input.trim().toLowerCase()
    if (!word) return

    const needed = currentWord.slice(-1)
    if (word[0] !== needed) {
      sound.wordRejected()
      setFeedback({ msg: `Must start with "${needed.toUpperCase()}"`, type: 'err' })
      setTimeout(() => setFeedback(null), 900)
      return
    }
    if (word.length < minLen) {
      sound.wordRejected()
      setFeedback({ msg: `Need ${minLen}+ letters at ${TIER_LABELS[tier]} level`, type: 'err' })
      setTimeout(() => setFeedback(null), 900)
      return
    }
    if (used.has(word)) {
      sound.wordRejected()
      setFeedback({ msg: 'Already used!', type: 'err' })
      setTimeout(() => setFeedback(null), 900)
      return
    }

    const tierMult = tier === 'expert' ? 3 : tier === 'hard' ? 2 : tier === 'medium' ? 1.4 : 1
    const pts = Math.round((word.length * 15 + 10) * tierMult)
    sound.wordAccepted()

    const newScore = score + pts
    setScore(newScore)
    setUsed(u => new Set([...u, word]))
    setChain(c => [...c, word])
    setCurrent(word)
    setInput('')
    setFeedback({ msg: `+${pts} pts!`, type: 'ok' })
    setTimeout(() => setFeedback(null), 600)

    // Difficulty progression — re-seed if entering a new tier for variety
    const newTier = getTierFromScore(newScore, THRESHOLDS)
    if (newTier !== tier) {
      setTier(newTier)
      sound.levelUp()
    }
  }, [input, currentWord, used, minLen, tier, score])

  const tierColor = TIER_COLORS[tier]

  return (
    <GameLayout title="Word Chain 💬" score={score} timerProgress={timeLeft / 60} timeLeft={timeLeft} onExit={onExit}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm px-3 py-1.5 rounded-xl flex-1 mr-2" style={{ background: '#7c6cff11', color: 'var(--muted)' }}>
          Words need <strong style={{ color: 'white' }}>{minLen}+ letters</strong> at this level
        </div>
        <span className="text-xs font-bold px-2 py-1 rounded-full shrink-0" style={{ background: tierColor + '22', color: tierColor }}>
          {TIER_LABELS[tier]}
        </span>
      </div>

      <div className="text-center mb-6">
        <motion.div key={currentWord} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="font-display font-extrabold tracking-widest mb-2"
          style={{ fontSize: 'clamp(32px,7vw,48px)', color: '#7c6cff' }}>
          {currentWord.toUpperCase()}
        </motion.div>
        <div className="text-sm" style={{ color: 'var(--muted)' }}>
          Next word starts with: <strong style={{ color: '#00d4aa', fontSize: 18 }}>{lastLetter}</strong>
        </div>
      </div>

      <input ref={inputRef} value={input} onChange={e => setInput(e.target.value.toLowerCase())}
        onKeyDown={e => e.key === 'Enter' && submit()}
        placeholder={`Type a word starting with ${lastLetter}...`}
        maxLength={20}
        className="w-full px-4 py-4 rounded-2xl text-center text-xl mb-3"
        style={{ background: 'var(--surface)', border: '2px solid var(--border)', color: 'white', outline: 'none' }}
        onFocus={e => (e.target.style.borderColor = '#7c6cff')}
        onBlur={e => (e.target.style.borderColor = 'var(--border)')} />

      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={submit}
        className="w-full py-4 rounded-2xl font-bold text-base text-white mb-4"
        style={{ background: 'linear-gradient(135deg,#7c6cff,#00d4aa)', border: 'none' }}>
        Submit Word →
      </motion.button>

      <AnimatePresence>
        {feedback && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-center font-bold text-lg mb-3" style={{ color: feedback.type === 'ok' ? '#00d4aa' : '#ff6b6b' }}>
            {feedback.type === 'ok' ? '✅' : '❌'} {feedback.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {chain.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {chain.slice(-10).map((w, i) => (
            <span key={i} className="px-3 py-1 rounded-full text-sm"
              style={{ background: '#7c6cff22', color: '#7c6cff', border: '1px solid #7c6cff44' }}>
              {w}
            </span>
          ))}
          {chain.length > 10 && <span className="text-sm" style={{ color: 'var(--muted)' }}>+{chain.length - 10} more</span>}
        </div>
      )}
    </GameLayout>
  )
}
