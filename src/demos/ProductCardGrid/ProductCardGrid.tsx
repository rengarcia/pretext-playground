import { useState, useMemo, useRef, useEffect } from 'react'
import { prepare, layout } from '@chenglou/pretext'
import { products } from '../../data/products'
import { DemoLayout } from '../../components/DemoLayout'
import { PerformancePanel } from '../../components/PerformancePanel'
import { useContainerWidth } from '../../hooks/useContainerWidth'
import { useFontsReady } from '../../hooks/useFontsReady'
import './ProductCardGrid.css'

const NAME_FONT = '600 14px Inter, sans-serif'
const NAME_LINE_HEIGHT = 20
const DESC_FONT = '13px Inter, sans-serif'
const DESC_LINE_HEIGHT = 18
const MAX_DESC_LINES = 3
const CARD_PADDING = 12
const FOOTER_HEIGHT = 28
const CATEGORY_HEIGHT = 16
const GAP = 16

const categories = ['All', ...new Set(products.map((p) => p.category))]

export function ProductCardGrid() {
  const fontsReady = useFontsReady()
  const { ref: containerRef, width: containerWidth } = useContainerWidth<HTMLDivElement>()
  const [activeCategory, setActiveCategory] = useState('All')
  const [columns, setColumns] = useState(3)
  const [prepareTime, setPrepareTime] = useState<number | null>(null)
  const [layoutTime, setLayoutTime] = useState<number | null>(null)
  const [domInitialTime, setDomInitialTime] = useState<number | null>(null)
  const [domResizeTime, setDomResizeTime] = useState<number | null>(null)

  const filteredProducts = useMemo(
    () => activeCategory === 'All' ? products : products.filter((p) => p.category === activeCategory),
    [activeCategory],
  )

  const columnWidth = containerWidth > 0
    ? (containerWidth - GAP * (columns - 1)) / columns
    : 300
  const textWidth = columnWidth - CARD_PADDING * 2

  // Phase 1: Prepare all product texts (one-time canvas measurement)
  const prepared = useMemo(() => {
    if (!fontsReady) return null
    const start = performance.now()
    const result = filteredProducts.map((product) => ({
      product,
      namePrepared: prepare(product.name, NAME_FONT),
      descPrepared: prepare(product.description, DESC_FONT),
    }))
    setPrepareTime(performance.now() - start)
    return result
  }, [fontsReady, filteredProducts])

  // Phase 2: Layout at current width (pure arithmetic — re-runs on resize/column change)
  const cardPositions = useMemo(() => {
    if (!prepared || textWidth <= 0) return null

    const start = performance.now()

    const cards = prepared.map(({ product, namePrepared, descPrepared }) => {
      const nameResult = layout(namePrepared, textWidth, NAME_LINE_HEIGHT)
      const descResult = layout(descPrepared, textWidth, DESC_LINE_HEIGHT)

      const descHeight = Math.min(descResult.lineCount, MAX_DESC_LINES) * DESC_LINE_HEIGHT
      const totalHeight =
        product.imageHeight +
        CARD_PADDING +
        CATEGORY_HEIGHT +
        nameResult.height +
        4 +
        descHeight +
        8 +
        FOOTER_HEIGHT +
        CARD_PADDING

      return { product, height: totalHeight }
    })

    // Masonry positioning
    const columnHeights = new Array(columns).fill(0)
    const positioned = cards.map(({ product, height }) => {
      const colIdx = columnHeights.indexOf(Math.min(...columnHeights))
      const x = colIdx * (columnWidth + GAP)
      const y = columnHeights[colIdx]
      columnHeights[colIdx] += height + GAP
      return { product, height, x, y }
    })

    setLayoutTime(performance.now() - start)

    return {
      items: positioned,
      totalHeight: Math.max(...columnHeights),
    }
  }, [prepared, textWidth, columnWidth, columns])

  // DOM comparison: measure name + description via hidden divs
  const domMeasureRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!fontsReady || textWidth <= 0) return
    const el = domMeasureRef.current
    if (!el) return

    el.style.position = 'absolute'
    el.style.visibility = 'hidden'
    el.style.top = '-9999px'

    const nameDiv = document.createElement('div')
    nameDiv.style.font = NAME_FONT
    nameDiv.style.lineHeight = `${NAME_LINE_HEIGHT}px`
    el.appendChild(nameDiv)

    const descDiv = document.createElement('div')
    descDiv.style.font = DESC_FONT
    descDiv.style.lineHeight = `${DESC_LINE_HEIGHT}px`
    el.appendChild(descDiv)

    // Initial measurement at current width
    el.style.width = `${textWidth}px`
    const startInitial = performance.now()
    for (const product of filteredProducts) {
      nameDiv.textContent = product.name
      nameDiv.offsetHeight
      descDiv.textContent = product.description
      descDiv.offsetHeight
    }
    setDomInitialTime(performance.now() - startInitial)

    // Re-measurement at slightly different width (simulates resize)
    el.style.width = `${textWidth - 1}px`
    const startResize = performance.now()
    for (const product of filteredProducts) {
      nameDiv.textContent = product.name
      nameDiv.offsetHeight
      descDiv.textContent = product.description
      descDiv.offsetHeight
    }
    setDomResizeTime(performance.now() - startResize)

    el.innerHTML = ''
  }, [fontsReady, filteredProducts, textWidth])

  return (
    <DemoLayout
      title="Product Card Grid"
      description="Masonry layout where card heights are pre-computed with pretext. Changing columns or filtering triggers instant re-layout."
      apiUsed="prepare() + layout()"
    >
      <PerformancePanel
        pretextTime={prepareTime !== null && layoutTime !== null ? prepareTime + layoutTime : null}
        domTime={domInitialTime}
        label={`Initial: measure ${filteredProducts.length} cards`}
      />
      <PerformancePanel
        pretextTime={layoutTime}
        domTime={domResizeTime}
        label={`On resize: re-layout ${filteredProducts.length} cards`}
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
          <code style={{ color: 'var(--color-accent)' }}>prepare()</code> {prepareTime?.toFixed(2)}ms — one-time text analysis + canvas measurement
        </div>
        <div>
          <code style={{ color: 'var(--color-accent)' }}>layout()</code> x{filteredProducts.length} = {layoutTime?.toFixed(2)}ms — pure arithmetic, re-runs on column/filter/resize change
        </div>
        <div style={{ marginTop: 4, color: 'var(--color-text)' }}>
          Try changing columns or category below — pretext re-layouts via <code>layout()</code> only, while DOM must re-measure everything.
        </div>
      </div>

      <div className="product-grid-demo">
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
          <div className="product-grid__filters">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`product-grid__filter-btn${activeCategory === cat ? ' product-grid__filter-btn--active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
              Columns:
            </label>
            {[2, 3, 4].map((n) => (
              <button
                key={n}
                className={`product-grid__filter-btn${columns === n ? ' product-grid__filter-btn--active' : ''}`}
                onClick={() => setColumns(n)}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div
          ref={containerRef}
          className="product-masonry"
          style={{ height: cardPositions?.totalHeight ?? 0 }}
        >
          {cardPositions?.items.map(({ product, height, x, y }) => (
            <div
              key={product.id}
              className="product-card"
              style={{
                width: columnWidth,
                height,
                transform: `translate(${x}px, ${y}px)`,
              }}
            >
              <div
                className="product-card__image"
                style={{ height: product.imageHeight }}
              >
                {product.imageHeight}x{Math.round(columnWidth)}
              </div>
              <div className="product-card__content">
                <div className="product-card__category">{product.category}</div>
                <div className="product-card__name" style={{ font: NAME_FONT, lineHeight: `${NAME_LINE_HEIGHT}px` }}>
                  {product.name}
                </div>
                <div
                  className="product-card__description"
                  style={{
                    font: DESC_FONT,
                    lineHeight: `${DESC_LINE_HEIGHT}px`,
                    maxHeight: MAX_DESC_LINES * DESC_LINE_HEIGHT,
                    overflow: 'hidden',
                  }}
                >
                  {product.description}
                </div>
                <div className="product-card__footer">
                  <span className="product-card__price">${product.price.toFixed(2)}</span>
                  <span className="product-card__rating">{'★'.repeat(Math.round(product.rating))} {product.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div ref={domMeasureRef} />
    </DemoLayout>
  )
}
