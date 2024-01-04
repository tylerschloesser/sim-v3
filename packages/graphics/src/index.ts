import { Vec2 } from '@sim-v3/core'
import curry from 'lodash/fp/curry.js'
import invariant from 'tiny-invariant'

export interface Graphics {
  clear(): void
  drawGrid(center: Vec2, cellSize: number): void
}

export async function initGraphics(
  canvas: HTMLCanvasElement,
): Promise<Graphics> {
  const gl = canvas.getContext('webgl2')
  invariant(gl)

  return {
    clear: () => clear(gl),
    drawGrid: curry(drawGrid)(gl),
  }
}

function clear(gl: WebGL2RenderingContext): void {
  gl.clearColor(1, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}

function drawGrid(
  gl: WebGL2RenderingContext,
  center: Vec2,
  cellSize: number,
): void {}
