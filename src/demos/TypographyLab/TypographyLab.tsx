import { useState, useMemo } from 'react'
import { prepareWithSegments, layoutWithLines } from '@chenglou/pretext'
import { DemoLayout } from '../../components/DemoLayout'
import { useContainerWidth } from '../../hooks/useContainerWidth'
import { useFontsReady } from '../../hooks/useFontsReady'
import './TypographyLab.css'

const FONT_OPTIONS = [
  { label: 'Inter', value: 'Inter, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Merriweather', value: 'Merriweather, serif' },
  { label: 'System UI', value: 'system-ui, sans-serif' },
  { label: 'Monospace', value: 'SF Mono, Fira Code, monospace' },
]

const DEFAULT_TEXT =
  'Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed. The arrangement of type involves selecting typefaces, point sizes, line lengths, line-spacing, and letter-spacing, as well as adjusting the space between pairs of letters. Typography is performed by typesetters, compositors, typographers, graphic designers, art directors, manga artists, comic book artists, and graffiti artists. Until the Digital Age, typography was a specialized occupation.'

export function TypographyLab() {
  const fontsReady = useFontsReady()
  const { ref: containerRef, width: containerWidth } = useContainerWidth<HTMLDivElement>()
  const [text, setText] = useState(DEFAULT_TEXT)
  const [fontFamily, setFontFamily] = useState(FONT_OPTIONS[0].value)
  const [fontSize, setFontSize] = useState(16)
  const [lineHeight, setLineHeight] = useState(24)

  const font = `${fontSize}px ${fontFamily}`
  const maxWidth = containerWidth > 0 ? containerWidth - 32 : 400

  const result = useMemo(() => {
    if (!fontsReady || !text.trim() || maxWidth <= 0) return null

    const start = performance.now()
    const prepared = prepareWithSegments(text, font)
    const prepareTime = performance.now() - start

    const layoutStart = performance.now()
    const layoutResult = layoutWithLines(prepared, maxWidth, lineHeight)
    const layoutTime = performance.now() - layoutStart

    return {
      ...layoutResult,
      prepareTime,
      layoutTime,
      totalTime: prepareTime + layoutTime,
    }
  }, [fontsReady, text, font, maxWidth, lineHeight])

  return (
    <DemoLayout
      title="Responsive Typography Lab"
      description="Interactive playground showing real-time line-by-line metrics. Drag the container to resize and watch pretext recalculate instantly."
      apiUsed="prepareWithSegments() + layoutWithLines()"
    >
      <div className="typo-lab">
        <textarea
          className="typo-lab__textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste text here..."
        />

        <div className="typo-lab__controls">
          <div className="typo-lab__control">
            <label>Font Family</label>
            <select
              className="typo-lab__select"
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
            >
              {FONT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="typo-lab__control">
            <label>Font Size</label>
            <input
              className="typo-lab__number-input"
              type="number"
              min={8}
              max={72}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
            />
          </div>

          <div className="typo-lab__control">
            <label>Line Height</label>
            <input
              className="typo-lab__number-input"
              type="number"
              min={fontSize}
              max={fontSize * 3}
              value={lineHeight}
              onChange={(e) => setLineHeight(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="typo-lab__layout-area">
          <div className="typo-lab__text-preview">
            <div ref={containerRef} className="typo-lab__resize-container">
              <div style={{ font, lineHeight: `${lineHeight}px` }}>
                {text}
              </div>
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: 8 }}>
              Drag the bottom-right corner to resize the container
            </p>
          </div>

          <div className="typo-lab__metrics">
            <div className="typo-lab__metric-card">
              <h4>Layout Metrics</h4>
              <div className="typo-lab__metric-row">
                <span className="typo-lab__metric-label">Lines</span>
                <span className="typo-lab__metric-value">{result?.lineCount ?? '-'}</span>
              </div>
              <div className="typo-lab__metric-row">
                <span className="typo-lab__metric-label">Height</span>
                <span className="typo-lab__metric-value">{result ? `${result.height}px` : '-'}</span>
              </div>
              <div className="typo-lab__metric-row">
                <span className="typo-lab__metric-label">Width</span>
                <span className="typo-lab__metric-value">{maxWidth > 0 ? `${Math.round(maxWidth)}px` : '-'}</span>
              </div>
            </div>

            <div className="typo-lab__metric-card">
              <h4>Performance</h4>
              <div className="typo-lab__metric-row">
                <span className="typo-lab__metric-label">prepare()</span>
                <span className="typo-lab__metric-value">{result?.prepareTime.toFixed(3) ?? '-'}ms</span>
              </div>
              <div className="typo-lab__metric-row">
                <span className="typo-lab__metric-label">layoutWithLines()</span>
                <span className="typo-lab__metric-value">{result?.layoutTime.toFixed(3) ?? '-'}ms</span>
              </div>
              <div className="typo-lab__metric-row">
                <span className="typo-lab__metric-label">Total</span>
                <span className="typo-lab__metric-value" style={{ color: 'var(--color-success)' }}>
                  {result?.totalTime.toFixed(3) ?? '-'}ms
                </span>
              </div>
            </div>

            <div className="typo-lab__metric-card">
              <h4>Per-Line Widths</h4>
              <div className="typo-lab__line-bars">
                {result?.lines.map((line, i) => (
                  <div key={i} className="typo-lab__line-bar">
                    <span className="typo-lab__line-number">{i + 1}</span>
                    <div
                      className="typo-lab__line-fill"
                      style={{
                        width: `${maxWidth > 0 ? (line.width / maxWidth) * 100 : 0}%`,
                      }}
                    />
                    <span className="typo-lab__line-width">{Math.round(line.width)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DemoLayout>
  )
}
