import { initCamera } from '@sim-v3/core'
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
  const [world, camera, graphics] = await Promise.all([
    initWorld(worldId),
    initCamera(),
    initGraphics(canvas),
  ])
  const game = initGame(world, camera, graphics)

  const context: IContext = {
    container,
    canvas,
    render: game.render,
    signal,
  }

  initResizeObserver(context)
  initDevicePixelRatioListener(context)
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
    const devicePixelRatio = getDevicePixelRatio()
    canvas.width = rect.width * devicePixelRatio
    canvas.height = rect.height * devicePixelRatio
  })
  observer.observe(container)

  signal.addEventListener('abort', () => {
    observer.disconnect()
  })
}

function initDevicePixelRatioListener(
  context: IContext,
): void {
  const { canvas, signal } = context
  function updateListener() {
    const query = `(resolution: ${getDevicePixelRatio()}dppx)`
    const media = matchMedia(query)
    function listener() {
      const rect = canvas.getBoundingClientRect()
      const devicePixelRatio = getDevicePixelRatio()
      canvas.width = rect.width * devicePixelRatio
      canvas.height = rect.height * devicePixelRatio
      media.removeEventListener('change', listener)
      updateListener()
    }
    media.addEventListener('change', listener, { signal })
  }
  updateListener()
}

function getDevicePixelRatio() {
  return self.devicePixelRatio
}
