import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import { LEADERBOARD } from '../utils/constants'

const REGIONS = [
  { label:'Global 🌍', entries: LEADERBOARD },
  { label:'India 🇮🇳', entries: [
    { rank:1, name:'BrainKing',   xp:6200, iq:135, country:'🇮🇳' },
    { rank:2, name:'IQMaster',    xp:5800, iq:131, country:'🇮🇳' },
    { rank:3, name:'NeuralBolt',  xp:5100, iq:128, country:'🇮🇳' },
    { rank:4, name:'MindSpeed',   xp:4400, iq:124, country:'🇮🇳' },
    { rank:5, name:'ThinkFast',   xp:3900, iq:121, country:'🇮🇳' },
  ]},
  { label:'USA 🇺🇸', entries: [
    { rank:1, name:'CortexKing',  xp:8701, iq:138, country:'🇺🇸' },
    { rank:2, name:'AlphaIQ',     xp:7200, iq:133, country:'🇺🇸' },
    { rank:3, name:'BrainForce',  xp:6100, iq:130, country:'🇺🇸' },
  ]},
]

export default function LeaderboardPage() {
  const { stats } = useAppStore()
  const [region, setRegion] = useState(0)

  type LBEntry = { rank:number; name:string; xp:number; iq:number; country?:string; isYou?:boolean }
  const playerEntry: LBEntry = { rank:0, name:'YOU 🫵', xp:stats.totalXP, iq:stats.iqScore, country:'🇮🇳', isYou:true }
  const base = REGIONS[region].entries
  const combined: LBEntry[] = [...base, playerEntry].sort((a,b)=>b.xp-a.xp).map((e,i)=>({...e,rank:i+1}))

  const rankColors: Record<number,string> = {1:'#ffd166',2:'#c0c0d0',3:'#cd7f32'}
  const rankEmoji:  Record<number,string>  = {1:'🥇',2:'🥈',3:'🥉'}

  const yourRank = combined.find(e=>e.isYou)?.rank || '—'

  return (
    <div className="space-y-4">
      {/* Your rank card */}
      <div className="rounded-2xl p-4 text-center" style={{ background:'linear-gradient(135deg,#7c6cff11,#00d4aa11)', border:'1px solid #7c6cff33' }}>
        <div className="text-xs uppercase tracking-widest mb-1" style={{ color:'var(--muted)' }}>Your Global Rank</div>
        <div className="font-display font-extrabold" style={{ fontSize:48, color:'#7c6cff' }}>#{yourRank}</div>
        <div className="text-sm" style={{ color:'var(--muted)' }}>{stats.totalXP.toLocaleString()} XP • IQ {stats.iqScore}</div>
      </div>

      {/* Region tabs */}
      <div className="flex gap-2">
        {REGIONS.map((r,i) => (
          <button key={i} onClick={()=>setRegion(i)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={{ background:region===i?'#7c6cff':'var(--surface)', color:region===i?'white':'var(--muted)',
              border:`1px solid ${region===i?'#7c6cff':'var(--border)'}` }}>
            {r.label}
          </button>
        ))}
      </div>

      {/* Leaderboard */}
      <div className="space-y-2">
        {combined.map((e, i) => (
          <motion.div key={e.name} initial={{ opacity:0,x:-12 }} animate={{ opacity:1,x:0 }} transition={{ delay:i*0.04 }}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{ background:e.isYou?'#7c6cff11':'var(--card)', border:`1px solid ${e.isYou?'#7c6cff55':'var(--border)'}` }}>
            <div className="font-display font-extrabold text-xl w-8 text-center"
              style={{ color:rankColors[e.rank]||'var(--muted)' }}>
              {rankEmoji[e.rank]||e.rank}
            </div>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background:e.isYou?'#7c6cff33':'#ffffff0f', color:e.isYou?'#7c6cff':'var(--muted)' }}>
              {e.country||e.name[0]}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm" style={{ color:e.isYou?'#7c6cff':'white' }}>{e.name}</div>
              <div className="text-xs" style={{ color:'var(--muted)' }}>IQ {e.iq}</div>
            </div>
            <div className="text-right">
              <div className="font-display font-bold text-sm" style={{ color:'#7c6cff' }}>{e.xp.toLocaleString()}</div>
              <div className="text-xs" style={{ color:'var(--muted)' }}>XP</div>
            </div>

            {/* XP bar relative to top */}
            <div className="hidden md:block w-20 h-1.5 rounded-full overflow-hidden" style={{ background:'var(--dim)' }}>
              <div className="h-full rounded-full" style={{ width:`${Math.min((e.xp/combined[0].xp)*100,100)}%`,
                background:e.isYou?'#7c6cff':'#ffffff22' }} />
            </div>
          </motion.div>
        ))}
      </div>

      <p className="text-center text-xs py-2" style={{ color:'var(--muted)' }}>
        Play more games to climb! Rankings update in real-time 🚀
      </p>
    </div>
  )
}
