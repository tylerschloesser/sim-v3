import { Viewport } from '@sim-v3/core'
import invariant from 'tiny-invariant'

type UpdateViewportFn = (rect: DOMRectReadOnly) => void

type ListenerFn = (viewport: Viewport) => void

export function initViewport(
  canvas: HTMLCanvasElement,
  signal: AbortSignal,
): Viewport {
  const listeners = new Set<ListenerFn>()
  const viewport: Viewport = {
    canvas,
    size: { x: 0, y: 0 },
    pixelRatio: 0,
    addListener(listener) {
      listeners.add(listener)
      listener(viewport)
    },
    removeListener(listener) {
      invariant(listeners.delete(listener))
    },
  }

  const updateViewport: UpdateViewportFn = (rect) => {
    viewport.pixelRatio = getPixelRatio()
    viewport.size.x = rect.width
    viewport.size.y = rect.height

    canvas.width = viewport.size.x * viewport.pixelRatio
    canvas.height = viewport.size.y * viewport.pixelRatio

    for (const listener of listeners) {
      listener(viewport)
    }
  }

  // TODO this is not really necessary because the resize
  // observer will also update the viewport, but this ensures
  // that it's impossible for the initial viewport to be 0.
  //
  updateViewport(canvas.getBoundingClientRect())

  initResizeObserver(canvas, signal, updateViewport)
  initDevicePixelRatioListener(
    canvas,
    signal,
    updateViewport,
  )

  return viewport
}

function initResizeObserver(
  canvas: HTMLCanvasElement,
  signal: AbortSignal,
  updateViewport: UpdateViewportFn,
): void {
  const observer = new ResizeObserver((entries) => {
    invariant(entries.length === 1)
    const entry = entries.at(0)
    invariant(entry)
    updateViewport(entry.contentRect)
  })
  observer.observe(canvas)

  signal.addEventListener('abort', () => {
    observer.disconnect()
  })
}

function initDevicePixelRatioListener(
  canvas: HTMLCanvasElement,
  signal: AbortSignal,
  updateViewport: UpdateViewportFn,
): void {
  function updateListener() {
    const query = `(resolution: ${getPixelRatio()}dppx)`
    const media = matchMedia(query)
    function listener() {
      updateViewport(canvas.getBoundingClientRect())
      media.removeEventListener('change', listener)
      updateListener()
    }
    media.addEventListener('change', listener, { signal })
  }
  updateListener()
}

function getPixelRatio() {
  return self.devicePixelRatio
}
