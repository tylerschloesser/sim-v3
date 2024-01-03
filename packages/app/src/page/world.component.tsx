import { useContext, useEffect, useRef } from 'react'
import invariant from 'tiny-invariant'
import { Context } from '../context.js'
import styles from './world.module.scss'
import { useResizeObserver } from './world.use-resize-observer.js'

export function WorldPage() {
  const container = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  useResizeObserver(container, canvas)
  useRenderLoop(canvas)
  return (
    <div className={styles.container} ref={container}>
      <canvas
        className={styles.canvas}
        ref={canvas}
      ></canvas>
    </div>
  )
}

function useRenderLoop(
  canvas: React.RefObject<HTMLCanvasElement>,
) {
  const context = useContext(Context)
  useEffect(() => {
    let stop = false
    function handleFrame() {
      if (stop) return
      invariant(canvas.current)
      context.render()
      self.requestAnimationFrame(handleFrame)
    }
    self.requestAnimationFrame(handleFrame)
    return () => {
      stop = true
    }
  }, [])
}
