import type { QuestionBank } from '../utils/questionEngine'

export interface AnalogyQ {
  id: string
  q: string
  options: string[]
  answer: string
  explanation: string
}

const EASY: AnalogyQ[] = [
  { id:'ae1', q:'Bird : Fly :: Fish : ?',          options:['Swim','Walk','Crawl','Run'],         answer:'Swim',  explanation:'Bird flies, fish swims' },
  { id:'ae2', q:'Hot : Cold :: Day : ?',           options:['Warm','Night','Sun','Light'],        answer:'Night', explanation:'Opposite pairs' },
  { id:'ae3', q:'Cat : Kitten :: Dog : ?',         options:['Puppy','Cub','Foal','Calf'],         answer:'Puppy', explanation:'Adult to offspring' },
  { id:'ae4', q:'Eye : See :: Ear : ?',            options:['Hear','Smell','Touch','Taste'],      answer:'Hear',  explanation:'Sense organs' },
  { id:'ae5', q:'Fast : Slow :: Big : ?',          options:['Huge','Tiny','Small','Little'],      answer:'Small', explanation:'Antonym pairs' },
  { id:'ae6', q:'Sun : Day :: Moon : ?',           options:['Night','Star','Light','Sky'],        answer:'Night', explanation:'Associated time' },
  { id:'ae7', q:'Up : Down :: Left : ?',           options:['Right','Side','Top','Bottom'],       answer:'Right', explanation:'Direction opposites' },
  { id:'ae8', q:'Happy : Sad :: Big : ?',          options:['Small','Tall','Wide','Heavy'],       answer:'Small', explanation:'Opposite adjectives' },
]

const MEDIUM: AnalogyQ[] = [
  { id:'am1', q:'Doctor : Hospital :: Teacher : ?',     options:['Library','School','Office','Lab'],   answer:'School',  explanation:'Where they work' },
  { id:'am2', q:'Book : Read :: Music : ?',             options:['Write','Listen','Play','Watch'],     answer:'Listen',  explanation:'How you consume it' },
  { id:'am3', q:'Pen : Write :: Knife : ?',             options:['Cook','Cut','Stab','Draw'],          answer:'Cut',     explanation:'Function/purpose' },
  { id:'am4', q:'Keyboard : Type :: Camera : ?',        options:['Record','Film','Shoot','Click'],     answer:'Shoot',   explanation:'Primary function' },
  { id:'am5', q:'Forest : Trees :: Ocean : ?',          options:['Water','Fish','Waves','Sand'],       answer:'Water',   explanation:'Composed of' },
  { id:'am6', q:'Pilot : Plane :: Captain : ?',         options:['Ship','Train','Car','Bus'],          answer:'Ship',    explanation:'Who commands what' },
  { id:'am7', q:'Hunger : Eat :: Thirst : ?',           options:['Sleep','Drink','Rest','Swim'],       answer:'Drink',   explanation:'Problem to solution' },
  { id:'am8', q:'Author : Book :: Composer : ?',        options:['Song','Concert','Instrument','Band'],answer:'Song',    explanation:'Creator to creation' },
  { id:'am9', q:'Thermometer : Temperature :: Clock : ?',options:['Time','Day','Calendar','Watch'],    answer:'Time',    explanation:'Instrument measures' },
  { id:'am10',q:'Lawyer : Court :: Athlete : ?',        options:['Stadium','Gym','Track','Field'],     answer:'Stadium', explanation:'Where they perform' },
]

