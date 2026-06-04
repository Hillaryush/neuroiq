import type { GameId, GameResult } from '../types'

const IQ_GAIN_MAP: Record<string, number> = {
  memory:8, numberrecall:10, sequence:6, color:7, pattern:15,
  oddoneout:10, logicseries:12, analogies:12, strooptest:11,
  focuschallenge:8, math:12, wordchain:10, debugchallenge:13, algorithmpuzzle:15,
}

export function calculateXP(score: number): number { return Math.floor(score/5) }

export function calculateIQGain(score: number, gameId: GameId): number {
  const base = IQ_GAIN_MAP[gameId] || 5
  if (score>=800) return base
  if (score>=500) return Math.floor(base*0.8)
  if (score>=250) return Math.floor(base*0.5)
  return Math.floor(base*0.2)
}

export function buildResult(gameId: GameId, score: number, level?: number): GameResult {
  return { gameId, score, xpEarned: calculateXP(score), iqGain: calculateIQGain(score, gameId), timestamp: Date.now(), level }
}
