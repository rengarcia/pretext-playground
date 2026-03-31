import { Link } from 'react-router-dom'

const demos = [
  {
    path: '/virtual-email-list',
    title: '1. Virtual Email List',
    description: 'Pre-compute row heights for 500 emails without touching the DOM. Enables smooth virtualized scrolling.',
    api: 'prepare() + layout()',
  },
  {
    path: '/product-card-grid',
    title: '2. Product Card Grid',
    description: 'Masonry/Pinterest-style layout where card heights are calculated via pure arithmetic for instant positioning.',
    api: 'prepare() + layout()',
  },
  {
    path: '/smart-truncation',
    title: '3. Smart Truncation',
    description: 'Know if text overflows N lines before rendering — show "Read more" on first paint with zero CLS.',
    api: 'prepareWithSegments() + layoutWithLines()',
  },
  {
    path: '/text-fitting',
    title: '4. Text Fitting',
    description: 'Binary search over font sizes to find the largest that fits a container width. ~0.3ms total.',
    api: 'prepare() + layout() (binary search)',
  },
  {
    path: '/typography-lab',
    title: '5. Typography Lab',
    description: 'Interactive playground — resize a container and watch real-time line count, height, and per-line metrics.',
    api: 'prepareWithSegments() + layoutWithLines()',
  },
]

export function Home() {
  return (
    <div>
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 12 }}>
          Pretext POC
        </h2>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: 640, lineHeight: 1.7 }}>
          <a href="https://github.com/chenglou/pretext" target="_blank" rel="noopener">
            Pretext
          </a>{' '}
          measures and lays out multiline text without touching the DOM. It uses a two-phase
          architecture: an expensive <code>prepare()</code> step (one-time, ~0.04ms per text) that
          analyzes and measures text via canvas, then a near-free <code>layout()</code> step
          (~0.0002ms) that computes height and line count through pure arithmetic.
        </p>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: 640, lineHeight: 1.7, marginTop: 12 }}>
          Each demo below shows a real-world use case with a <span style={{ color: 'var(--color-accent)' }}>pretext-powered</span> implementation
          alongside a <span style={{ color: 'var(--color-warning)' }}>traditional DOM-based</span> approach, with performance timings.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {demos.map((demo) => (
          <Link
            key={demo.path}
            to={demo.path}
            style={{
              display: 'block',
              padding: 20,
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              transition: 'border-color 0.15s, transform 0.15s',
              textDecoration: 'none',
              color: 'inherit',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-primary)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 8 }}>{demo.title}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: 12, lineHeight: 1.6 }}>
              {demo.description}
            </p>
            <code style={{ fontSize: '0.75rem' }}>{demo.api}</code>
          </Link>
        ))}
      </div>
    </div>
  )
}
