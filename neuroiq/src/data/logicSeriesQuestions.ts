import type { QuestionBank } from '../utils/questionEngine'

export interface LogicSeriesQ {
  id: string
  sequence: string
  options: string[]
  answer: string
  explanation: string
}

const EASY: LogicSeriesQ[] = [
  { id:'le1', sequence:'2, 4, 6, 8, ?',        options:['9','10','11','12'],   answer:'10', explanation:'+2 each time' },
  { id:'le2', sequence:'5, 10, 15, 20, ?',     options:['22','24','25','30'],  answer:'25', explanation:'+5 each time' },
  { id:'le3', sequence:'1, 3, 5, 7, ?',        options:['8','9','10','11'],    answer:'9',  explanation:'Odd numbers' },
  { id:'le4', sequence:'10, 20, 30, 40, ?',    options:['45','48','50','55'],  answer:'50', explanation:'+10 each time' },
  { id:'le5', sequence:'A, B, C, D, ?',        options:['E','F','G','H'],      answer:'E',  explanation:'Alphabet order' },
  { id:'le6', sequence:'100, 90, 80, 70, ?',   options:['50','60','65','75'],  answer:'60', explanation:'-10 each time' },
  { id:'le7', sequence:'3, 6, 9, 12, ?',       options:['13','14','15','16'],  answer:'15', explanation:'Multiples of 3' },
  { id:'le8', sequence:'2, 2, 2, 2, ?',        options:['2','3','4','0'],      answer:'2',  explanation:'Constant sequence' },
]

const MEDIUM: LogicSeriesQ[] = [
  { id:'lm1', sequence:'2, 4, 8, 16, ?',       options:['24','32','30','28'],       answer:'32',   explanation:'×2 each time' },
  { id:'lm2', sequence:'100, 50, 25, ?',       options:['10','12.5','15','20'],     answer:'12.5', explanation:'÷2 each time' },
  { id:'lm3', sequence:'A, C, E, G, ?',        options:['H','I','J','K'],           answer:'I',    explanation:'Every other letter' },
  { id:'lm4', sequence:'1, 4, 9, 16, ?',       options:['20','25','36','30'],       answer:'25',   explanation:'Perfect squares' },
  { id:'lm5', sequence:'Z, X, V, T, ?',        options:['S','R','Q','P'],           answer:'R',    explanation:'Every other letter backward' },
  { id:'lm6', sequence:'5, 10, 20, 40, ?',     options:['60','70','80','90'],       answer:'80',   explanation:'×2 each time' },
  { id:'lm7', sequence:'1, 2, 4, 8, ?',        options:['12','14','16','18'],       answer:'16',   explanation:'Powers of 2' },
  { id:'lm8', sequence:'81, 27, 9, 3, ?',      options:['0','1','1.5','2'],         answer:'1',    explanation:'÷3 each time' },
  { id:'lm9', sequence:'B, D, F, H, ?',        options:['I','J','K','L'],           answer:'J',    explanation:'Every other letter' },
  { id:'lm10',sequence:'4, 9, 16, 25, ?',      options:['30','36','35','32'],       answer:'36',   explanation:'Squares of 2,3,4,5,6' },
  { id:'lm11',sequence:'1, 3, 9, 27, ?',       options:['54','72','81','90'],       answer:'81',   explanation:'×3 each time' },
  { id:'lm12',sequence:'2, 5, 8, 11, ?',       options:['13','14','15','16'],       answer:'14',   explanation:'+3 each time' },
]

