import { initCamera } from '@sim-v3/core'
import { initGame } from '@sim-v3/game'
import { initGraphics } from '@sim-v3/graphics'
import { initWorld } from '@sim-v3/world'
import { createContext } from 'react'
import { initViewport } from './viewport.js'

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
  const [world, camera, viewport, graphics] =
    await Promise.all([
      initWorld(worldId),
      initCamera(),
      initViewport(container, canvas, signal),
      initGraphics(canvas),
    ])
  const game = initGame(world, camera, graphics, viewport)

  const context: IContext = {
    container,
    canvas,
    render: game.render,
    signal,
  }

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
