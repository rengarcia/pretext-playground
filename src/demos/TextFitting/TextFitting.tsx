import { useState, useMemo, useRef, useEffect } from 'react'
import { prepare, layout } from '@chenglou/pretext'
import { DemoLayout } from '../../components/DemoLayout'
import { PerformancePanel } from '../../components/PerformancePanel'
import { useFontsReady } from '../../hooks/useFontsReady'
import './TextFitting.css'

const MIN_FONT = 12
const MAX_FONT = 120
const FONT_FAMILY = 'Inter, sans-serif'

export function TextFitting() {
  const fontsReady = useFontsReady()
  const [text, setText] = useState('The Quick Brown Fox')
  const [containerWidth, setContainerWidth] = useState(500)
  const [pretextTime, setPretextTime] = useState<number | null>(null)
  const [domTime, setDomTime] = useState<number | null>(null)
  const [pretextFontSize, setPretextFontSize] = useState(48)
  const [domFontSize, setDomFontSize] = useState(48)
  const [iterations, setIterations] = useState(0)
  const domSpanRef = useRef<HTMLSpanElement>(null)

  // Pretext: binary search over font sizes
  useMemo(() => {
    if (!fontsReady || !text.trim() || containerWidth <= 40) return

    const start = performance.now()
    let lo = MIN_FONT
    let hi = MAX_FONT
    let best = MIN_FONT
    let iters = 0

    while (hi - lo > 0.5) {
      const mid = (lo + hi) / 2
      const font = `700 ${mid}px ${FONT_FAMILY}`
      const prepared = prepare(text, font)
      const { lineCount } = layout(prepared, containerWidth - 40, mid * 1.1)
      iters++

      if (lineCount <= 1) {
        best = mid
        lo = mid
      } else {
        hi = mid
      }
    }

    const elapsed = performance.now() - start
    setPretextFontSize(Math.floor(best))
    setPretextTime(elapsed)
    setIterations(iters)
  }, [fontsReady, text, containerWidth])

  // DOM: binary search using hidden span measurement
  useEffect(() => {
    if (!fontsReady || !text.trim() || containerWidth <= 40) return
    const span = domSpanRef.current
    if (!span) return

    const start = performance.now()
    let lo = MIN_FONT
    let hi = MAX_FONT
    let best = MIN_FONT

    span.style.position = 'absolute'
    span.style.visibility = 'hidden'
    span.style.whiteSpace = 'nowrap'
    span.style.fontWeight = '700'
    span.style.fontFamily = FONT_FAMILY
    span.textContent = text

    while (hi - lo > 0.5) {
      const mid = (lo + hi) / 2
      span.style.fontSize = `${mid}px`
      const w = span.offsetWidth

      if (w <= containerWidth - 40) {
        best = mid
        lo = mid
      } else {
        hi = mid
      }
    }

    const elapsed = performance.now() - start
    setDomFontSize(Math.floor(best))
    setDomTime(elapsed)
  }, [fontsReady, text, containerWidth])

  return (
    <DemoLayout
      title="Dynamic Text Fitting"
      description="Binary search over font sizes to find the largest that fits a container. Pretext does this without creating any DOM elements."
      apiUsed="prepare() + layout() (binary search)"
    >
      <PerformancePanel
        pretextTime={pretextTime}
        domTime={domTime}
        label={`Fit text (${iterations} iterations)`}
      />

      <div className="text-fitting-demo">
        <div className="text-fitting__controls">
          <input
            className="text-fitting__input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a headline..."
          />
          <div className="text-fitting__width-control">
            <label>Width: {containerWidth}px</label>
            <input
              className="text-fitting__slider"
              type="range"
              min={200}
              max={900}
              value={containerWidth}
              onChange={(e) => setContainerWidth(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="text-fitting__preview-area">
          <div className="text-fitting__preview">
            <div className="text-fitting__label text-fitting__label--pretext">
              Pretext
            </div>
            <div
              className="text-fitting__container text-fitting__container--pretext"
              style={{ width: containerWidth }}
            >
              <div
                className="text-fitting__headline"
                style={{
                  fontSize: pretextFontSize,
                  fontWeight: 700,
                  fontFamily: FONT_FAMILY,
                }}
              >
                {text || 'Type something...'}
              </div>
            </div>
            <div className="text-fitting__meta">
              <div className="text-fitting__meta-item">
                Font size: <span style={{ color: 'var(--color-accent)' }}>{pretextFontSize}px</span>
              </div>
              <div className="text-fitting__meta-item">
                Iterations: <span>{iterations}</span>
              </div>
              <div className="text-fitting__meta-item">
                Time: <span>{pretextTime?.toFixed(2)}ms</span>
              </div>
            </div>
          </div>

          <div className="text-fitting__preview">
            <div className="text-fitting__label text-fitting__label--dom">
              DOM
            </div>
            <div
              className="text-fitting__container text-fitting__container--dom"
              style={{ width: containerWidth }}
            >
              <div
                className="text-fitting__headline"
                style={{
                  fontSize: domFontSize,
                  fontWeight: 700,
                  fontFamily: FONT_FAMILY,
                }}
              >
                {text || 'Type something...'}
              </div>
            </div>
            <div className="text-fitting__meta">
              <div className="text-fitting__meta-item">
                Font size: <span style={{ color: 'var(--color-warning)' }}>{domFontSize}px</span>
              </div>
              <div className="text-fitting__meta-item">
                Time: <span>{domTime?.toFixed(2)}ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <span ref={domSpanRef} />
    </DemoLayout>
  )
}
