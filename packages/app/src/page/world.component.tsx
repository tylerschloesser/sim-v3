import { useRef } from 'react'
import styles from './world.module.scss'
import { useResizeObserver } from './world.use-resize-observer.js'

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
