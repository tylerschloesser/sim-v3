import { Viewport } from '@sim-v3/core'
import invariant from 'tiny-invariant'

export async function initViewport(
  container: HTMLDivElement,
  canvas: HTMLCanvasElement,
  signal: AbortSignal,
): Promise<Viewport> {
  const viewport: Viewport = {
    size: { x: 0, y: 0 },
  }

  initResizeObserver(container, canvas, signal, viewport)
  initDevicePixelRatioListener(canvas, signal, viewport)

  return viewport
}

function initResizeObserver(
  container: HTMLDivElement,
  canvas: HTMLCanvasElement,
  signal: AbortSignal,
  viewport: Viewport,
): void {
  const observer = new ResizeObserver((entries) => {
    invariant(entries.length === 1)
    const entry = entries.at(0)
    invariant(entry)
    const { contentRect: rect } = entry
    const devicePixelRatio = getDevicePixelRatio()
    viewport.size.x = canvas.width =
      rect.width * devicePixelRatio
    viewport.size.y = canvas.height =
      rect.height * devicePixelRatio
  })
  observer.observe(container)

  signal.addEventListener('abort', () => {
    observer.disconnect()
  })
}

function initDevicePixelRatioListener(
  canvas: HTMLCanvasElement,
  signal: AbortSignal,
  viewport: Viewport,
): void {
  function updateListener() {
    const query = `(resolution: ${getDevicePixelRatio()}dppx)`
    const media = matchMedia(query)
    function listener() {
      const rect = canvas.getBoundingClientRect()
      const devicePixelRatio = getDevicePixelRatio()
      viewport.size.x = canvas.width =
        rect.width * devicePixelRatio
      viewport.size.y = canvas.height =
        rect.height * devicePixelRatio
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
