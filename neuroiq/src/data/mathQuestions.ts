import type { QuestionBank } from '../utils/questionEngine'

export interface MathQuestion {
  id: string
  expr: string      // displayed expression
  answer: number
  explanation?: string
}

function choicesFor(answer: number, spread: number): number[] {
  const wrongSet = new Set<number>()
  while (wrongSet.size < 3) {
    const w = answer + Math.floor(Math.random() * spread * 2) - spread
    if (w !== answer && w !== 0) wrongSet.add(Math.round(w * 100) / 100)
  }
  return [answer, ...wrongSet].sort(() => Math.random() - 0.5)
}

export { choicesFor }

// ─── EASY — Grade 5-6 mental arithmetic ─────────────────────────────────────
const EASY: MathQuestion[] = [
  { id:'e1',  expr:'12 + 7',        answer:19 },
  { id:'e2',  expr:'8 × 3',         answer:24 },
  { id:'e3',  expr:'45 − 18',       answer:27 },
  { id:'e4',  expr:'100 ÷ 4',       answer:25 },
  { id:'e5',  expr:'9 × 6',         answer:54 },
  { id:'e6',  expr:'63 ÷ 7',        answer:9  },
  { id:'e7',  expr:'14 + 28',       answer:42 },
  { id:'e8',  expr:'7 × 7',         answer:49 },
  { id:'e9',  expr:'90 − 35',       answer:55 },
  { id:'e10', expr:'6 × 9',         answer:54 },
  { id:'e11', expr:'81 ÷ 9',        answer:9  },
  { id:'e12', expr:'23 + 49',       answer:72 },
  { id:'e13', expr:'13 × 4',        answer:52 },
  { id:'e14', expr:'100 − 47',      answer:53 },
  { id:'e15', expr:'5 × 12',        answer:60 },
  { id:'e16', expr:'72 ÷ 8',        answer:9  },
  { id:'e17', expr:'38 + 27',       answer:65 },
  { id:'e18', expr:'11 × 11',       answer:121 },
  { id:'e19', expr:'64 ÷ 8',        answer:8  },
  { id:'e20', expr:'29 + 56',       answer:85 },
  { id:'e21', expr:'15 × 3',        answer:45 },
  { id:'e22', expr:'120 − 65',      answer:55 },
  { id:'e23', expr:'8 × 8',         answer:64 },
  { id:'e24', expr:'96 ÷ 12',       answer:8  },
  { id:'e25', expr:'47 + 38',       answer:85 },
]

// ─── MEDIUM — Grade 9-10: squares, roots, percentages ──────────────────────
const MEDIUM: MathQuestion[] = [
  { id:'m1',  expr:'17 × 8',                answer:136, explanation:'Multiplication of two-digit numbers' },
  { id:'m2',  expr:'144 ÷ 12',              answer:12  },
  { id:'m3',  expr:'√169',                  answer:13  },
  { id:'m4',  expr:'15² − 11²',             answer:104, explanation:'(15-11)(15+11) = 4×26' },
  { id:'m5',  expr:'25% of 840',            answer:210 },
  { id:'m6',  expr:'13 × 13',               answer:169 },
  { id:'m7',  expr:'√225',                  answer:15  },
  { id:'m8',  expr:'12³ ÷ 144',             answer:12  },
  { id:'m9',  expr:'18² ÷ 4',               answer:81  },
  { id:'m10', expr:'40% of 625',            answer:250 },
  { id:'m11', expr:'7³',                    answer:343 },
  { id:'m12', expr:'√576',                  answer:24  },
  { id:'m13', expr:'19 × 21',               answer:399, explanation:'(20-1)(20+1)=400-1' },
  { id:'m14', expr:'15% of 960',            answer:144 },
  { id:'m15', expr:'23 × 17',               answer:391 },
  { id:'m16', expr:'12² + 5²',              answer:169 },
  { id:'m17', expr:'√961',                  answer:31  },
  { id:'m18', expr:'250 ÷ 0.5',             answer:500 },
  { id:'m19', expr:'9³',                    answer:729 },
  { id:'m20', expr:'70% of 450',            answer:315 },
  { id:'m21', expr:'33 × 33',               answer:1089 },
  { id:'m22', expr:'18 × 19',               answer:342 },
  { id:'m23', expr:'√1024',                 answer:32  },
  { id:'m24', expr:'45² ÷ 25',              answer:81  },
  { id:'m25', expr:'120% of 350',           answer:420 },
]

