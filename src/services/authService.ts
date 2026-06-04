import { supabase } from './supabase'


// ─── Sign Up with email + password ─────────────────────────────────────────
export async function signUp(email: string, password: string, name: string, avatar: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, avatar },
      emailRedirectTo: window.location.origin,
    },
  })
  if (error) throw error

  // Create profile row immediately
  if (data.user) {
    await supabase.from('profiles').upsert({
      id:          data.user.id,
      username:    name,
      avatar,
      iq_score:    100,
      total_xp:    0,
      day_streak:  0,
      last_played_date: '',
      games_played: 0,
      brain_level: 'Bronze',
      skills: { workingMemory:50, processingSpeed:50, fluidReasoning:50, verbalAbility:50, visualSpatial:50, attentionFocus:50, logicReasoning:50 },
      weekly_xp:   [0,0,0,0,0,0,0],
      high_scores: {},
      game_play_count: {},
      favorites:   [],
      adaptive_difficulty: {},
      achievements: [],
    }, { onConflict: 'id' })
  }

  return data
}

// ─── Sign In ────────────────────────────────────────────────────────────────
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

// ─── Google OAuth ────────────────────────────────────────────────────────────
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  })
  if (error) throw error
  return data
}

// ─── GitHub OAuth ─────────────────────────────────────────────────────────
export async function signInWithGitHub() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: { redirectTo: window.location.origin },
  })
  if (error) throw error
  return data
}

// ─── Sign Out ───────────────────────────────────────────────────────────────
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// ─── Get current session ────────────────────────────────────────────────────
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

