interface PerformancePanelProps {
  pretextTime: number | null
  domTime: number | null
  label?: string
}

export function PerformancePanel({ pretextTime, domTime, label = 'Layout time' }: PerformancePanelProps) {
  const speedup = pretextTime && domTime ? (domTime / pretextTime) : null

  return (
    <div style={{
      display: 'flex',
      gap: 16,
      padding: 16,
      background: 'var(--color-surface)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--color-border)',
      marginBottom: 16,
      alignItems: 'center',
      flexWrap: 'wrap',
    }}>
      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
        {label}
      </span>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Chip color="var(--color-accent)" label="Pretext" value={pretextTime} />
        <Chip color="var(--color-warning)" label="DOM" value={domTime} />
        {speedup !== null && speedup > 0 && (
          <span style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            color: speedup > 1 ? 'var(--color-success)' : 'var(--color-danger)',
            marginLeft: 4,
          }}>
            {speedup > 1 ? `${speedup.toFixed(1)}x faster` : `${(1 / speedup).toFixed(1)}x slower`}
          </span>
        )}
      </div>
    </div>
  )
}

function Chip({ color, label, value }: { color: string; label: string; value: number | null }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 10px',
      borderRadius: 'var(--radius-sm)',
      background: `color-mix(in srgb, ${color} 15%, transparent)`,
      fontSize: '0.8rem',
    }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
      <span style={{ color: 'var(--color-text-muted)' }}>{label}:</span>
      <span style={{ fontWeight: 600, fontFamily: 'monospace', color }}>
        {value !== null ? `${value.toFixed(2)}ms` : '...'}
      </span>
    </span>
  )
}
