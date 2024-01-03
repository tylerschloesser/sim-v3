import invariant from 'tiny-invariant'

export function initGraphics(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl2')
  invariant(gl)

  return {
    clear() {
      gl.clearColor(1, 0, 0, 1)
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    },
  }
}

export type Graphics = ReturnType<typeof initGraphics>
