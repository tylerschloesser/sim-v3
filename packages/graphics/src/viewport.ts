import { Viewport } from '@sim-v3/core'
import invariant from 'tiny-invariant'

type UpdateViewportFn = (rect: DOMRectReadOnly) => void

export function initViewport(
  container: HTMLDivElement,
  canvas: HTMLCanvasElement,
  signal: AbortSignal,
  gl: WebGL2RenderingContext,
): Viewport {
  const viewport: Viewport = {
    size: { x: 0, y: 0 },
  }

  const updateViewport: UpdateViewportFn = (rect) => {
    const devicePixelRatio = getDevicePixelRatio()
    const width = rect.width * devicePixelRatio
    const height = rect.height * devicePixelRatio
    viewport.size.x = canvas.width = width
    viewport.size.y = canvas.height = height
    gl.viewport(0, 0, width, height)
  }

  initResizeObserver(container, signal, updateViewport)
  initDevicePixelRatioListener(
    canvas,
    signal,
    updateViewport,
  )

  return viewport
}

function initResizeObserver(
  container: HTMLDivElement,
  signal: AbortSignal,
  updateViewport: UpdateViewportFn,
): void {
  const observer = new ResizeObserver((entries) => {
    invariant(entries.length === 1)
    const entry = entries.at(0)
    invariant(entry)
    updateViewport(entry.contentRect)
  })
  observer.observe(container)

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
    const query = `(resolution: ${getDevicePixelRatio()}dppx)`
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

function getDevicePixelRatio() {
  return self.devicePixelRatio
}