const HARD: AnalogyQ[] = [
  { id:'ah1', q:'Tributary : River :: Branch : ?',         options:['Tree','Leaf','Root','Forest'],      answer:'Tree',     explanation:'Part feeds the whole' },
  { id:'ah2', q:'Cacophony : Harmony :: Chaos : ?',         options:['Order','Noise','Disorder','Mess'],  answer:'Order',    explanation:'Antonym relationship' },
  { id:'ah3', q:'Myopia : Nearsighted :: Hyperopia : ?',    options:['Farsighted','Blind','Colorblind','Astigmatism'], answer:'Farsighted', explanation:'Medical term definition' },
  { id:'ah4', q:'Carnivore : Meat :: Herbivore : ?',        options:['Plants','Insects','Fish','Grain'],  answer:'Plants',   explanation:'Diet classification' },
  { id:'ah5', q:'Sculptor : Chisel :: Painter : ?',         options:['Brush','Canvas','Easel','Palette'], answer:'Brush',    explanation:'Primary tool used' },
  { id:'ah6', q:'Despot : Tyranny :: Philanthropist : ?',  options:['Generosity','Wealth','Power','Fame'],answer:'Generosity', explanation:'Trait association' },
  { id:'ah7', q:'Larva : Butterfly :: Tadpole : ?',         options:['Frog','Fish','Lizard','Newt'],      answer:'Frog',     explanation:'Metamorphosis stage' },
  { id:'ah8', q:'Frugal : Spendthrift :: Taciturn : ?',     options:['Garrulous','Quiet','Reserved','Shy'],answer:'Garrulous',explanation:'Antonym — talkative' },
  { id:'ah9', q:'Ornithologist : Birds :: Entomologist : ?',options:['Insects','Mammals','Fish','Plants'],answer:'Insects', explanation:'Field of study' },
  { id:'ah10',q:'Famine : Food :: Drought : ?',             options:['Water','Heat','Crops','Rain'],      answer:'Water',    explanation:'Shortage relationship' },
]

const EXPERT: AnalogyQ[] = [
  { id:'ax1', q:'Sycophant : Flattery :: Iconoclast : ?',     options:['Tradition-breaking','Worship','Art','Religion'], answer:'Tradition-breaking', explanation:'Defining behavior trait' },
  { id:'ax2', q:'Ephemeral : Permanent :: Verbose : ?',       options:['Succinct','Loud','Talkative','Long'],            answer:'Succinct',  explanation:'Antonym — concise' },
  { id:'ax3', q:'Catalyst : Reaction :: Stimulus : ?',        options:['Response','Nerve','Brain','Pain'],               answer:'Response',  explanation:'Trigger to effect' },
  { id:'ax4', q:'Plagiarism : Originality :: Counterfeit : ?',options:['Authenticity','Money','Crime','Forgery'],        answer:'Authenticity', explanation:'Antonym — genuine' },
  { id:'ax5', q:'Acquit : Guilty :: Vindicate : ?',           options:['Blame','Innocent','Convict','Punish'],           answer:'Blame',     explanation:'Clearing of (opposite of)' },
  { id:'ax6', q:'Misanthrope : Humanity :: Xenophobe : ?',    options:['Foreigners','Animals','Strangers','Nature'],     answer:'Foreigners',explanation:'Object of dislike/fear' },
  { id:'ax7', q:'Quixotic : Practical :: Pragmatic : ?',      options:['Idealistic','Realistic','Logical','Cautious'],   answer:'Idealistic',explanation:'Antonym — impractical dreamer' },
  { id:'ax8', q:'Photosynthesis : Glucose :: Respiration : ?',options:['ATP','Oxygen','Carbon','Water'],                 answer:'ATP',       explanation:'Process produces energy/molecule' },
  { id:'ax9', q:'Enervate : Strengthen :: Mitigate : ?',      options:['Aggravate','Reduce','Heal','Cure'],              answer:'Aggravate', explanation:'Antonym — worsen' },
  { id:'ax10',q:'Recidivism : Crime :: Relapse : ?',          options:['Disease','Health','Therapy','Cure'],            answer:'Disease',   explanation:'Returning to a previous negative state' },
]

export const ANALOGIES_BANK: QuestionBank<AnalogyQ> = {
  easy: EASY, medium: MEDIUM, hard: HARD, expert: EXPERT,
}
