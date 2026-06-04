import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sound } from '../services/soundService'
import type { GameMeta } from '../types'
import { DIFFICULTY_COLORS } from '../utils/constants'

interface Props {
  game: GameMeta
  highScore: number
  playCount: number
  onStart: (difficulty?: string) => void
  onBack: () => void
}

export default function GameStartScreen({ game, highScore, playCount, onStart, onBack }: Props) {
  const [countdown, setCountdown] = useState<number|null>(null)
  const [selectedDiff, setDiff]   = useState(game.difficulty)

  function begin() {
    sound.gameStart()
    setCountdown(3)
    let n = 3
    const t = setInterval(()=>{
      n--
      if (n > 0) {
        setCountdown(n)
        sound.seqPress(n)
      } else {
        clearInterval(t)
        setCountdown(null)
        onStart(selectedDiff)
      }
    }, 900)
  }

  const diffs = ['Easy','Medium','Hard','Expert']

  return (
    <motion.div initial={{opacity:0,scale:0.93}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.93}}
      className="rounded-3xl relative overflow-hidden"
      style={{background:'var(--card)',border:`1px solid ${game.accent}55`,minHeight:480}}>
      {/* Glow bg */}
      <div className="absolute inset-0 pointer-events-none"
        style={{background:`radial-gradient(circle at 50% 20%,${game.accent}12,transparent 65%)`}} />
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
        style={{background:`linear-gradient(90deg,${game.accent},${game.accent}44)`}} />

      <AnimatePresence>
        {countdown !== null && (
          <motion.div key="cd" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="absolute inset-0 z-20 flex items-center justify-center rounded-3xl"
            style={{background:'rgba(7,7,15,0.92)'}}>
            <motion.div key={countdown}
              initial={{scale:2,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0,opacity:0}}
              className="font-display font-extrabold gradient-text"
              style={{fontSize:120,lineHeight:1}}>
              {countdown === 0 ? 'GO!' : countdown}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 p-6 md:p-8">
        <button onClick={()=>{sound.click();onBack()}}
          className="flex items-center gap-1.5 mb-5 text-sm font-medium"
          style={{background:'none',border:'none',color:'var(--muted)',cursor:'pointer'}}>
          ← Back to Games
        </button>

        {/* Game info */}
        <div className="flex items-start gap-4 mb-6">
          <div className="text-5xl">{game.icon}</div>
          <div>
            <h2 className="font-display font-extrabold text-2xl mb-1">{game.name}</h2>
            <p className="text-sm leading-relaxed" style={{color:'var(--muted)'}}>{game.description}</p>
          </div>
        </div>

        {/* Stats */}
        {playCount > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-5">
            {[
              {l:'Best Score', v:highScore.toLocaleString(), c:'#ffd166'},
              {l:'Times Played',v:playCount, c:'#7c6cff'},
              {l:'IQ Gain',    v:`+${game.iqGain}`, c:'#00d4aa'},
            ].map(s=>(
              <div key={s.l} className="text-center py-2.5 rounded-xl"
                style={{background:'var(--surface)',border:'1px solid var(--border)'}}>
                <div className="font-display font-bold text-lg" style={{color:s.c}}>{s.v}</div>
                <div className="text-xs" style={{color:'var(--muted)'}}>{s.l}</div>
              </div>
            ))}
          </div>
        )}

        {/* Instructions */}
        <div className="mb-5 p-4 rounded-2xl" style={{background:'#7c6cff0a',border:'1px solid #7c6cff22'}}>
          <div className="text-xs uppercase tracking-widest mb-2" style={{color:'#7c6cff'}}>How to Play</div>
          <ul className="text-sm space-y-1" style={{color:'var(--muted)'}}>
            {getInstructions(game.id).map((line,i)=>(
              <li key={i} className="flex gap-2"><span style={{color:game.accent}}>•</span>{line}</li>
            ))}
          </ul>
        </div>

        {/* Difficulty */}
        <div className="mb-5">
          <div className="text-xs uppercase tracking-widest mb-2" style={{color:'var(--muted)'}}>Difficulty</div>
          <div className="flex gap-2 flex-wrap">
            {diffs.map(d=>(
              <button key={d} onClick={()=>{sound.click();setDiff(d as typeof game.difficulty)}}
                className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                style={{background:selectedDiff===d?`${DIFFICULTY_COLORS[d]}33`:'var(--surface)',
                  border:`2px solid ${selectedDiff===d?DIFFICULTY_COLORS[d]:'var(--border)'}`,
                  color:selectedDiff===d?DIFFICULTY_COLORS[d]:'var(--muted)',cursor:'pointer'}}>
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Sound info */}
        <div className="flex items-center gap-2 mb-5 text-xs" style={{color:'var(--muted)'}}>
          🔊 Sound effects enabled — toggle with the button in corner
        </div>

        {/* Start button */}
        <motion.button whileHover={{scale:1.02,boxShadow:`0 0 30px ${game.accent}55`}} whileTap={{scale:0.97}}
          onClick={begin}
          className="w-full py-4 rounded-2xl font-display font-extrabold text-white text-lg"
          style={{background:`linear-gradient(135deg,${game.accent},${game.accent}99)`,border:'none'}}>
          🚀 Start Game
        </motion.button>
      </div>
    </motion.div>
  )
}

function getInstructions(id: string): string[] {
  const map: Record<string,string[]> = {
    memory:          ['Flip cards to reveal emojis','Find all matching pairs','Faster matches = more points'],
    numberrecall:    ['A number flashes for 1-2 seconds','Type it back exactly','Numbers get longer each level'],
    sequence:        ['Watch the color sequence light up','Tap the same sequence back','One wrong = game over'],
    pattern:         ['Study the 3×3 grid carefully','Identify the missing piece','Harder patterns = more IQ points'],
    wordchain:       ['Start word is shown','Enter a word starting with the last letter','Never repeat a word'],
    color:           ['Watch colors flash in order','Tap them back in the same order','Sequence grows each round'],
    strooptest:      ['A color word is displayed','Tap the INK COLOR, not the word','Speed + accuracy = high score'],
    focuschallenge:  ['Green circles = click them','Colored distractors = ignore','Misses reduce your score'],
    math:            ['Mental math under time pressure','Tap the correct answer fast','Combo multiplier for streaks'],
    oddoneout:       ['Four items are shown','One doesn\'t belong','Find it before time runs out'],
    logicseries:     ['A number/letter sequence shown','Figure out the pattern','Complete it correctly'],
    analogies:       ['Bird:Fly :: Fish:?','Complete the analogy','Logic + vocabulary combined'],
    debugchallenge:  ['Read the code snippet','Find the bug highlighted','Select what\'s wrong'],
    algorithmpuzzle: ['Steps are shuffled','Use ▲▼ to reorder them','Correct order = full points'],
  }
  return map[id] || ['Read the instructions','Play carefully','Score as high as you can']
}
