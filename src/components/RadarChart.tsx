import { motion } from 'framer-motion'

interface Props {
  skills: Record<string,number>
}

const LABELS = [
  {key:'workingMemory',  label:'Memory',   color:'#7c6cff'},
  {key:'attentionFocus', label:'Focus',    color:'#f472b6'},
  {key:'fluidReasoning', label:'Reasoning',color:'#ff6b6b'},
  {key:'processingSpeed',label:'Speed',    color:'#ffd166'},
  {key:'verbalAbility',  label:'Verbal',   color:'#00d4aa'},
  {key:'logicReasoning', label:'Logic',    color:'#22d3ee'},
]

export default function RadarChart({ skills }: Props) {
  const N = LABELS.length
  const cx = 120, cy = 120, r = 90

  function point(i:number, val:number) {
    const angle = (Math.PI*2/N)*i - Math.PI/2
    const pct = val/100
    return { x: cx + r*pct*Math.cos(angle), y: cy + r*pct*Math.sin(angle) }
  }
  function gridPoint(i:number, pct:number) {
    const angle = (Math.PI*2/N)*i - Math.PI/2
    return { x: cx + r*pct*Math.cos(angle), y: cy + r*pct*Math.sin(angle) }
  }
  function labelPoint(i:number) {
    const angle = (Math.PI*2/N)*i - Math.PI/2
    return { x: cx + (r+22)*Math.cos(angle), y: cy + (r+22)*Math.sin(angle) }
  }

  const dataPoints = LABELS.map((l,i) => point(i, skills[l.key]||50))
  const polyPath = dataPoints.map((p,i)=>`${i===0?'M':'L'}${p.x},${p.y}`).join(' ')+'Z'

  return (
    <div className="flex flex-col items-center">
      <svg width={240} height={240} viewBox="0 0 240 240">
        {/* Grid rings */}
        {[0.25,0.5,0.75,1].map(pct=>{
          const pts = LABELS.map((_,i)=>gridPoint(i,pct))
          const path = pts.map((p,i)=>`${i===0?'M':'L'}${p.x},${p.y}`).join(' ')+'Z'
          return <path key={pct} d={path} fill="none" stroke="#2a2a4a" strokeWidth={1}/>
        })}
        {/* Spokes */}
        {LABELS.map((_,i)=>{
          const end = gridPoint(i,1)
          return <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="#2a2a4a" strokeWidth={1}/>
        })}
        {/* Data area */}
        <motion.path d={polyPath} fill="#7c6cff22" stroke="#7c6cff" strokeWidth={2}
          initial={{opacity:0,scale:0.5}} animate={{opacity:1,scale:1}}
          style={{transformOrigin:`${cx}px ${cy}px`}} transition={{duration:0.8,ease:'easeOut'}}/>
        {/* Data points */}
        {dataPoints.map((p,i)=>(
          <motion.circle key={i} cx={p.x} cy={p.y} r={4}
            fill={LABELS[i].color} stroke="var(--bg)" strokeWidth={2}
            initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.1}}/>
        ))}
        {/* Labels */}
        {LABELS.map((l,i)=>{
          const lp = labelPoint(i)
          return (
            <text key={i} x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="middle"
              fontSize={9} fill={l.color} fontFamily="Space Grotesk" fontWeight={600}>
              {l.label}
            </text>
          )
        })}
        {/* Center label */}
        <text x={cx} y={cy-4} textAnchor="middle" fontSize={11} fill="#7c6cff" fontFamily="Syne" fontWeight={800}>
          BRAIN
        </text>
        <text x={cx} y={cy+9} textAnchor="middle" fontSize={9} fill="var(--muted)" fontFamily="Space Grotesk">
          PROFILE
        </text>
      </svg>
    </div>
  )
}
