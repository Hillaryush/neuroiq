# NeuroIQ 🧠

> World-class brain training platform — 6 science-backed games to boost IQ, memory, and cognitive performance.

## 🎮 Games

| Game | Skill Trained | IQ Gain |
|------|--------------|---------|
| Memory Matrix | Working Memory | +8 |
| Math Blitz ⚡ | Processing Speed | +12 |
| Simon Says+ | Short-Term Memory | +6 |
| Pattern IQ 🔷 | Fluid Reasoning | +15 |
| Word Chain 💬 | Verbal Ability | +10 |
| Color Memory 🎨 | Visual-Spatial | +7 |

## 🚀 Getting Started

```bash
npm install
npm run dev
```

## 🏗 Tech Stack

- **React 18** + **TypeScript**
- **Vite** — lightning fast builds
- **Tailwind CSS** — utility-first styling
- **Framer Motion** — smooth animations
- **Zustand** — lightweight state with localStorage persistence

## 📁 Project Structure

```
src/
├── assets/          # icons, images, sounds
├── components/
│   ├── games/       # 6 game components
│   ├── ui/          # primitive UI atoms
│   └── shared/      # shared layout pieces
├── context/         # React context providers
├── hooks/           # custom hooks (timer, score)
├── layouts/         # page layout wrappers
├── pages/           # Games, Progress, Leaderboard
├── routes/          # AppRouter
├── services/        # score & storage services
├── store/           # Zustand global store
├── styles/          # additional CSS
├── types/           # TypeScript types
└── utils/           # constants
```

## 📈 Features

- 🔥 Daily streak tracking
- 📊 IQ score that grows as you play
- 🧪 6 cognitive skill metrics
- 🏆 Leaderboard with global rankings
- 📅 Weekly XP bar chart
- 💾 Persistent progress via localStorage
- ✨ Smooth animations throughout
