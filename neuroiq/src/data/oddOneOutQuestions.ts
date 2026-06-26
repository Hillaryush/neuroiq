import type { QuestionBank } from '../utils/questionEngine'

export interface OddOneOutQ {
  id: string
  items: string[]
  odd: string
  hint: string
}

const EASY: OddOneOutQ[] = [
  { id:'oe1',  items:['Apple','Banana','Mango','Car'],         odd:'Car',        hint:'Not a fruit' },
  { id:'oe2',  items:['Dog','Cat','Eagle','Fish'],             odd:'Eagle',      hint:'Not a typical pet' },
  { id:'oe3',  items:['Red','Blue','Fast','Green'],            odd:'Fast',       hint:'Not a color' },
  { id:'oe4',  items:['Piano','Guitar','Brush','Violin'],      odd:'Brush',      hint:'Not a musical instrument' },
  { id:'oe5',  items:['Sun','Moon','Star','River'],            odd:'River',      hint:'Not in the sky' },
  { id:'oe6',  items:['Circle','Square','Triangle','Happy'],   odd:'Happy',      hint:'Not a shape' },
  { id:'oe7',  items:['Lion','Tiger','Bear','Sparrow'],        odd:'Sparrow',    hint:'Not a large mammal' },
  { id:'oe8',  items:['Monday','Tuesday','January','Friday'],  odd:'January',    hint:'Not a day of the week' },
  { id:'oe9',  items:['Pen','Pencil','Eraser','Banana'],       odd:'Banana',     hint:'Not stationery' },
  { id:'oe10', items:['Rose','Tulip','Lily','Cactus'],         odd:'Cactus',     hint:'Doesn\'t bloom traditionally as a flower' },
]

const MEDIUM: OddOneOutQ[] = [
  { id:'om1',  items:['2','4','7','8'],                        odd:'7',          hint:'Not even' },
  { id:'om2',  items:['1','3','5','8'],                        odd:'8',          hint:'Not an odd number' },
  { id:'om3',  items:['3','6','9','10'],                       odd:'10',         hint:'Not divisible by 3' },
  { id:'om4',  items:['Rose','Lily','Oak','Daisy'],            odd:'Oak',        hint:'Not a flower' },
  { id:'om5',  items:['Mercury','Venus','Moon','Mars'],        odd:'Moon',       hint:'Not a planet' },
  { id:'om6',  items:['Python','Java','HTML','C++'],           odd:'HTML',       hint:'Not a programming language' },
  { id:'om7',  items:['Paris','London','Berlin','Amazon'],     odd:'Amazon',     hint:'Not a capital city' },
  { id:'om8',  items:['Square','Circle','Triangle','Cube'],    odd:'Cube',       hint:'Not a 2D shape' },
  { id:'om9',  items:['Run','Jump','Sleep','Swim'],            odd:'Sleep',      hint:'Not an active exercise' },
  { id:'om10', items:['Whale','Shark','Dolphin','Octopus'],    odd:'Octopus',    hint:'Not a vertebrate' },
  { id:'om11', items:['Hammer','Wrench','Screwdriver','Spoon'],odd:'Spoon',      hint:'Not a tool' },
  { id:'om12', items:['Guitar','Drum','Trumpet','Camera'],     odd:'Camera',     hint:'Not a musical instrument' },
  { id:'om13', items:['Iron','Copper','Wood','Aluminum'],      odd:'Wood',       hint:'Not a metal' },
  { id:'om14', items:['Triangle','Pentagon','Hexagon','Sphere'],odd:'Sphere',    hint:'Not a 2D polygon' },
  { id:'om15', items:['Cow','Goat','Sheep','Crocodile'],       odd:'Crocodile',  hint:'Not a herbivore mammal' },
]

