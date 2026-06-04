import { motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import { useAnimatedCounter } from '../hooks/useAnimatedCounter'
import RadarChart from '../components/RadarChart'

const SKILL_META = [
  {key:'workingMemory',  label:'Working Memory',  color:'#7c6cff',icon:'🧩'},
  {key:'processingSpeed',label:'Processing Speed',color:'#ffd166',icon:'⚡'},
  {key:'fluidReasoning', label:'Fluid Reasoning', color:'#ff6b6b',icon:'🔷'},
  {key:'verbalAbility',  label:'Verbal Ability',  color:'#00d4aa',icon:'💬'},
  {key:'visualSpatial',  label:'Visual-Spatial',  color:'#f472b6',icon:'👁️'},
  {key:'attentionFocus', label:'Attention Focus', color:'#a78bfa',icon:'🎯'},
  {key:'logicReasoning', label:'Logic & Coding',  color:'#22d3ee',icon:'💻'},
]
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

function SkillBar({label,color,icon,value,delay}:{label:string;color:string;icon:string;value:number;delay:number}) {
  const anim = useAnimatedCounter(value,1200,delay)
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-sm w-5">{icon}</span>
      <div className="w-24 text-xs font-medium truncate" style={{color:'var(--muted)'}}>{label}</div>
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{background:'var(--dim)'}}>
        <motion.div initial={{width:0}} animate={{width:`${value}%`}}
          transition={{duration:1.1,delay:delay/1000,ease:'easeOut'}}
          className="h-full rounded-full" style={{background:`linear-gradient(90deg,${color},${color}88)`}} />
      </div>
      <div className="text-xs font-bold w-7 text-right tabular-nums" style={{color}}>{anim}</div>
    </div>
  )
}

export default function ProgressPage() {
  const {stats} = useAppStore()
  const skills  = stats.skills as Record<string,number>
  const maxW    = Math.max(...stats.weeklyXP,1)
  const todayI  = (new Date().getDay()+6)%7
  const avgSkill= Math.round(Object.values(skills).reduce((a,b)=>a+b,0)/7)

  return (
    <div className="space-y-4">
      {/* Radar + overview */}
      <div className="rounded-2xl p-4" style={{background:'var(--card)',border:'1px solid var(--border)'}}>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs uppercase tracking-widest" style={{color:'var(--muted)'}}>Cognitive Profile</h3>
          <span className="font-display font-bold text-xl" style={{color:'#7c6cff'}}>{avgSkill}/100</span>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <RadarChart skills={skills} />
          <div className="flex-1 space-y-2.5 w-full">
            {SKILL_META.map(({key,label,color,icon},i)=>(
              <SkillBar key={key} label={label} color={color} icon={icon} value={skills[key]||50} delay={i*70}/>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly XP */}
      <div className="rounded-2xl p-4" style={{background:'var(--card)',border:'1px solid var(--border)'}}>
        <h3 className="text-xs uppercase tracking-widest mb-4" style={{color:'var(--muted)'}}>Weekly XP</h3>
        <div className="flex items-end gap-2" style={{height:110}}>
          {stats.weeklyXP.map((xp,i)=>{
            const h=maxW>0?(xp/maxW)*100:0; const iT=i===todayI
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                {xp>0&&<div className="text-xs font-bold" style={{color:iT?'#7c6cff':'var(--muted)',fontSize:10}}>{xp}</div>}
                <div className="w-full rounded-t-lg relative overflow-hidden" style={{height:88,background:'var(--surface)'}}>
                  <motion.div initial={{height:0}} animate={{height:`${Math.max(h,xp>0?5:0)}%`}}
                    transition={{duration:1.1,delay:i*0.07,ease:'easeOut'}}
                    className="absolute bottom-0 left-0 right-0 rounded-t-lg"
                    style={{background:iT?'linear-gradient(180deg,#7c6cff,#5544ee)':'linear-gradient(180deg,#7c6cff55,#5544ee33)'}}/>
                </div>
                <div className="text-xs" style={{color:iT?'white':'var(--muted)',fontWeight:iT?700:400}}>{DAYS[i][0]}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* History */}
      <div className="rounded-2xl p-4" style={{background:'var(--card)',border:'1px solid var(--border)'}}>
        <h3 className="text-xs uppercase tracking-widest mb-4" style={{color:'var(--muted)'}}>Recent Games</h3>
        {stats.history.length===0
          ? <p className="text-sm text-center py-6" style={{color:'var(--muted)'}}>No games yet. Start playing! 🎮</p>
          : <div className="space-y-2">
              {stats.history.slice(0,10).map((r,i)=>(
                <motion.div key={i} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*0.03}}
                  className="flex justify-between items-center py-2 px-3 rounded-xl text-sm"
                  style={{background:'var(--surface)'}}>
                  <span style={{color:'var(--muted)'}}>{r.gameId}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{color:'#7c6cff'}}>{r.score.toLocaleString()}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{background:'#00d4aa18',color:'#00d4aa'}}>+{r.xpEarned} XP</span>
                  </div>
                </motion.div>
              ))}
            </div>}
      </div>
    </div>
  )
}