const HARD: LogicSeriesQ[] = [
  { id:'lh1', sequence:'1, 1, 2, 3, 5, 8, ?',  options:['11','12','13','14'],       answer:'13',  explanation:'Fibonacci: add previous two' },
  { id:'lh2', sequence:'2, 3, 5, 7, 11, ?',    options:['12','13','14','15'],       answer:'13',  explanation:'Prime numbers' },
  { id:'lh3', sequence:'1, 8, 27, 64, ?',      options:['100','121','125','130'],   answer:'125', explanation:'Cubes: 5³=125' },
  { id:'lh4', sequence:'10, 9, 7, 4, ?',       options:['-1','0','1','2'],          answer:'0',   explanation:'Subtract 1,2,3,4' },
  { id:'lh5', sequence:'2, 6, 12, 20, ?',      options:['28','30','32','36'],       answer:'30',  explanation:'+4,+6,+8,+10' },
  { id:'lh6', sequence:'1, 2, 6, 24, ?',       options:['48','100','120','144'],    answer:'120', explanation:'×1,×2,×3,×4,×5 (factorials)' },
  { id:'lh7', sequence:'3, 7, 13, 21, ?',      options:['29','31','33','35'],       answer:'31',  explanation:'+4,+6,+8,+10' },
  { id:'lh8', sequence:'B, D, G, K, ?',        options:['O','P','Q','R'],           answer:'P',   explanation:'+2,+3,+4,+5 letters' },
  { id:'lh9', sequence:'2, 4, 12, 48, ?',      options:['96','144','192','240'],    answer:'240', explanation:'×2,×3,×4,×5' },
  { id:'lh10',sequence:'1, 4, 13, 40, ?',      options:['81','100','121','141'],    answer:'121', explanation:'×3+1 each time' },
  { id:'lh11',sequence:'100, 81, 64, 49, ?',   options:['25','36','40','45'],       answer:'36',  explanation:'Squares of 10,9,8,7,6' },
  { id:'lh12',sequence:'5, 11, 23, 47, ?',     options:['85','93','95','99'],       answer:'95',  explanation:'×2+1 each time' },
]

const EXPERT: LogicSeriesQ[] = [
  { id:'lx1', sequence:'1, 3, 7, 13, 21, ?',     options:['29','31','33','35'],          answer:'31',     explanation:'Differences: 2,4,6,8,10' },
  { id:'lx2', sequence:'2, 5, 11, 23, ?',        options:['41','45','47','49'],          answer:'47',     explanation:'×2+1 each time' },
  { id:'lx3', sequence:'0, 1, 3, 6, 10, ?',      options:['13','14','15','16'],          answer:'15',     explanation:'Triangular numbers: n(n+1)/2' },
  { id:'lx4', sequence:'256, 64, 16, 4, ?',      options:['1','2','0.5','3'],            answer:'1',      explanation:'÷4 each time' },
  { id:'lx5', sequence:'1, 11, 21, 1211, ?',     options:['111221','112111','3112','121'],answer:'111221', explanation:'"Look-and-say" sequence' },
  { id:'lx6', sequence:'A, B, D, G, K, ?',       options:['O','P','Q','R'],              answer:'P',      explanation:'+1,+2,+3,+4,+5 letters' },
  { id:'lx7', sequence:'6, 14, 30, 62, ?',       options:['124','126','128','130'],      answer:'126',    explanation:'×2+2 each time' },
  { id:'lx8', sequence:'1, 2, 5, 14, ?',         options:['37','41','43','45'],          answer:'41',     explanation:'×3-1 each time' },
  { id:'lx9', sequence:'3, 8, 18, 38, ?',        options:['74','76','78','80'],          answer:'78',     explanation:'×2+2 each time' },
  { id:'lx10',sequence:'2, 12, 36, 80, ?',       options:['140','150','160','170'],      answer:'150',    explanation:'n²(n+1) pattern: 2·1², 3·2², 4·3²...' },
  { id:'lx11',sequence:'1, 4, 10, 22, 46, ?',    options:['90','92','94','96'],          answer:'94',     explanation:'×2+2 each time' },
  { id:'lx12',sequence:'7, 26, 63, 124, ?',      options:['205','215','220','225'],      answer:'215',    explanation:'n³-1 pattern: 2³-1, 3³-1, 4³-1...' },
]

export const LOGIC_SERIES_BANK: QuestionBank<LogicSeriesQ> = {
  easy: EASY, medium: MEDIUM, hard: HARD, expert: EXPERT,
}
