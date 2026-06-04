import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PlayerStats, GameResult, Tab, Achievement, BrainLevel, User } from '../types'
import { DEFAULT_ACHIEVEMENTS, BRAIN_LEVELS } from '../utils/constants'

export const DEFAULT_STATS: PlayerStats = {
  iqScore:100, totalXP:0, dayStreak:0, lastPlayedDate:'',
  gamesPlayed:0, brainLevel:'Bronze',
  highScores:{}, gamePlayCount:{}, favorites:[],
  weeklyXP:[0,0,0,0,0,0,0],
  skills:{ workingMemory:50, processingSpeed:50, fluidReasoning:50, verbalAbility:50, visualSpatial:50, attentionFocus:50, logicReasoning:50 },
  achievements:DEFAULT_ACHIEVEMENTS, history:[], adaptiveDifficulty:{},
}

const SKILL_MAP: Record<string, keyof PlayerStats['skills']> = {
  memory:'workingMemory', numberrecall:'workingMemory', sequence:'workingMemory',
  color:'visualSpatial', pattern:'fluidReasoning', oddoneout:'fluidReasoning',
  logicseries:'fluidReasoning', analogies:'verbalAbility', strooptest:'attentionFocus',
  focuschallenge:'attentionFocus', math:'processingSpeed', wordchain:'verbalAbility',
  debugchallenge:'logicReasoning', algorithmpuzzle:'logicReasoning',
}

function getBrainLevel(xp:number): BrainLevel {
  return ([...BRAIN_LEVELS].reverse().find(b=>xp>=b.minXP)||BRAIN_LEVELS[0]).level
}

function checkAchievements(s:PlayerStats): Achievement[] {
  return s.achievements.map(a => {
    if (a.unlocked) return a
    let unlock = false
    if (a.condition==='gamesPlayed >= 1'  && s.gamesPlayed>=1)  unlock=true
    if (a.condition==='dayStreak >= 3'    && s.dayStreak>=3)    unlock=true
    if (a.condition==='dayStreak >= 7'    && s.dayStreak>=7)    unlock=true
    if (a.condition==='iqScore >= 110'    && s.iqScore>=110)    unlock=true
    if (a.condition==='iqScore >= 120'    && s.iqScore>=120)    unlock=true
    if (a.condition==='iqScore >= 130'    && s.iqScore>=130)    unlock=true
    if (a.condition==='totalXP >= 1000'   && s.totalXP>=1000)  unlock=true
    if (a.condition==='totalXP >= 5000'   && s.totalXP>=5000)  unlock=true
    if (a.condition.startsWith('highScores.')) {
      const parts = a.condition.replace('highScores.','').split(' >= ')
      if ((s.highScores[parts[0]]||0) >= parseInt(parts[1])) unlock=true
    }
    return unlock ? { ...a, unlocked:true, unlockedAt:Date.now() } : a
  })
}

interface AppState {
  user: User | null
  stats: PlayerStats
  activeTab: Tab
  newAchievement: Achievement | null
  isLoadingProfile: boolean
  setUser: (u: User | null) => void
  setStats: (s: Partial<PlayerStats>) => void
  setActiveTab: (tab: Tab) => void
  recordResult: (result: GameResult) => void
  toggleFavorite: (gameId: string) => void
  clearNewAchievement: () => void
  resetStats: () => void
  setLoadingProfile: (v: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      stats: DEFAULT_STATS,
      activeTab: 'games',
      newAchievement: null,
      isLoadingProfile: false,

      setUser:            (user) => set({ user }),
      setLoadingProfile:  (v)    => set({ isLoadingProfile: v }),
      setActiveTab:       (tab)  => set({ activeTab: tab }),
      clearNewAchievement: ()    => set({ newAchievement: null }),
      resetStats:         ()     => set({ stats: DEFAULT_STATS }),

      setStats: (partial) => set((state) => ({
        stats: { ...state.stats, ...partial }
      })),

      toggleFavorite: (gameId) => set((state) => {
        const favs = state.stats.favorites || []
        const next = favs.includes(gameId) ? favs.filter(f=>f!==gameId) : [...favs, gameId]
        return { stats: { ...state.stats, favorites: next } }
      }),

      recordResult: (result) => set((state) => {
        const s = { ...state.stats }
        const today = new Date().toDateString()

        if (s.lastPlayedDate !== today) {
          const yesterday = new Date(); yesterday.setDate(yesterday.getDate()-1)
          s.dayStreak = s.lastPlayedDate===yesterday.toDateString() ? s.dayStreak+1 : 1
          s.lastPlayedDate = today
        }

        s.totalXP     += result.xpEarned
        s.iqScore      = Math.min(200, s.iqScore + result.iqGain)
        s.gamesPlayed += 1
        s.brainLevel   = getBrainLevel(s.totalXP)
        s.gamePlayCount = { ...s.gamePlayCount, [result.gameId]: (s.gamePlayCount[result.gameId]||0)+1 }

        if (result.score > (s.highScores[result.gameId]||0))
          s.highScores = { ...s.highScores, [result.gameId]: result.score }

        const prev = s.adaptiveDifficulty[result.gameId]||1
        s.adaptiveDifficulty = {
          ...s.adaptiveDifficulty,
          [result.gameId]: result.score>300 ? Math.min(prev+0.1,3) : Math.max(prev-0.05,0.5)
        }

        const sk = SKILL_MAP[result.gameId]
        if (sk) {
          s.skills = { ...s.skills, [sk]: Math.min(100, s.skills[sk]+Math.floor(result.xpEarned/20)) }
          s.skills.attentionFocus = Math.min(100, s.skills.attentionFocus+1)
        }

        const dayIdx = (new Date().getDay()+6)%7
        const weekly = [...s.weeklyXP]; weekly[dayIdx]=(weekly[dayIdx]||0)+result.xpEarned
        s.weeklyXP = weekly

        const prevAch = s.achievements
        s.achievements = checkAchievements(s)
        const newly = s.achievements.find((a,i)=>a.unlocked&&!prevAch[i].unlocked)

        s.history = [result, ...s.history].slice(0,50)
        return { stats:s, newAchievement: newly||state.newAchievement }
      }),
    }),
    {
      name: 'neuroiq-v3',
      partialize: (state) => ({
        // Only persist locally as fallback — Supabase is source of truth
        user:   state.user,
        stats:  state.stats,
        activeTab: state.activeTab,
      }),
    }
  )
)
