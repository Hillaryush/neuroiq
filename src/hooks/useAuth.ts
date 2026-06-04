import { useEffect, useRef } from 'react'
import { supabase } from '../services/supabase'
import { loadProfile, saveProfile } from '../services/profileService'
import { useAppStore } from '../store/useAppStore'
import type { User } from '../types'

function debounce<T extends (...args: Parameters<T>) => void>(fn: T, ms: number) {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms) }
}

export function useAuth() {
  const { setUser, setStats, setLoadingProfile, stats, user } = useAppStore()
  const saveRef = useRef(debounce(saveProfile, 2000))

  // Track whether profile has been loaded from Supabase yet.
  // Prevents auto-save from firing with default 0 values before load completes.
  const profileLoaded = useRef(false)

  // ── Listen for Supabase auth state changes ──────────────────────────────
  useEffect(() => {
    // Check existing session on mount
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setLoadingProfile(true)   // ← FIX 1: show loading spinner while fetching

        const appUser: User = {
          id:       session.user.id,
          name:     session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Brain Trainee',
          email:    session.user.email || '',
          avatar:   session.user.user_metadata?.avatar || '🧠',
          joinedAt: new Date(session.user.created_at).getTime(),
        }
        setUser(appUser)

        // Load cloud profile
        const profile = await loadProfile(session.user.id)
        if (profile) {
          setStats(profile)
        } else {
          // FIX 2: log if profile is missing so you can debug Supabase issues
          console.warn('useAuth: loadProfile returned null for user', session.user.id)
        }

        profileLoaded.current = true  // ← FIX 3: mark profile as loaded
        setLoadingProfile(false)      // ← FIX 1: hide spinner
      } else {
        setLoadingProfile(false)      // ← FIX 1: no session, stop showing spinner
      }
    })

    // Subscribe to auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setLoadingProfile(true)

        const appUser: User = {
          id:       session.user.id,
          name:     session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Brain Trainee',
          email:    session.user.email || '',
          avatar:   session.user.user_metadata?.avatar || '🧠',
          joinedAt: new Date(session.user.created_at).getTime(),
        }
        setUser(appUser)

        const profile = await loadProfile(session.user.id)
        if (profile) {
          setStats(profile)
        } else {
          console.warn('useAuth: loadProfile returned null on SIGNED_IN for user', session.user.id)
        }

        profileLoaded.current = true
        setLoadingProfile(false)
      }

      if (event === 'SIGNED_OUT') {
        profileLoaded.current = false
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [setUser, setStats, setLoadingProfile])

  // ── Auto-save stats to Supabase whenever they change ────────────────────
  useEffect(() => {
    // FIX 3: Only save AFTER profile has been loaded from Supabase.
    // Without this guard, on first mount the effect fires immediately with
    // DEFAULT_STATS (iqScore:100, totalXP:0) and overwrites real cloud data!
    if (user?.id && !user.id.startsWith('guest-') && profileLoaded.current) {
      saveRef.current(user.id, stats)
    }
  }, [stats, user])
}