/**
 * Question Rotation Engine
 * ─────────────────────────
 * - Daily seed: questions shuffle differently each day (same for all users that day)
 * - Per-user no-repeat: once a user sees a question, it won't repeat until the pool is exhausted
 * - Seen IDs persist in localStorage (and synced to Supabase via profileService for logged-in users)
 */

const SEEN_KEY_PREFIX = 'neuroiq:seen:'

export interface QuestionBank<T> {
  easy: T[]
  medium: T[]
  hard: T[]
  expert: T[]
}

export type DifficultyTier = 'easy' | 'medium' | 'hard' | 'expert'

/** Deterministic daily seed — same number all day, changes at midnight */
export function getDailySeed(): number {
  const today = new Date()
  const dateStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
  let hash = 0
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

/** Seeded shuffle — same seed always produces same order (so "daily rotation" is consistent for everyone that day) */
export function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr]
  let s = seed
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280
    const j = Math.floor((s / 233280) * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/** Get the set of question IDs this user/game has already seen */
function getSeenIds(gameId: string): Set<string> {
  try {
    const raw = localStorage.getItem(SEEN_KEY_PREFIX + gameId)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

function markSeen(gameId: string, id: string) {
  const seen = getSeenIds(gameId)
  seen.add(id)
  try {
    localStorage.setItem(SEEN_KEY_PREFIX + gameId, JSON.stringify([...seen]))
  } catch { /* ignore quota errors */ }
}

function resetSeen(gameId: string) {
  try { localStorage.removeItem(SEEN_KEY_PREFIX + gameId) } catch { /* ignore */ }
}

/**
 * Picks the next question for a game, respecting:
 * 1. Difficulty tier (based on current score/level)
 * 2. Daily rotation (different order each day, shared across users)
 * 3. No-repeat (won't show a question already seen until pool exhausted)
 */
export function pickQuestion<T extends { id: string }>(
  gameId: string,
  bank: QuestionBank<T>,
  tier: DifficultyTier
): T {
  // Build a tiered pool: prefer current tier, fall back to adjacent tiers if exhausted
  const tierOrder: DifficultyTier[] = (() => {
    switch (tier) {
      case 'expert': return ['expert', 'hard']
      case 'hard':   return ['hard', 'medium']
      case 'medium': return ['medium', 'easy']
      default:       return ['easy', 'medium']
    }
  })()

  const seed = getDailySeed()
  const seen = getSeenIds(gameId)

  for (const t of tierOrder) {
    const pool = bank[t]
    if (!pool || pool.length === 0) continue
    const rotated = seededShuffle(pool, seed + t.length)
    const unseen = rotated.filter(q => !seen.has(q.id))
    if (unseen.length > 0) {
      const pick = unseen[Math.floor(Math.random() * unseen.length)]
      markSeen(gameId, pick.id)
      return pick
    }
  }

  // Entire bank exhausted for this user — reset and start a fresh cycle
  resetSeen(gameId)
  const fallbackPool = bank[tier].length > 0 ? bank[tier] : bank.easy
  const pick = fallbackPool[Math.floor(Math.random() * fallbackPool.length)]
  markSeen(gameId, pick.id)
  return pick
}

/** Difficulty tier based on current in-game score (progressive difficulty) */
export function getTierFromScore(score: number, thresholds: { medium: number; hard: number; expert: number }): DifficultyTier {
  if (score >= thresholds.expert) return 'expert'
  if (score >= thresholds.hard) return 'hard'
  if (score >= thresholds.medium) return 'medium'
  return 'easy'
}

/** Recommended time limits per tier (in seconds) — Hard/Expert get much longer */
export const TIER_TIME_LIMITS: Record<DifficultyTier, number> = {
  easy: 30,
  medium: 45,
  hard: 90,
  expert: 120,
}

export const TIER_COLORS: Record<DifficultyTier, string> = {
  easy: '#00d4aa',
  medium: '#ffd166',
  hard: '#ff6b6b',
  expert: '#7c6cff',
}

export const TIER_LABELS: Record<DifficultyTier, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  expert: 'Expert',
}
