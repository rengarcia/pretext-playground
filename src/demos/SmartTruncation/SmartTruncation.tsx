import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { prepare, layout, prepareWithSegments, layoutWithLines } from '@chenglou/pretext'
import { articles } from '../../data/articles'
import { DemoLayout } from '../../components/DemoLayout'
import { useContainerWidth } from '../../hooks/useContainerWidth'
import { useFontsReady } from '../../hooks/useFontsReady'
import './SmartTruncation.css'

const BODY_FONT = '14px Inter, sans-serif'
const LINE_HEIGHT = 20
const MAX_LINES = 3

export function SmartTruncation() {
  const fontsReady = useFontsReady()
  const { ref: containerRef, width: containerWidth } = useContainerWidth<HTMLDivElement>()
  const [expandedPretext, setExpandedPretext] = useState<Set<number>>(new Set())
  const [expandedDom, setExpandedDom] = useState<Set<number>>(new Set())

  // DOM side state: simulates the real render-then-measure-then-fix cycle
  const [domPhase, setDomPhase] = useState<'loading' | 'full' | 'measured'>('loading')
  const [domOverflows, setDomOverflows] = useState<Map<number, boolean>>(new Map())
  const [reloadKey, setReloadKey] = useState(0)
  const domBodyRefs = useRef<(HTMLDivElement | null)[]>([])

  const textWidth = (containerWidth - 24) / 2 - 32

  // Pretext: know overflow status BEFORE rendering (no DOM needed)
  const articleMeta = useMemo(() => {
    if (!fontsReady || textWidth <= 0) return null

    return articles.map((article) => {
      const prepared = prepare(article.body, BODY_FONT)
      const { lineCount } = layout(prepared, textWidth, LINE_HEIGHT)
      const overflows = lineCount > MAX_LINES

      let truncatedText: string | null = null
      if (overflows) {
        const preparedSegments = prepareWithSegments(article.body, BODY_FONT)
        const { lines } = layoutWithLines(preparedSegments, textWidth, LINE_HEIGHT)
        truncatedText = lines.slice(0, MAX_LINES).map((l) => l.text).join('')
        truncatedText = truncatedText.trimEnd() + '...'
      }

      return { lineCount, overflows, truncatedText }
    })
  }, [fontsReady, textWidth])

  // DOM side: simulate the realistic render cycle
  // Phase 1 (full): render all text unconstrained — no maxHeight, no "Read more"
  // Phase 2 (measured): after a delay, measure overflow and apply truncation
  // The transition between phases IS the layout shift
  useEffect(() => {
    setDomPhase('full')
    setDomOverflows(new Map())
    setExpandedDom(new Set())

    // Simulate the time it takes React to render + useEffect to fire + measure
    const timer = setTimeout(() => {
      const overflows = new Map<number, boolean>()
      domBodyRefs.current.forEach((el, i) => {
        if (el) {
          overflows.set(i, el.scrollHeight > MAX_LINES * LINE_HEIGHT)
        }
      })
      setDomOverflows(overflows)
      setDomPhase('measured')
    }, 800)

    return () => clearTimeout(timer)
  }, [reloadKey, textWidth])

  const handleReload = useCallback(() => {
    setReloadKey((k) => k + 1)
  }, [])

  const togglePretext = (id: number) => {
    setExpandedPretext((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleDom = (id: number) => {
    setExpandedDom((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const domIsMeasured = domPhase === 'measured'

  return (
    <DemoLayout
      title="Smart Text Truncation"
      description='Know if text overflows N lines BEFORE rendering. Show "Read more" on first paint with zero layout shift (CLS).'
      apiUsed="prepare() + layout() + layoutWithLines()"
    >
      <div className="truncation-controls">
        <button className="truncation-reload-btn" onClick={handleReload}>
          Replay render cycle
        </button>
        <span className="truncation-hint">
          Watch the DOM side: text renders full, then snaps to truncated — that jump is a layout shift (CLS).
          The pretext side never shifts because it knows the line count before rendering.
        </span>
      </div>

      <div className="truncation-phase-bar">
        <div className="truncation-phase-section">
          <span className="truncation-phase-label" style={{ color: 'var(--color-accent)' }}>Pretext</span>
          <span className="truncation-phase-step truncation-phase-step--done">
            Truncation ready before render
          </span>
        </div>
        <div className="truncation-phase-section">
          <span className="truncation-phase-label" style={{ color: 'var(--color-warning)' }}>DOM</span>
          <span className={`truncation-phase-step ${domPhase === 'full' ? 'truncation-phase-step--active' : 'truncation-phase-step--done'}`}>
            1. Render full text
          </span>
          <span className="truncation-phase-arrow">→</span>
          <span className={`truncation-phase-step ${domPhase === 'full' ? '' : domPhase === 'measured' ? 'truncation-phase-step--done' : ''}`}>
            2. Measure overflow
          </span>
          <span className="truncation-phase-arrow">→</span>
          <span className={`truncation-phase-step ${domIsMeasured ? 'truncation-phase-step--done' : ''}`}>
            3. Apply truncation (CLS!)
          </span>
        </div>
      </div>

      <div ref={containerRef} className="truncation-demo">
        {/* Pretext side — truncation is known from the start */}
        <div className="truncation-demo__column">
          <div className="truncation-demo__label truncation-demo__label--pretext">
            Pretext (zero CLS)
            <span className="cls-indicator cls-indicator--good">CLS: 0</span>
          </div>
          {articles.map((article, i) => {
            const meta = articleMeta?.[i]
            const isExpanded = expandedPretext.has(article.id)
            return (
              <div key={article.id} className="article-card">
                <div className="article-card__header">
                  <div>
                    <div className="article-card__category">{article.category}</div>
                    <div className="article-card__title">{article.title}</div>
                    <div className="article-card__author">by {article.author}</div>
                  </div>
                  {meta && (
                    <div className="article-card__meta article-card__meta--pretext">
                      <span>{meta.lineCount} lines</span>
                      {meta.overflows && <span className="article-card__overflow-badge">overflows</span>}
                    </div>
                  )}
                </div>
                <div
                  className="article-card__body"
                  style={{
                    font: BODY_FONT,
                    lineHeight: `${LINE_HEIGHT}px`,
                    ...(meta?.overflows && !isExpanded
                      ? { maxHeight: MAX_LINES * LINE_HEIGHT, overflow: 'hidden' }
                      : {}),
                  }}
                >
                  {meta?.overflows && !isExpanded ? meta.truncatedText : article.body}
                </div>
                {meta?.overflows && (
                  <button className="article-card__toggle" onClick={() => togglePretext(article.id)}>
                    {isExpanded ? 'Show less' : `Read more (${meta.lineCount - MAX_LINES} more lines)`}
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {/* DOM side — renders full text first, then truncates after measurement */}
        <div className="truncation-demo__column">
          <div className="truncation-demo__label truncation-demo__label--dom">
            DOM (measure after render)
            <span className={`cls-indicator ${domIsMeasured ? 'cls-indicator--bad' : 'cls-indicator--measuring'}`}>
              {domIsMeasured ? 'CLS occurred' : 'Rendering...'}
            </span>
          </div>
          {articles.map((article, i) => {
            const isExpanded = expandedDom.has(article.id)
            const overflows = domOverflows.get(i) ?? false
            // Before measurement: show full text (no truncation)
            // After measurement: apply truncation — this transition is the CLS
            const shouldTruncate = domIsMeasured && overflows && !isExpanded
            return (
              <div
                key={`${article.id}-${reloadKey}`}
                className={`article-card ${!domIsMeasured ? 'article-card--shifting' : ''}`}
              >
                <div className="article-card__header">
                  <div>
                    <div className="article-card__category">{article.category}</div>
                    <div className="article-card__title">{article.title}</div>
                    <div className="article-card__author">by {article.author}</div>
                  </div>
                  {!domIsMeasured && (
                    <div className="article-card__meta article-card__meta--dom">
                      <span>measuring...</span>
                    </div>
                  )}
                </div>
                <div
                  ref={(el) => { domBodyRefs.current[i] = el }}
                  className="article-card__body"
                  style={{
                    font: BODY_FONT,
                    lineHeight: `${LINE_HEIGHT}px`,
                    ...(shouldTruncate
                      ? { maxHeight: MAX_LINES * LINE_HEIGHT, overflow: 'hidden' }
                      : {}),
                  }}
                >
                  {article.body}
                </div>
                {domIsMeasured && overflows && (
                  <button className="article-card__toggle" onClick={() => toggleDom(article.id)}>
                    {isExpanded ? 'Show less' : 'Read more'}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </DemoLayout>
  )
}
