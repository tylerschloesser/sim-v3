import { RefObject, useEffect } from 'react'
import invariant from 'tiny-invariant'

export function useResizeObserver(
  container: RefObject<HTMLDivElement>,
  canvas: RefObject<HTMLCanvasElement>,
) {
  useEffect(() => {
    invariant(container.current, 'container ref not set')
    invariant(canvas.current, 'canvas ref not set')

    const resizeObserver = new ResizeObserver((entries) => {
      invariant(entries.length === 1)
      const entry = entries.at(0)
      invariant(entry)
      invariant(canvas.current)
      const { contentRect: rect } = entry

      canvas.current.width = rect.width
      canvas.current.height = rect.height
    })
    resizeObserver.observe(container.current)
    return () => {
      resizeObserver.disconnect()
    }
  }, [])
}
