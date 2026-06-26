import type { QuestionBank } from '../utils/questionEngine'

export interface PatternQ {
  id: string
  grid: string[]
  answer: string
  options: string[]
  hint: string
}

const EASY: PatternQ[] = [
  { id:'pe1', grid:['🔴','🔵','🔴','🔵','🔴','🔵','🔴','🔵','❓'], answer:'🔴', options:['🔴','🟢','🟡','🟣'], hint:'Simple alternating pattern' },
  { id:'pe2', grid:['1️⃣','1️⃣','1️⃣','2️⃣','2️⃣','2️⃣','3️⃣','3️⃣','❓'], answer:'3️⃣', options:['3️⃣','4️⃣','2️⃣','1️⃣'], hint:'Groups of three identical' },
  { id:'pe3', grid:['⬆️','⬆️','⬆️','➡️','➡️','➡️','⬇️','⬇️','❓'], answer:'⬇️', options:['⬇️','⬆️','➡️','⬅️'], hint:'Groups of three identical' },
  { id:'pe4', grid:['🟥','🟦','🟥','🟦','🟥','🟦','🟥','🟦','❓'], answer:'🟥', options:['🟥','🟨','🟩','🟪'], hint:'Simple alternating colors' },
]

const MEDIUM: PatternQ[] = [
  { id:'pm1', grid:['🌑','🌒','🌓','🌒','🌓','🌔','🌓','🌔','❓'], answer:'🌕', options:['🌕','🌑','🌒','🌔'], hint:'Moon phases progression' },
  { id:'pm2', grid:['1️⃣','2️⃣','3️⃣','2️⃣','3️⃣','4️⃣','3️⃣','4️⃣','❓'], answer:'5️⃣', options:['5️⃣','4️⃣','6️⃣','2️⃣'], hint:'Each row +1' },
  { id:'pm3', grid:['🟥','🟥','⬜','🟥','⬜','⬜','⬜','⬜','❓'], answer:'⬜', options:['⬜','🟥','🟦','🟨'], hint:'Diagonal decrease pattern' },
  { id:'pm4', grid:['⬆️','➡️','⬇️','➡️','⬇️','⬅️','⬇️','⬅️','❓'], answer:'⬆️', options:['⬆️','⬇️','➡️','⬅️'], hint:'Rotation pattern' },
  { id:'pm5', grid:['🔺','🔺','🔷','🔺','🔷','🔷','🔷','🔷','❓'], answer:'🔷', options:['🔷','🔺','🟦','🟠'], hint:'Filling pattern — increasing one shape' },
]

const HARD: PatternQ[] = [
  { id:'ph1', grid:['🐣','🐥','🐔','🐥','🐔','🦅','🐔','🦅','❓'], answer:'🦅', options:['🦅','🐔','🐣','🐥'], hint:'Growth sequence shifts each row' },
  { id:'ph2', grid:['🌱','🌿','🌳','🌿','🌳','🌲','🌳','🌲','❓'], answer:'🌲', options:['🌲','🌳','🌿','🌱'], hint:'Maturation pattern shifts' },
  { id:'ph3', grid:['A','B','C','B','C','D','C','D','❓'], answer:'E', options:['E','F','B','D'], hint:'Each row shifts one letter forward' },
  { id:'ph4', grid:['2️⃣','4️⃣','8️⃣','3️⃣','6️⃣','9️⃣','4️⃣','8️⃣','❓'], answer:'🔟', options:['🔟','1️⃣2️⃣','9️⃣','6️⃣'], hint:'Row N starts at N, increases by N' },
  { id:'ph5', grid:['🔵','🔵🔵','🔵🔵🔵','🔴','🔴🔴','🔴🔴🔴','🟢','🟢🟢','❓'], answer:'🟢🟢🟢', options:['🟢🟢🟢','🟢','🟢🟢','🔵🔵🔵'], hint:'Each row increases count 1,2,3' },
]

const EXPERT: PatternQ[] = [
  { id:'px1', grid:['1️⃣','3️⃣','6️⃣','2️⃣','4️⃣','7️⃣','3️⃣','5️⃣','❓'], answer:'8️⃣', options:['8️⃣','9️⃣','6️⃣','7️⃣'], hint:'Each column shifts by Triangular-number gaps (+2,+3)' },
  { id:'px2', grid:['🔺','🔷','🔺🔺','🔷','🔺🔺','🔷🔷','🔺🔺','🔷🔷','❓'], answer:'🔺🔺🔺', options:['🔺🔺🔺','🔺🔺','🔷🔷','🔷🔷🔷'], hint:'Fibonacci-like count growth' },
  { id:'px3', grid:['A','C','F','B','D','G','C','E','❓'], answer:'H', options:['H','I','F','G'], hint:'Each row: +2 then +3 letter jumps, shifted by row' },
  { id:'px4', grid:['1️⃣','4️⃣','9️⃣','2️⃣','5️⃣','🔟','3️⃣','6️⃣','❓'], answer:'1️⃣1️⃣', options:['1️⃣1️⃣','9️⃣','🔟','1️⃣2️⃣'], hint:'Each column: square-ish progression shifted by row index' },
  { id:'px5', grid:['🟥🟦','🟦🟥','🟥🟦🟥','🟦🟥','🟥🟦','🟦🟥🟦','🟥🟦','🟦🟥','❓'], answer:'🟥🟦🟥', options:['🟥🟦🟥','🟥🟦','🟦🟥','🟦🟥🟦'], hint:'Alternating expand/contract cycle of 3' },
]

export const PATTERN_BANK: QuestionBank<PatternQ> = {
  easy: EASY, medium: MEDIUM, hard: HARD, expert: EXPERT,
}
