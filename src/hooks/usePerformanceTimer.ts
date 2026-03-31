import { useCallback, useRef, useState } from 'react'

export function usePerformanceTimer() {
  const [pretextTime, setPretextTime] = useState<number | null>(null)
  const [domTime, setDomTime] = useState<number | null>(null)
  const pretextRef = useRef<number | null>(null)
  const domRef = useRef<number | null>(null)

  const measurePretext = useCallback(<T>(fn: () => T): T => {
    const start = performance.now()
    const result = fn()
    const elapsed = performance.now() - start
    pretextRef.current = elapsed
    setPretextTime(elapsed)
    return result
  }, [])

  const measureDom = useCallback(<T>(fn: () => T): T => {
    const start = performance.now()
    const result = fn()
    const elapsed = performance.now() - start
    domRef.current = elapsed
    setDomTime(elapsed)
    return result
  }, [])

  return { pretextTime, domTime, measurePretext, measureDom }
}
