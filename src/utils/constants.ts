import type { GameMeta, Achievement, BrainLevel } from '../types'

export const GAMES: GameMeta[] = [
  // Memory
  { id: 'memory',          name: 'Memory Matrix',      description: 'Flip cards and find matching pairs. Tests working memory & sustained attention.',            icon: '🧩', difficulty: 'Medium', iqGain: 8,  accent: '#7c6cff', badge: 'HOT', cognitiveSkill: 'workingMemory',   category: 'Memory' },
  { id: 'numberrecall',    name: 'Number Recall',       description: 'Memorize a number sequence shown briefly, then type it back from memory.',                   icon: '🔢', difficulty: 'Medium', iqGain: 10, accent: '#60a5fa', badge: 'NEW', cognitiveSkill: 'workingMemory',   category: 'Memory' },
  { id: 'sequence',        name: 'Simon Says+',         description: 'Remember and repeat growing color sequences. Boosts short-term memory span.',                icon: '🎯', difficulty: 'Easy',   iqGain: 6,  accent: '#00d4aa',              cognitiveSkill: 'workingMemory',   category: 'Memory' },
  { id: 'color',           name: 'Color Memory',        description: 'Memorize and recall color sequences. Enhances visual-spatial working memory.',               icon: '🎨', difficulty: 'Medium', iqGain: 7,  accent: '#f472b6',              cognitiveSkill: 'visualSpatial',   category: 'Memory' },
  // IQ & Logic
  { id: 'pattern',         name: 'Pattern IQ',          description: 'Complete visual matrix patterns like Raven\'s Progressive Matrices. Fluid intelligence.',    icon: '🔷', difficulty: 'Expert', iqGain: 15, accent: '#ff6b6b', badge: 'HOT', cognitiveSkill: 'fluidReasoning',  category: 'IQ & Logic' },
  { id: 'oddoneout',       name: 'Odd One Out',         description: 'Find the item that doesn\'t belong in the group. Trains categorical reasoning.',             icon: '🔍', difficulty: 'Medium', iqGain: 10, accent: '#a78bfa', badge: 'NEW', cognitiveSkill: 'fluidReasoning',  category: 'IQ & Logic' },
  { id: 'logicseries',     name: 'Logic Series',        description: 'Complete numerical and symbol sequences by finding the underlying pattern.',                  icon: '📐', difficulty: 'Hard',   iqGain: 12, accent: '#fbbf24', badge: 'NEW', cognitiveSkill: 'fluidReasoning',  category: 'IQ & Logic' },
  { id: 'analogies',       name: 'Analogies',           description: 'Bird:Fly :: Fish:? Verbal and abstract analogical reasoning for IQ training.',               icon: '🧠', difficulty: 'Hard',   iqGain: 12, accent: '#34d399',              cognitiveSkill: 'verbalAbility',   category: 'IQ & Logic' },
  // Attention
  { id: 'strooptest',      name: 'Stroop Challenge',    description: 'Name the ink color, not the word. The classic cognitive interference test.',                 icon: '🎨', difficulty: 'Hard',   iqGain: 11, accent: '#f97316', badge: 'HOT', cognitiveSkill: 'attentionFocus',  category: 'Attention' },
  { id: 'focuschallenge',  name: 'Focus Challenge',     description: 'Click the moving target while ignoring distractors. Pure attention training.',               icon: '🎯', difficulty: 'Medium', iqGain: 8,  accent: '#ec4899', badge: 'NEW', cognitiveSkill: 'attentionFocus',  category: 'Attention' },
  // Speed
  { id: 'math',            name: 'Math Blitz',          description: 'Rapid arithmetic under time pressure. Sharpens processing speed and numerical fluency.',     icon: '⚡', difficulty: 'Hard',   iqGain: 12, accent: '#ffd166', badge: 'HOT', cognitiveSkill: 'processingSpeed', category: 'Speed' },
  { id: 'wordchain',       name: 'Word Chain',          description: 'Build chains of words using the last letter. Builds verbal fluency & mental lexicon.',       icon: '💬', difficulty: 'Medium', iqGain: 10, accent: '#a78bfa',              cognitiveSkill: 'verbalAbility',   category: 'Speed' },
  // Coding
  { id: 'debugchallenge',  name: 'Debug Challenge',     description: 'Find the bug in the code snippet. Trains logical analysis and attention to detail.',          icon: '🐛', difficulty: 'Hard',   iqGain: 13, accent: '#22d3ee', badge: 'NEW', cognitiveSkill: 'logicReasoning',  category: 'Coding' },
  { id: 'algorithmpuzzle', name: 'Algorithm Puzzle',    description: 'Arrange algorithm steps in the correct order. Builds computational thinking skills.',         icon: '⚙️', difficulty: 'Expert', iqGain: 15, accent: '#818cf8', badge: 'NEW', cognitiveSkill: 'logicReasoning',  category: 'Coding' },
]

export const GAME_CATEGORIES = ['Memory', 'IQ & Logic', 'Attention', 'Speed', 'Coding'] as const

export const DIFFICULTY_COLORS: Record<string, string> = {
  Easy:   '#00d4aa',
  Medium: '#ffd166',
  Hard:   '#ff6b6b',
  Expert: '#7c6cff',
}

