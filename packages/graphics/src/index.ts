import { Vec2 } from '@sim-v3/core'
import invariant from 'tiny-invariant'

export async function initGraphics(
  canvas: HTMLCanvasElement,
) {
  const gl = canvas.getContext('webgl2')
  invariant(gl)

  return {
    clear() {
      gl.clearColor(1, 0, 0, 1)
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    },
    drawGrid(center: Vec2, cellSize: number) {},
  }
}

export type Graphics = Awaited<
  ReturnType<typeof initGraphics>
>
