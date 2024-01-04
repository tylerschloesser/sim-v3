import { Viewport } from '@sim-v3/core'
import { mat4, vec2 } from 'gl-matrix'
import { mat4Scale, mat4Translate } from './util.js'

const transform: mat4 = mat4.create()

export function drawGrid(
  gl: WebGL2RenderingContext,
  center: vec2,
  cellSize: number,
  viewport: Viewport,
): void {
  mat4.identity(transform)

  // flip the y axis so it matches canvas/domxy
  mat4Scale(transform, 1, -1)

  // TODO document this
  mat4Translate(transform, -1)

  // TODO document this
  mat4Scale(transform, 2)
}
