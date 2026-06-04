import { motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import { sound } from '../services/soundService'
import type { GameMeta } from '../types'
import { DIFFICULTY_COLORS } from '../utils/constants'

interface Props { game: GameMeta; highScore: number; onClick: () => void }

const CAT_ICONS: Record<string, string> = {
  'Memory':'🧠','IQ & Logic':'💡','Attention':'👁️','Speed':'⚡','Coding':'💻'
}

export default function GameCard({ game, highScore, onClick }: Props) {
  const { stats, toggleFavorite } = useAppStore()
  const playCount = stats.gamePlayCount?.[game.id] || 0
  const isFav     = (stats.favorites || []).includes(game.id)
  const winRate   = playCount > 0 ? Math.min(Math.round((highScore / (playCount * 200)) * 100), 99) : null

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: `0 16px 48px ${game.accent}30` }}
      whileTap={{ scale: 0.97 }}
      className="rounded-2xl cursor-pointer relative overflow-hidden group"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        padding: 'clamp(12px,2.5vw,20px)',
        transition: 'border-color .2s, box-shadow .2s',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = game.accent + '99'; sound.hover() }}
      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'}
      onClick={() => { sound.click(); onClick() }}
    >
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 rounded-t-2xl"
        style={{ height: 2, background: `linear-gradient(90deg,${game.accent},${game.accent}44)` }} />

      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(circle at 50% 0%,${game.accent}15,transparent 65%)` }} />

      {/* Badge — top left */}
      {game.badge && (
        <span className="absolute rounded-full font-bold z-10"
          style={{
            top: 'clamp(10px,1.5vw,14px)',
            left: 'clamp(10px,1.5vw,14px)',
            background: game.badge === 'NEW' ? '#00d4aa' : game.badge === 'HOT' ? '#ff6b6b' : '#7c6cff',
            color: game.badge === 'NEW' ? '#000' : '#fff',
            padding: '2px 7px', fontSize: 9, letterSpacing: 1,
          }}>
          {game.badge}
        </span>
      )}

      {/* Favorite star — top right */}
      <button
        onClick={e => { e.stopPropagation(); sound.click(); toggleFavorite(game.id) }}
        className="absolute z-10 transition-all duration-200 hover:scale-125"
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          top: 'clamp(8px,1.5vw,12px)', right: 'clamp(8px,1.5vw,12px)',
          fontSize: 'clamp(12px,2vw,15px)',
          filter: isFav ? 'none' : 'grayscale(1)',
          opacity: isFav ? 1 : 0.3,
        }}>
        ⭐
      </button>

      {/* Icon */}
      <div style={{
        fontSize: 'clamp(24px,4vw,32px)',
        marginTop: game.badge ? 'clamp(18px,3vw,24px)' : 4,
        marginBottom: 'clamp(6px,1.5vw,10px)',
      }}>
        {game.icon}
      </div>

      {/* Name */}
      <h3 className="font-bold leading-tight" style={{
        color: 'white', marginBottom: 4,
        fontSize: 'clamp(12px,1.8vw,15px)', paddingRight: 16,
      }}>
        {game.name}
      </h3>

      {/* Description */}
      <p className="line-clamp-2 leading-relaxed" style={{
        color: 'var(--muted)',
        marginBottom: 'clamp(8px,1.5vw,12px)',
        fontSize: 'clamp(10px,1.5vw,12px)',
      }}>
        {game.description}
      </p>

      {/* Play stats */}
      {playCount > 0 && (
        <div className="flex justify-between mb-1.5" style={{ fontSize: 'clamp(9px,1.3vw,11px)', color: 'var(--muted)' }}>
          <span>Played {playCount}×</span>
          {winRate !== null && <span style={{ color: '#00d4aa', fontWeight: 600 }}>{winRate}% win</span>}
        </div>
      )}
      {highScore > 0 && (
        <div className="flex justify-between mb-2" style={{ fontSize: 'clamp(9px,1.3vw,11px)' }}>
          <span style={{ color: 'var(--muted)' }}>Best</span>
          <span className="font-bold" style={{ color: '#ffd166' }}>🏆 {highScore.toLocaleString()}</span>
        </div>
      )}

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }} />

      {/* Bottom row */}
      <div className="flex items-center justify-between">
        <span className="rounded-full font-semibold" style={{
          background: DIFFICULTY_COLORS[game.difficulty] + '22',
          color: DIFFICULTY_COLORS[game.difficulty],
          border: `1px solid ${DIFFICULTY_COLORS[game.difficulty]}33`,
          padding: '2px 9px', fontSize: 'clamp(9px,1.3vw,11px)',
        }}>
          {game.difficulty}
        </span>
        <div className="flex items-center gap-1">
          <span style={{ fontSize: 'clamp(10px,1.5vw,12px)' }}>{CAT_ICONS[game.category]}</span>
          <span className="font-bold" style={{ color: game.accent, fontSize: 'clamp(9px,1.3vw,11px)' }}>
            +{game.iqGain} IQ
          </span>
        </div>
      </div>
    </motion.div>
  )
}