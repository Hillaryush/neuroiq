import { supabase } from './supabase'
import type { PlayerStats } from '../types'
import { DEFAULT_ACHIEVEMENTS, BRAIN_LEVELS } from '../utils/constants'

// ─── Load profile from Supabase ─────────────────────────────────────────────
export async function loadProfile(userId: string): Promise<Partial<PlayerStats> | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error || !data) return null

  return {
    iqScore:          data.iq_score,
    totalXP:          data.total_xp,
    dayStreak:        data.day_streak,
    lastPlayedDate:   data.last_played_date,
    gamesPlayed:      data.games_played,
    brainLevel:       data.brain_level as PlayerStats['brainLevel'],
    skills:           data.skills,
    weeklyXP:         data.weekly_xp,
    highScores:       data.high_scores,
    gamePlayCount:    data.game_play_count,
    favorites:        data.favorites,
    adaptiveDifficulty: data.adaptive_difficulty,
    achievements:     data.achievements?.length
      ? DEFAULT_ACHIEVEMENTS.map(def => {
          const saved = data.achievements.find((a: {id:string}) => a.id === def.id)
          return saved ? { ...def, unlocked: saved.unlocked, unlockedAt: saved.unlockedAt } : def
        })
      : DEFAULT_ACHIEVEMENTS,
  }
}

// ─── Save profile to Supabase (debounced by caller) ─────────────────────────
export async function saveProfile(userId: string, stats: PlayerStats) {
  const { error } = await supabase.from('profiles').upsert({
    id:                  userId,
    username:            undefined, // don't overwrite name
    iq_score:            stats.iqScore,
    total_xp:            stats.totalXP,
    day_streak:          stats.dayStreak,
    last_played_date:    stats.lastPlayedDate,
    games_played:        stats.gamesPlayed,
    brain_level:         stats.brainLevel,
    skills:              stats.skills,
    weekly_xp:           stats.weeklyXP,
    high_scores:         stats.highScores,
    game_play_count:     stats.gamePlayCount,
    favorites:           stats.favorites,
    adaptive_difficulty: stats.adaptiveDifficulty,
    achievements:        stats.achievements.map(a => ({ id: a.id, unlocked: a.unlocked, unlockedAt: a.unlockedAt })),
    updated_at:          new Date().toISOString(),
  }, { onConflict: 'id' })

  if (error) console.warn('Profile save error:', error.message)
}

// ─── Save individual game result ─────────────────────────────────────────────
export async function saveGameResult(userId: string, result: {
  gameId: string; score: number; xpEarned: number; iqGain: number; level?: number
}) {
  await supabase.from('game_results').insert({
    user_id:    userId,
    game_id:    result.gameId,
    score:      result.score,
    xp_earned:  result.xpEarned,
    iq_gain:    result.iqGain,
    level:      result.level,
    played_at:  new Date().toISOString(),
  })
}

// ─── Get leaderboard ─────────────────────────────────────────────────────────
export async function getLeaderboard(limit = 10) {
  const { data } = await supabase
    .from('profiles')
    .select('id, username, avatar, iq_score, total_xp, brain_level')
    .order('total_xp', { ascending: false })
    .limit(limit)
  return data || []
}

// ─── Get next brain level XP ─────────────────────────────────────────────────
export function getNextLevelXP(totalXP: number) {
  const next = BRAIN_LEVELS.find(b => b.minXP > totalXP)
  return next ? next.minXP : null
}
