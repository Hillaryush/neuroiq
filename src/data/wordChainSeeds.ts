import type { QuestionBank } from '../utils/questionEngine'

export interface WordSeed {
  id: string
  word: string
}

// Easy: short common words (3-4 letters), Medium: 4-5 letters,
// Hard: 5-6 letters less common, Expert: 6+ letters / advanced vocabulary
const EASY: WordSeed[] = [
  'cat','dog','sun','art','toy','eye','use','act','eat','net',
  'tip','pan','now','war','ran','aim','oak','key','kit','ten',
].map((w, i) => ({ id: `we${i}`, word: w }))

const MEDIUM: WordSeed[] = [
  'apple','grape','house','plant','river','stone','cloud','bread',
  'chair','table','smile','dance','music','beach','tiger','eagle',
].map((w, i) => ({ id: `wm${i}`, word: w }))

const HARD: WordSeed[] = [
  'guitar','planet','bridge','castle','forest','dragon','wonder',
  'puzzle','silver','garden','crystal','marble','temple','voyage',
].map((w, i) => ({ id: `wh${i}`, word: w }))

const EXPERT: WordSeed[] = [
  'eloquent','paradox','ambiguous','resilient','ephemeral',
  'meticulous','tenacious','perpetual','formidable','articulate',
  'serendipity','quintessence','phenomenon','juxtaposition',
].map((w, i) => ({ id: `wx${i}`, word: w }))

export const WORD_CHAIN_BANK: QuestionBank<WordSeed> = {
  easy: EASY, medium: MEDIUM, hard: HARD, expert: EXPERT,
}

// Minimum word length required per tier (Expert demands longer chains)
export const MIN_LENGTH_BY_TIER: Record<string, number> = {
  easy: 2, medium: 3, hard: 4, expert: 5,
}
