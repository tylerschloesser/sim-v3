import { initGraphics } from '@sim-v3/graphics'
import { createContext } from 'react'
import invariant from 'tiny-invariant'

type RenderFn = () => void

export interface IContext {
  render: RenderFn
  signal: AbortSignal
}

export const Context = createContext<IContext>(null!)

export enum AbortReason {
  EffectCleanup = 'effect-cleanup',
}

export function initContext(
  container: HTMLDivElement,
  canvas: HTMLCanvasElement,
  { signal }: AbortController,
): IContext {
  const graphics = initGraphics(canvas)

  const context: IContext = {
    render() {
      graphics.clear()
    },
    signal,
  }

  initResizeObserver(container, canvas, signal)
  initRenderLoop(context, signal)

  return context
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