const HARD: OddOneOutQ[] = [
  { id:'oh1',  items:['Oxygen','Nitrogen','Gold','Carbon'],         odd:'Gold',       hint:'Not a gas at room temp' },
  { id:'oh2',  items:['Liver','Heart','Neuron','Kidney'],           odd:'Neuron',     hint:'Not an organ — it\'s a cell' },
  { id:'oh3',  items:['Newton','Einstein','Darwin','Picasso'],      odd:'Picasso',    hint:'Not a scientist' },
  { id:'oh4',  items:['Sonnet','Haiku','Limerick','Essay'],         odd:'Essay',      hint:'Not a poetry form' },
  { id:'oh5',  items:['TCP','HTTP','USB','FTP'],                    odd:'USB',        hint:'Not a network protocol' },
  { id:'oh6',  items:['Iron','Calcium','Hemoglobin','Zinc'],        odd:'Hemoglobin', hint:'Not a mineral/element' },
  { id:'oh7',  items:['Mitosis','Meiosis','Photosynthesis','Osmosis'], odd:'Photosynthesis', hint:'Not a cell process related to division/movement' },
  { id:'oh8',  items:['16','25','36','50'],                         odd:'50',         hint:'Not a perfect square' },
  { id:'oh9',  items:['Plato','Socrates','Newton','Aristotle'],     odd:'Newton',     hint:'Not a Greek philosopher' },
  { id:'oh10', items:['Mozart','Beethoven','Shakespeare','Bach'],   odd:'Shakespeare',hint:'Not a composer' },
  { id:'oh11', items:['Sodium','Chlorine','Salt','Potassium'],      odd:'Salt',       hint:'Not an element — it\'s a compound' },
  { id:'oh12', items:['Jupiter','Saturn','Earth','Sirius'],         odd:'Sirius',     hint:'Not a planet — it\'s a star' },
  { id:'oh13', items:['DNA','RNA','Protein','Hydrogen'],            odd:'Hydrogen',   hint:'Not a biomolecule' },
  { id:'oh14', items:['Rectangle','Rhombus','Parallelogram','Sphere'],odd:'Sphere',   hint:'Not a quadrilateral' },
  { id:'oh15', items:['Algorithm','Variable','Function','Furniture'],odd:'Furniture', hint:'Not a programming term' },
]

const EXPERT: OddOneOutQ[] = [
  { id:'ox1',  items:['2','3','5','9'],                            odd:'9',          hint:'Not a prime number' },
  { id:'ox2',  items:['Quartz','Granite','Basalt','Marble'],       odd:'Marble',     hint:'Not igneous — marble is metamorphic' },
  { id:'ox3',  items:['Sitar','Tabla','Sarod','Flute'],            odd:'Tabla',      hint:'Not a string instrument' },
  { id:'ox4',  items:['RAM','ROM','SSD','CPU'],                    odd:'CPU',        hint:'Not a memory/storage device' },
  { id:'ox5',  items:['Ampere','Volt','Ohm','Newton'],             odd:'Newton',     hint:'Not an electrical unit' },
  { id:'ox6',  items:['Cello','Viola','Harp','Oboe'],              odd:'Oboe',       hint:'Not a string instrument' },
  { id:'ox7',  items:['Krypton','Xenon','Neon','Hydrogen'],        odd:'Hydrogen',   hint:'Not a noble gas' },
  { id:'ox8',  items:['Trapezoid','Rhombus','Hexagon','Cone'],     odd:'Cone',       hint:'Not a 2D polygon' },
  { id:'ox9',  items:['128','64','32','48'],                       odd:'48',         hint:'Not a power of 2' },
  { id:'ox10', items:['Allegro','Forte','Staccato','Palette'],     odd:'Palette',    hint:'Not a musical term' },
  { id:'ox11', items:['Stack','Queue','LinkedList','Compiler'],    odd:'Compiler',   hint:'Not a data structure' },
  { id:'ox12', items:['Mendel','Darwin','Lamarck','Faraday'],      odd:'Faraday',    hint:'Not a biologist/evolution scientist' },
  { id:'ox13', items:['Sin','Cos','Tan','Log'],                    odd:'Log',        hint:'Not a trigonometric function' },
  { id:'ox14', items:['O(1)','O(n)','O(log n)','O(banana)'],       odd:'O(banana)',  hint:'Not valid Big-O notation' },
  { id:'ox15', items:['Photon','Electron','Proton','Molecule'],    odd:'Molecule',   hint:'Not a subatomic particle' },
]

export const ODD_ONE_OUT_BANK: QuestionBank<OddOneOutQ> = {
  easy: EASY, medium: MEDIUM, hard: HARD, expert: EXPERT,
}
