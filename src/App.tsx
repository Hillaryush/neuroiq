import { useAppStore } from './store/useAppStore'
import { useAuth } from './hooks/useAuth'
import { ThemeProvider }   from './context/ThemeContext'
import { GameProvider }    from './context/GameContext'
import FloatingBackground  from './components/FloatingBackground'
import MainLayout          from './layouts/MainLayout'
import Header              from './components/Header'
import StatsBar            from './components/StatsBar'
import TabNav              from './components/TabNav'
import AppRouter           from './routes/AppRouter'
import AchievementToast    from './components/AchievementToast'
import SoundToggle         from './components/SoundToggle'
import LoginPage           from './pages/LoginPage'
import { motion }          from 'framer-motion'
import './styles/components.css'

function AppInner() {
  const { stats, activeTab, setActiveTab, user, isLoadingProfile } = useAppStore()
  useAuth()

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background:'var(--bg)' }}>
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="text-center">
          <motion.div animate={{ rotate:360 }} transition={{ repeat:Infinity,duration:1,ease:'linear' }}
            className="text-5xl mb-4">⚙️</motion.div>
          <div className="font-display font-bold text-xl gradient-text">Loading brain profile...</div>
          <p className="text-sm mt-2" style={{ color:'var(--muted)' }}>Syncing from cloud ☁️</p>
        </motion.div>
      </div>
    )
  }

  if (!user) return <LoginPage />

  return (
    <ThemeProvider>
      <GameProvider>
        <FloatingBackground />
        <AchievementToast />
        <SoundToggle />
        <div className="relative" style={{ zIndex:1 }}>
          <MainLayout>
            <Header />
            <StatsBar stats={stats} />
            <TabNav active={activeTab} onChange={setActiveTab} />
            <AppRouter />
          </MainLayout>
        </div>
      </GameProvider>
    </ThemeProvider>
  )
}

export default function App() {
  return <AppInner />
}
