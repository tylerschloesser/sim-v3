import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import invariant from 'tiny-invariant'
import {
  AbortReason,
  Context,
  IContext,
} from '../context.js'
import styles from './world.module.scss'

function initContext(
  container: HTMLDivElement,
  canvas: HTMLCanvasElement,
  { signal }: AbortController,
): IContext {
  const context: IContext = {
    render() {},
    signal,
  }

  initResizeObserver(container, canvas, signal)
  initRenderLoop(context, signal)

  return context
}

function useWorldId() {
  const params = useParams<{ id: string }>()
  invariant(params.id)
  return params.id
}

export function WorldPage() {
  const worldId = useWorldId()
  const container = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [context, setContext] = useState<IContext | null>(
    null,
  )
  useEffect(() => {
    invariant(container.current)
    invariant(canvas.current)
    const controller = new AbortController()

    // TODO remove this after testing
    controller.signal.addEventListener('abort', () => {
      console.log('abort reason:', controller.signal.reason)
    })

    setContext(
      initContext(
        container.current,
        canvas.current,
        controller,
      ),
    )
    return () => {
      controller.abort(AbortReason.EffectCleanup)
    }
  }, [worldId])
  return (
    <>
      <div className={styles.container} ref={container}>
        <canvas
          className={styles.canvas}
          ref={canvas}
        ></canvas>
      </div>
      {context && (
        <Context.Provider value={context}>
          TODO
        </Context.Provider>
      )}
    </>
  )
}

function initRenderLoop(
  context: IContext,
  signal: AbortSignal,
) {
  function handleFrame() {
    if (signal.aborted) {
      return
    }
    context.render()
    self.requestAnimationFrame(handleFrame)
  }
  self.requestAnimationFrame(handleFrame)
}

function initResizeObserver(
  container: HTMLDivElement,
  canvas: HTMLCanvasElement,
  signal: AbortSignal,
): void {
  const observer = new ResizeObserver((entries) => {
    invariant(entries.length === 1)
    const entry = entries.at(0)
    invariant(entry)
    const { contentRect: rect } = entry

    canvas.width = rect.width
    canvas.height = rect.height
  })
  observer.observe(container)

  signal.addEventListener('abort', () => {
    observer.disconnect()
  })
}
