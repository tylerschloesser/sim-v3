import { Vec2, Viewport, mod } from '@sim-v3/core'
import { mat4 } from 'gl-matrix'
import { Context } from './context.js'
import { mat4Scale, mat4Translate } from './util.js'

const transform: mat4 = mat4.create()

export function drawGrid(
  { gl, uniforms }: Context,
  center: Vec2,
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

  mat4Scale(
    transform,
    1 / viewport.size.x,
    1 / viewport.size.y,
  )

  // TODO document this
  mat4Translate(transform, -0.5)

  // TODO document this
  // prettier-ignore
  mat4Translate(
    transform,
    (mod(viewport.size.x / 2 / cellSize - center.x, 1) - 1) * cellSize,
    (mod(viewport.size.y / 2 / cellSize - center.y, 1) - 1) * cellSize,
  )

  gl.uniformMatrix4fv(uniforms.transform, false, transform)
}
