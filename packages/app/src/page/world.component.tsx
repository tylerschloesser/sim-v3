import { RefObject, useEffect, useRef } from 'react'
import invariant from 'tiny-invariant'
import styles from './world.module.scss'

export function WorldPage() {
  const container = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  useResizeObserver(container, canvas)
  return (
    <div className={styles.container} ref={container}>
      <canvas
        className={styles.canvas}
        ref={canvas}
      ></canvas>
    </div>
  )
}

function useResizeObserver(
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
