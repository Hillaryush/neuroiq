import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import GamesPage        from '../pages/GamesPage'
import ProgressPage     from '../pages/ProgressPage'
import LeaderboardPage  from '../pages/LeaderboardPage'
import AchievementsPage from '../pages/AchievementsPage'

export default function AppRouter() {
  const activeTab = useAppStore(s => s.activeTab)
  return (
    <AnimatePresence mode="wait">
      <motion.div key={activeTab}
        initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}
        transition={{duration:0.18}}>
        {activeTab==='games'        && <GamesPage />}
        {activeTab==='progress'     && <ProgressPage />}
        {activeTab==='achievements' && <AchievementsPage />}
        {activeTab==='leaderboard'  && <LeaderboardPage />}
      </motion.div>
    </AnimatePresence>
  )
}
