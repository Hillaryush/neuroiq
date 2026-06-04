import type { ReactNode } from 'react'

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'white' }}>
      <div
        className="mx-auto w-full"
        style={{
          maxWidth: 920,
          padding: 'clamp(12px, 3vw, 24px)',
          paddingBottom: 'max(64px, env(safe-area-inset-bottom, 64px))',
        }}
      >
        {children}
      </div>
    </div>
  )
}
