import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { signIn, signUp, signInWithGoogle, signInWithGitHub } from '../services/authService'
import { sound } from '../services/soundService'

const AVATARS = ['🧠','🦁','🚀','⚡','🎯','💎','🔥','🌟','👑','🦅']

type Mode = 'landing' | 'login' | 'signup'

export default function LoginPage() {
  const [mode, setMode]       = useState<Mode>('landing')
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [pass, setPass]       = useState('')
  const [avatar, setAvatar]   = useState(0)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [verifyMsg, setVerify]= useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setVerify('')
    if (!email.includes('@')) { setError('Enter a valid email address'); return }
    if (pass.length < 6) { setError('Password must be at least 6 characters'); return }
    if (mode === 'signup' && !name.trim()) { setError('Enter your name'); return }

    setLoading(true)
    try {
      if (mode === 'signup') {
        const result = await signUp(email, pass, name.trim(), AVATARS[avatar])
        if (result.user && !result.session) {
          // Email confirmation required
          setVerify('Check your email and click the confirmation link, then sign in!')
          setMode('login')
        }
        sound.gameStart()
      } else {
        await signIn(email, pass)
        sound.gameStart()
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      setError(
        msg.includes('Invalid login') ? 'Wrong email or password' :
        msg.includes('already registered') ? 'Email already in use — sign in instead' :
        msg.includes('Email not confirmed') ? 'Please confirm your email first' :
        msg
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    sound.click()
    try { await signInWithGoogle() } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Google sign in failed')
    }
  }

  async function handleGitHub() {
    sound.click()
    try { await signInWithGitHub() } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'GitHub sign in failed')
    }
  }

  const inputStyle = {
    background: 'var(--surface)', border: '1px solid var(--border)',
    color: 'white', outline: 'none', width: '100%',
    padding: '12px 16px', borderRadius: 12, fontSize: 14,
    fontFamily: 'Space Grotesk, sans-serif',
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: 'var(--bg)' }}>

      {/* Background glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle,#7c6cff14,transparent 70%)', filter: 'blur(40px)' }} />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle,#00d4aa10,transparent 70%)', filter: 'blur(40px)' }} />

      <div className="relative z-10 w-full" style={{ maxWidth: 420 }}>
        <AnimatePresence mode="wait">

          {/* ── LANDING ─────────────────────────────────────────────── */}
          {mode === 'landing' && (
            <motion.div key="landing" initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-20 }}>
              {/* Logo */}
              <div className="text-center mb-8">
                <motion.div initial={{ scale:0,rotate:-10 }} animate={{ scale:1,rotate:0 }}
                  transition={{ type:'spring', stiffness:200, delay:0.1 }} className="text-7xl mb-4">🧠</motion.div>
                <h1 className="font-display font-extrabold gradient-text" style={{ fontSize:52, letterSpacing:-2, lineHeight:1 }}>
                  NeuroIQ
                </h1>
                <p className="text-sm mt-2 uppercase tracking-widest" style={{ color:'var(--muted)', letterSpacing:4 }}>
                  World-Class Brain Training
                </p>
              </div>

              {/* Feature list */}
              <div className="grid grid-cols-2 gap-2 mb-8">
                {[
                  { icon:'🎮', text:'14 Brain Games' },
                  { icon:'📈', text:'IQ Tracking' },
                  { icon:'🤖', text:'AI Coach' },
                  { icon:'☁️', text:'Cloud Sync' },
                  { icon:'🏆', text:'Leaderboards' },
                  { icon:'🔥', text:'Daily Challenges' },
                ].map(f => (
                  <div key={f.text} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
                    style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
                    <span>{f.icon}</span>
                    <span style={{ color:'var(--muted)' }}>{f.text}</span>
                  </div>
                ))}
              </div>

              {/* Social auth */}
              <div className="space-y-2 mb-4">
                <button onClick={handleGoogle}
                  className="w-full py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-3 transition-all"
                  style={{ background:'var(--card)', border:'1px solid var(--border)', color:'white', cursor:'pointer' }}
                  onMouseEnter={e=>(e.currentTarget.style.borderColor='#4285f488')}
                  onMouseLeave={e=>(e.currentTarget.style.borderColor='var(--border)')}>
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>

                <button onClick={handleGitHub}
                  className="w-full py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-3 transition-all"
                  style={{ background:'var(--card)', border:'1px solid var(--border)', color:'white', cursor:'pointer' }}
                  onMouseEnter={e=>(e.currentTarget.style.borderColor='#ffffff44')}
                  onMouseLeave={e=>(e.currentTarget.style.borderColor='var(--border)')}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  Continue with GitHub
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px" style={{ background:'var(--border)' }} />
                <span className="text-xs" style={{ color:'var(--dim)' }}>or</span>
                <div className="flex-1 h-px" style={{ background:'var(--border)' }} />
              </div>

              {/* Email options */}
              <div className="space-y-2">
                <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                  onClick={() => { sound.click(); setMode('signup') }}
                  className="w-full py-3.5 rounded-2xl font-bold text-white text-sm"
                  style={{ background:'linear-gradient(135deg,#7c6cff,#5544ee)', border:'none', cursor:'pointer' }}>
                  🚀 Create Free Account
                </motion.button>
                <button onClick={() => { sound.click(); setMode('login') }}
                  className="w-full py-3 rounded-2xl font-semibold text-sm"
                  style={{ background:'transparent', border:'1px solid var(--border)', color:'var(--muted)', cursor:'pointer' }}>
                  Sign in with Email
                </button>
              </div>

              {error && (
                <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }}
                  className="text-xs text-center mt-3 px-3 py-2 rounded-xl"
                  style={{ background:'#ff6b6b22', color:'#ff6b6b', border:'1px solid #ff6b6b44' }}>
                  ⚠️ {error}
                </motion.p>
              )}
            </motion.div>
          )}

          {/* ── SIGN UP / LOGIN ──────────────────────────────────────── */}
          {(mode === 'login' || mode === 'signup') && (
            <motion.div key={mode} initial={{ opacity:0,x:30 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:-30 }}>
              <button onClick={() => { sound.click(); setMode('landing'); setError('') }}
                className="flex items-center gap-2 mb-6 text-sm"
                style={{ background:'none', border:'none', color:'var(--muted)', cursor:'pointer' }}>
                ← Back
              </button>

              <div className="text-center mb-6">
                <h2 className="font-display font-extrabold text-2xl gradient-text">
                  {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p className="text-sm mt-1" style={{ color:'var(--muted)' }}>
                  {mode === 'signup' ? 'Start your IQ journey today' : 'Sign in to continue training'}
                </p>
              </div>

              {verifyMsg && (
                <motion.div initial={{ opacity:0,y:-8 }} animate={{ opacity:1,y:0 }}
                  className="mb-4 px-4 py-3 rounded-2xl text-sm"
                  style={{ background:'#00d4aa18', border:'1px solid #00d4aa44', color:'#00d4aa' }}>
                  ✅ {verifyMsg}
                </motion.div>
              )}

              {/* Avatar picker */}
              {mode === 'signup' && (
                <div className="mb-5">
                  <p className="text-xs uppercase tracking-widest mb-2" style={{ color:'var(--muted)' }}>Choose Avatar</p>
                  <div className="flex gap-2 flex-wrap">
                    {AVATARS.map((av, i) => (
                      <button key={i} onClick={() => { sound.click(); setAvatar(i) }}
                        className="w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all"
                        style={{
                          background: avatar === i ? '#7c6cff33' : 'var(--surface)',
                          border: `2px solid ${avatar === i ? '#7c6cff' : 'var(--border)'}`,
                          transform: avatar === i ? 'scale(1.15)' : 'scale(1)',
                          cursor: 'pointer',
                        }}>
                        {av}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                {mode === 'signup' && (
                  <div>
                    <label className="text-xs uppercase tracking-wider mb-1 block" style={{ color:'var(--muted)' }}>Full Name</label>
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
                      style={inputStyle}
                      onFocus={e => (e.target.style.borderColor='#7c6cff')}
                      onBlur={e => (e.target.style.borderColor='var(--border)')} />
                  </div>
                )}
                <div>
                  <label className="text-xs uppercase tracking-wider mb-1 block" style={{ color:'var(--muted)' }}>Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                    style={inputStyle}
                    onFocus={e => (e.target.style.borderColor='#7c6cff')}
                    onBlur={e => (e.target.style.borderColor='var(--border)')} />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider mb-1 block" style={{ color:'var(--muted)' }}>Password</label>
                  <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••"
                    style={inputStyle}
                    onFocus={e => (e.target.style.borderColor='#7c6cff')}
                    onBlur={e => (e.target.style.borderColor='var(--border)')} />
                </div>

                {error && (
                  <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }}
                    className="text-xs px-3 py-2 rounded-xl"
                    style={{ background:'#ff6b6b22', color:'#ff6b6b', border:'1px solid #ff6b6b44' }}>
                    ⚠️ {error}
                  </motion.p>
                )}

                <motion.button type="submit" disabled={loading}
                  whileHover={!loading ? { scale:1.02 } : {}} whileTap={!loading ? { scale:0.98 } : {}}
                  className="w-full py-4 rounded-2xl font-bold text-white text-sm mt-2"
                  style={{ background:'linear-gradient(135deg,#7c6cff,#5544ee)', border:'none',
                    cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.span animate={{ rotate:360 }} transition={{ repeat:Infinity,duration:0.8,ease:'linear' }}>⚙️</motion.span>
                      {mode === 'signup' ? 'Creating account...' : 'Signing in...'}
                    </span>
                  ) : mode === 'signup' ? '🚀 Create Account' : '🧠 Sign In'}
                </motion.button>
              </form>

              <div className="text-center mt-4">
                <button onClick={() => { sound.click(); setMode(mode==='login'?'signup':'login'); setError('') }}
                  className="text-xs" style={{ background:'none', border:'none', color:'var(--muted)', cursor:'pointer' }}>
                  {mode === 'login' ? "Don't have an account? Sign up →" : 'Already have an account? Sign in →'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
