import { initGame } from '@sim-v3/game'
import { initGraphics } from '@sim-v3/graphics'
import { initWorld } from '@sim-v3/world'
import { createContext } from 'react'
import invariant from 'tiny-invariant'

type RenderFn = () => void

export interface IContext {
  container: HTMLDivElement
  canvas: HTMLCanvasElement
  render: RenderFn
  signal: AbortSignal
}

export const Context = createContext<IContext>(null!)

export enum AbortReason {
  EffectCleanup = 'effect-cleanup',
}

export async function initContext(
  worldId: string,
  container: HTMLDivElement,
  canvas: HTMLCanvasElement,
  { signal }: AbortController,
): Promise<IContext> {
  const world = initWorld(worldId)
  const graphics = initGraphics(canvas)
  const game = initGame(world, graphics)

  const context: IContext = {
    container,
    canvas,
    render: game.render,
    signal,
  }

  initResizeObserver(context)
  initRenderLoop(context)

  return context
}

function initRenderLoop(context: IContext) {
  const { signal } = context
  function handleFrame() {
    if (signal.aborted) {
      return
    }
    context.render()
    self.requestAnimationFrame(handleFrame)
  }
  self.requestAnimationFrame(handleFrame)
}

function initResizeObserver(context: IContext): void {
  const { canvas, container, signal } = context
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
