import type { ReactNode } from 'react'

interface DemoLayoutProps {
  title: string
  description: string
  apiUsed: string
  children: ReactNode
}

export function DemoLayout({ title, description, apiUsed, children }: DemoLayoutProps) {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>{title}</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 8 }}>{description}</p>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          API: <code>{apiUsed}</code>
        </p>
      </div>
      {children}
    </div>
  )
}

interface SplitViewProps {
  pretextView: ReactNode
  domView: ReactNode
}

export function SplitView({ pretextView, domView }: SplitViewProps) {
  return (
    <div style={{ display: 'flex', gap: 24, marginTop: 16 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{
          fontSize: '0.8rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'var(--color-accent)',
          marginBottom: 12,
        }}>
          Pretext (no DOM)
        </h3>
        {pretextView}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{
          fontSize: '0.8rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'var(--color-warning)',
          marginBottom: 12,
        }}>
          Traditional (DOM)
        </h3>
        {domView}
      </div>
    </div>
  )
}
