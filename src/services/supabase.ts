import { createClient } from '@supabase/supabase-js'

const env = (import.meta as unknown as { env: Record<string, string> }).env

// Supports both new publishable key (sb_publishable_...) and legacy anon key (eyJ...)
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnon = env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnon)

export interface DbProfile {
  id: string; username: string; avatar: string
  iq_score: number; total_xp: number; day_streak: number
  last_played_date: string; games_played: number; brain_level: string
  skills: Record<string,number>; weekly_xp: number[]
  high_scores: Record<string,number>; game_play_count: Record<string,number>
  favorites: string[]; adaptive_difficulty: Record<string,number>
  achievements: Array<{id:string;unlocked:boolean;unlockedAt?:number}>
  created_at: string; updated_at: string
}