// ─── HARD — Grade 11-12 / CAT-level aptitude ───────────────────────────────
const HARD: MathQuestion[] = [
  { id:'h1',  expr:'HCF(48, 180)',                       answer:12,  explanation:'48=2⁴×3, 180=2²×3²×5 → HCF=2²×3=12' },
  { id:'h2',  expr:'LCM(15, 20)',                        answer:60  },
  { id:'h3',  expr:'7³ mod 5',                           answer:3,   explanation:'343 mod 5 = 3' },
  { id:'h4',  expr:'37.5% of 1248',                      answer:468 },
  { id:'h5',  expr:'8! ÷ 6!',                            answer:56,  explanation:'8×7=56' },
  { id:'h6',  expr:'HCF(1728, 2304)',                    answer:576 },
  { id:'h7',  expr:'15C2',                                answer:105, explanation:'15×14/2' },
  { id:'h8',  expr:'2¹⁰ ÷ 4²',                            answer:64,  explanation:'1024/16=64' },
  { id:'h9',  expr:'Sum of first 20 natural numbers',     answer:210, explanation:'n(n+1)/2 = 20×21/2' },
  { id:'h10', expr:'5! ÷ 3!',                             answer:20  },
  { id:'h11', expr:'LCM(18, 24)',                         answer:72  },
  { id:'h12', expr:'13² − 7²',                            answer:120, explanation:'(13-7)(13+7)=6×20' },
  { id:'h13', expr:'6C3',                                 answer:20  },
  { id:'h14', expr:'62.5% of 800',                        answer:500 },
  { id:'h15', expr:'HCF(72, 120)',                        answer:24  },
  { id:'h16', expr:'4⁵ ÷ 4³',                             answer:16  },
  { id:'h17', expr:'Sum of first 10 odd numbers',         answer:100, explanation:'n²=10²' },
  { id:'h18', expr:'7C2',                                 answer:21  },
  { id:'h19', expr:'LCM(12, 18, 24)',                     answer:72  },
  { id:'h20', expr:'9! ÷ 7!',                             answer:72  },
  { id:'h21', expr:'18² − 12²',                           answer:180, explanation:'(18-12)(18+12)=6×30' },
  { id:'h22', expr:'∛512',                                answer:8   },
  { id:'h23', expr:'HCF(96, 144)',                        answer:48  },
  { id:'h24', expr:'10C3',                                answer:120 },
  { id:'h25', expr:'2³ × 3² × 5',                         answer:360 },
]

// ─── EXPERT — JEE Advanced / GATE level ─────────────────────────────────────
const EXPERT: MathQuestion[] = [
  { id:'x1',  expr:'∛32768',                                       answer:32,  explanation:'32³=32768' },
  { id:'x2',  expr:'If 2^x = 128, find 2^(x−3)',                   answer:16,  explanation:'x=7, 2⁴=16' },
  { id:'x3',  expr:'Remainder when 7¹⁰⁰ is divided by 5',          answer:1,   explanation:'7 mod 5=2, cycle of 2ⁿ mod5 repeats every 4: 2,4,3,1' },
  { id:'x4',  expr:'Sum of primes between 10 and 30',              answer:112, explanation:'11+13+17+19+23+29' },
  { id:'x5',  expr:'8P3 (permutations)',                           answer:336, explanation:'8×7×6' },
  { id:'x6',  expr:'In how many ways can 5 people sit in a row?',  answer:120, explanation:'5!=120' },
  { id:'x7',  expr:'Probability(2 heads in 4 fair coin tosses) ×16', answer:6, explanation:'4C2=6, so P=6/16' },
  { id:'x8',  expr:'Number of diagonals in a hexagon',             answer:9,   explanation:'n(n-3)/2 = 6×3/2' },
  { id:'x9',  expr:'If log₁₀2=0.301, 1000×log₁₀2 (rounded)',       answer:301 },
  { id:'x10', expr:'Sum of cubes: 1³+2³+3³+4³',                    answer:100, explanation:'[n(n+1)/2]² = 10²' },
  { id:'x11', expr:'6! / (2! × 2!)',                                answer:180, explanation:'Permutations of multiset' },
  { id:'x12', expr:'Find x: x² = 196, x > 0',                       answer:14  },
  { id:'x13', expr:'GCD(1071, 462)',                                answer:21  },
  { id:'x14', expr:'Number of ways to choose 3 from 9',             answer:84,  explanation:'9C3=84' },
  { id:'x15', expr:'If a+b=10, ab=21, find a²+b²',                  answer:58,  explanation:'(a+b)²-2ab=100-42' },
  { id:'x16', expr:'2^x · 2^(x+1) = 32, find x',                    answer:2,   explanation:'2^(2x+1)=2⁵, 2x+1=5' },
  { id:'x17', expr:'7! / 5!',                                       answer:42  },
  { id:'x18', expr:'Number of zeros at the end of 25!',             answer:6,   explanation:'⌊25/5⌋+⌊25/25⌋=5+1' },
  { id:'x19', expr:'Sum 1+2+4+8+...+128 (powers of 2 up to 2⁷)',   answer:255, explanation:'2⁸-1' },
  { id:'x20', expr:'∫₀³ 2x dx',                                     answer:9,   explanation:'x²|₀³ = 9' },
]

export const MATH_BANK: QuestionBank<MathQuestion> = {
  easy: EASY, medium: MEDIUM, hard: HARD, expert: EXPERT,
}
