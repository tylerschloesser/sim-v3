import { initCamera } from '@sim-v3/camera'
import { InitFn, Viewport } from '@sim-v3/core'
import { initGame } from '@sim-v3/game'
import { initGraphics } from '@sim-v3/graphics'
import { initWorld } from '@sim-v3/world'
import { createContext } from 'react'

type RenderFn = () => void

export interface IContext {
  viewport: Viewport
  render: RenderFn
  signal: AbortSignal
}

export const Context = createContext<IContext>(null!)

export enum AbortReason {
  EffectCleanup = 'effect-cleanup',
}

export const initContext: InitFn<IContext> = async (
  args,
) => {
  const [world, camera, graphics] = await Promise.all([
    initWorld(args),
    initCamera(args),
    initGraphics(args),
  ])
  const game = initGame(world, camera, graphics)

  const { signal } = args
  const context: IContext = {
    viewport: args.viewport,
    render: game.render,
    signal,
  }

  startRenderLoop(context)

  return context
}

function startRenderLoop(context: IContext) {
  const { signal } = context
  function render() {
    if (signal.aborted) {
      return
    }
    context.render()
    self.requestAnimationFrame(render)
  }
  self.requestAnimationFrame(render)
}