export const BRAIN_LEVELS: { level: BrainLevel; minXP: number; color: string; icon: string }[] = [
  { level: 'Bronze',      minXP: 0,     color: '#cd7f32', icon: '🥉' },
  { level: 'Silver',      minXP: 500,   color: '#c0c0d0', icon: '🥈' },
  { level: 'Gold',        minXP: 1500,  color: '#ffd166', icon: '🥇' },
  { level: 'Platinum',    minXP: 3000,  color: '#e5e4e2', icon: '💎' },
  { level: 'Diamond',     minXP: 6000,  color: '#b9f2ff', icon: '💠' },
  { level: 'Master',      minXP: 10000, color: '#a78bfa', icon: '👑' },
  { level: 'Grandmaster', minXP: 20000, color: '#ff6b6b', icon: '🏆' },
]

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_game',     title: 'First Step',      description: 'Play your first game',                  icon: '🎮', unlocked: false, condition: 'gamesPlayed >= 1' },
  { id: 'streak_3',       title: '3 Day Streak',    description: 'Play 3 days in a row',                  icon: '🔥', unlocked: false, condition: 'dayStreak >= 3' },
  { id: 'streak_7',       title: '7 Day Streak',    description: 'Play 7 days in a row',                  icon: '🔥', unlocked: false, condition: 'dayStreak >= 7' },
  { id: 'iq_110',         title: 'Above Average',   description: 'Reach IQ score of 110',                 icon: '🧠', unlocked: false, condition: 'iqScore >= 110' },
  { id: 'iq_120',         title: 'Superior Mind',   description: 'Reach IQ score of 120',                 icon: '🧠', unlocked: false, condition: 'iqScore >= 120' },
  { id: 'iq_130',         title: 'Gifted',          description: 'Reach IQ score of 130',                 icon: '🌟', unlocked: false, condition: 'iqScore >= 130' },
  { id: 'memory_genius',  title: 'Memory Genius',   description: 'Score 500+ in Memory Matrix',           icon: '🧩', unlocked: false, condition: 'highScores.memory >= 500' },
  { id: 'math_master',    title: 'Math Master',     description: 'Score 800+ in Math Blitz',              icon: '⚡', unlocked: false, condition: 'highScores.math >= 800' },
  { id: 'logic_master',   title: 'Logic Master',    description: 'Score 600+ in Pattern IQ',              icon: '🔷', unlocked: false, condition: 'highScores.pattern >= 600' },
  { id: 'speed_demon',    title: 'Speed Demon',     description: 'Score 1000+ in Math Blitz',             icon: '⚡', unlocked: false, condition: 'highScores.math >= 1000' },
  { id: 'xp_1000',        title: 'XP Hunter',       description: 'Earn 1000 total XP',                   icon: '💎', unlocked: false, condition: 'totalXP >= 1000' },
  { id: 'xp_5000',        title: 'XP Legend',       description: 'Earn 5000 total XP',                   icon: '👑', unlocked: false, condition: 'totalXP >= 5000' },
  { id: 'all_games',      title: 'Explorer',        description: 'Play all 14 games at least once',       icon: '🗺️', unlocked: false, condition: 'allGamesPlayed' },
  { id: 'coder',          title: 'Code Breaker',    description: 'Complete Debug Challenge 5 times',      icon: '🐛', unlocked: false, condition: 'gameCount.debugchallenge >= 5' },
]

export const SEQUENCE_COLORS      = ['#7c6cff','#00d4aa','#ff6b6b','#ffd166','#f472b6','#60a5fa']
export const SEQUENCE_COLOR_NAMES = ['Purple','Teal','Red','Yellow','Pink','Blue']
export const MEMORY_EMOJIS        = ['🐶','🐱','🦊','🐻','🦁','🐸','🦄','🌈','⭐','🍕','🚀','🎮','🎯','🏆','💎','🎭']
export const WORD_LIST = [
  'cat','dog','sun','art','toy','eye','you','use','act','eat','ore','elf','fen','net',
  'tip','pan','now','war','ran','aim','oak','key','yak','kit','ten','nap','pie','ear',
  'ram','map','pen','nor','ray','yew','win','nod','den','nut','tan','new','wax','sin',
  'nib','bar','rut','top','pot','tar','rib','bay','yam','mud','dew','owl','lid','dig',
]

export const LEADERBOARD = [
  { rank:1, name:'NeuralNinja',  xp:9842, iq:142, country:'🇯🇵' },
  { rank:2, name:'CortexKing',   xp:8701, iq:138, country:'🇺🇸' },
  { rank:3, name:'SynapseX',     xp:7930, iq:135, country:'🇩🇪' },
  { rank:4, name:'MindMatrix',   xp:7210, iq:131, country:'🇮🇳' },
  { rank:5, name:'BrainBlaze',   xp:6540, iq:129, country:'🇬🇧' },
  { rank:6, name:'ThinkTank',    xp:5980, iq:127, country:'🇰🇷' },
  { rank:7, name:'IQWarrior',    xp:5310, iq:124, country:'🇨🇳' },
]
