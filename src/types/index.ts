export type GameId =
  | 'memory' | 'math' | 'sequence' | 'pattern' | 'wordchain' | 'color'
  | 'numberrecall' | 'strooptest' | 'oddoneout' | 'logicseries'
  | 'analogies' | 'focuschallenge' | 'debugchallenge' | 'algorithmpuzzle'

export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert'
export type Tab = 'games' | 'progress' | 'leaderboard' | 'achievements'
export type BrainLevel = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Master' | 'Grandmaster'

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  joinedAt: number
}

export interface GameMeta {
  id: GameId
  name: string
  description: string
  icon: string
  difficulty: Difficulty
  iqGain: number
  accent: string
  badge?: 'NEW' | 'HOT' | 'PRO'
  cognitiveSkill: keyof PlayerStats['skills']
  category: 'Memory' | 'IQ & Logic' | 'Attention' | 'Speed' | 'Coding'
}

export interface Achievement {
  id: string; title: string; description: string
  icon: string; unlocked: boolean; unlockedAt?: number; condition: string
}

export interface GameResult {
  gameId: GameId; score: number; xpEarned: number
  iqGain: number; timestamp: number; level?: number
}

export interface PlayerStats {
  iqScore: number; totalXP: number; dayStreak: number
  lastPlayedDate: string; gamesPlayed: number; brainLevel: BrainLevel
  highScores: Record<string, number>
  gamePlayCount: Record<string, number>
  favorites: string[]
  weeklyXP: number[]
  skills: {
    workingMemory: number; processingSpeed: number; fluidReasoning: number
    verbalAbility: number; visualSpatial: number; attentionFocus: number; logicReasoning: number
  }
  achievements: Achievement[]
  history: GameResult[]
  adaptiveDifficulty: Record<string, number>
}

export interface LeaderboardEntry {
  rank: number; name: string; xp: number; iq: number; country?: string; isYou?: boolean
}
