import { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import { prepare, layout } from '@chenglou/pretext'
import { emails } from '../../data/emails'
import { DemoLayout } from '../../components/DemoLayout'
import { PerformancePanel } from '../../components/PerformancePanel'
import { useContainerWidth } from '../../hooks/useContainerWidth'
import { useFontsReady } from '../../hooks/useFontsReady'
import './VirtualEmailList.css'

const BODY_FONT = '14px Inter, sans-serif'
const LINE_HEIGHT = 20
const MAX_BODY_LINES = 3
const ITEM_PADDING = 12 + 12
const HEADER_HEIGHT = 20 + 2 + 18 + 4 + 14 + 4
const VIEWPORT_HEIGHT = 500
const OVERSCAN = 5

export function VirtualEmailList() {
  const fontsReady = useFontsReady()
  const { ref: containerRef, width: containerWidth } = useContainerWidth<HTMLDivElement>()
  const [scrollTop, setScrollTop] = useState(0)
  const [prepareTime, setPrepareTime] = useState<number | null>(null)
  const [layoutTime, setLayoutTime] = useState<number | null>(null)
  const [domTime, setDomTime] = useState<number | null>(null)

  const contentWidth = containerWidth - 32

  // Phase 1: Prepare all email bodies (one-time canvas measurement)
  const prepared = useMemo(() => {
    if (!fontsReady) return null
    const start = performance.now()
    const result = emails.map((email) => prepare(email.body, BODY_FONT))
    setPrepareTime(performance.now() - start)
    return result
  }, [fontsReady])

  // Phase 2: Layout at current width (pure arithmetic — re-runs on every resize)
  const itemHeights = useMemo(() => {
    if (!prepared || contentWidth <= 0) return null
    const start = performance.now()
    const heights = prepared.map((p) => {
      const { lineCount } = layout(p, contentWidth, LINE_HEIGHT)
      const bodyHeight = Math.min(lineCount, MAX_BODY_LINES) * LINE_HEIGHT
      return ITEM_PADDING + HEADER_HEIGHT + bodyHeight
    })
    setLayoutTime(performance.now() - start)
    return heights
  }, [prepared, contentWidth])

  // Compute cumulative positions
  const positions = useMemo(() => {
    if (!itemHeights) return null
    const pos: number[] = []
    let offset = 0
    for (const h of itemHeights) {
      pos.push(offset)
      offset += h
    }
    return { offsets: pos, totalHeight: offset }
  }, [itemHeights])

  // Find visible range
  const visibleRange = useMemo(() => {
    if (!positions || !itemHeights) return { start: 0, end: 20 }
    const { offsets } = positions
    let start = 0
    for (let i = 0; i < offsets.length; i++) {
      if (offsets[i] + itemHeights[i] > scrollTop) {
        start = i
        break
      }
    }
    let end = start
    for (let i = start; i < offsets.length; i++) {
      if (offsets[i] > scrollTop + VIEWPORT_HEIGHT) {
        end = i
        break
      }
      end = i + 1
    }
    return {
      start: Math.max(0, start - OVERSCAN),
      end: Math.min(emails.length, end + OVERSCAN),
    }
  }, [positions, itemHeights, scrollTop])

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  // DOM comparison: re-measures all 500 emails on every width change.
  // Uses a hidden div, swaps textContent + reads offsetHeight for each email.
  const domMeasureRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!fontsReady || contentWidth <= 0) return
    const el = domMeasureRef.current
    if (!el) return

    el.style.position = 'absolute'
    el.style.visibility = 'hidden'
    el.style.top = '-9999px'
    el.style.font = BODY_FONT
    el.style.lineHeight = `${LINE_HEIGHT}px`
    el.style.width = `${contentWidth}px`

    const start = performance.now()
    for (const email of emails) {
      el.textContent = email.body
      el.offsetHeight // force reflow
    }
    setDomTime(performance.now() - start)
    el.textContent = ''
  }, [fontsReady, contentWidth])

  return (
    <DemoLayout
      title="Virtual Email List"
      description="Pre-compute row heights for 500 emails using pretext, enabling smooth virtualized scrolling without DOM measurement passes."
      apiUsed="prepare() + layout()"
    >
      {/* Resize comparison — layout() vs full DOM re-measure */}
      <PerformancePanel
        pretextTime={layoutTime}
        domTime={domTime}
        label={`On resize: re-layout ${emails.length} emails`}
      />

      <div style={{
        padding: '10px 16px',
        marginBottom: 16,
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
        fontSize: '0.75rem',
        color: 'var(--color-text-muted)',
        lineHeight: 1.6,
      }}>
        <div>
          <code style={{ color: 'var(--color-accent)' }}>prepare()</code> {prepareTime?.toFixed(2)}ms — one-time canvas measurement (runs once, cached)
        </div>
        <div>
          <code style={{ color: 'var(--color-accent)' }}>layout()</code> x{emails.length} = {layoutTime?.toFixed(2)}ms — pure arithmetic, re-runs on every resize
        </div>
        <div style={{ marginTop: 4, color: 'var(--color-text)' }}>
          Drag the bottom-right corner of the pretext list to resize it. Watch <code>layout()</code> stay sub-millisecond while DOM must re-measure all {emails.length} emails.
        </div>
        <div style={{ marginTop: 2 }}>
          Container width: <span style={{ fontFamily: 'monospace', color: 'var(--color-accent)' }}>{Math.round(containerWidth)}px</span>
        </div>
      </div>

      <div className="email-demo">
        <div className="email-demo__column">
          <div className="email-demo__label email-demo__label--pretext">
            Pretext Virtualized ({emails.length} items, only ~{visibleRange.end - visibleRange.start} rendered)
          </div>
          <div
            ref={containerRef}
            className="email-list"
            onScroll={handleScroll}
          >
            {positions && itemHeights && (
              <div className="email-list__inner" style={{ height: positions.totalHeight }}>
                {emails.slice(visibleRange.start, visibleRange.end).map((email, i) => {
                  const idx = visibleRange.start + i
                  return (
                    <div
                      key={email.id}
                      className="email-item"
                      style={{
                        top: positions.offsets[idx],
                        height: itemHeights[idx],
                      }}
                    >
                      <div className="email-item__from">{email.from}</div>
                      <div className="email-item__subject">{email.subject}</div>
                      <div
                        className="email-item__body"
                        style={{
                          maxHeight: MAX_BODY_LINES * LINE_HEIGHT,
                          lineHeight: `${LINE_HEIGHT}px`,
                          font: BODY_FONT,
                        }}
                      >
                        {email.body}
                      </div>
                      <div className="email-item__date">{email.date}</div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: 8 }}>
            ↘ Drag the bottom-right corner to resize
          </p>
        </div>

        <div className="email-demo__column">
          <div className="email-demo__label email-demo__label--dom">
            DOM Scroll (all {emails.length} items rendered)
          </div>
          <div className="email-dom-list">
            {emails.slice(0, 100).map((email) => (
              <div key={email.id} className="email-dom-item">
                <div className="email-item__from">{email.from}</div>
                <div className="email-item__subject">{email.subject}</div>
                <div
                  className="email-item__body"
                  style={{
                    maxHeight: MAX_BODY_LINES * LINE_HEIGHT,
                    lineHeight: `${LINE_HEIGHT}px`,
                    font: BODY_FONT,
                    overflow: 'hidden',
                  }}
                >
                  {email.body}
                </div>
                <div className="email-item__date">{email.date}</div>
              </div>
            ))}
            <div style={{ padding: 12, textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
              Showing 100 of {emails.length} (rendering all would be slow)
            </div>
          </div>
        </div>
      </div>

      <div ref={domMeasureRef} />
    </DemoLayout>
  )
}
