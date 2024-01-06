import {
  Camera,
  Vec2,
  Viewport,
  mod,
  zoomToCellSize,
} from '@sim-v3/core'
import { mat4 } from 'gl-matrix'
import invariant from 'tiny-invariant'
import { Context } from './context.js'
import { mat4Scale, mat4Translate } from './util.js'

const transform: mat4 = mat4.create()

// function updateColor(
//   context: Context,
//   camera: Camera,
// ): void {
//   const color = rgb(0.25 * camera.zoom * 255)
//   context.gl.uniform4f(
//     context.uniforms.color,
//     color.r,
//     color.g,
//     color.b,
//     color.a,
//   )
// }

export function drawGrid(
  context: Context,
  camera: Camera,
): void {
  const { gl, buffers, viewport } = context

  // updateColor(context, camera)
  bindColorBuffer(context)

  const cellSize = zoomToCellSize(
    camera.zoom,
    viewport.size.x,
    viewport.size.y,
  )

  updateTransform(
    context,
    camera.position,
    cellSize,
    viewport,
  )

  bindVertexBuffer(context)

  const { matrices } = buffers.matrix
  const cols = Math.ceil(viewport.size.x / cellSize) + 1
  const rows = Math.ceil(viewport.size.y / cellSize) + 1
  invariant(cols + rows <= matrices.length)

  bindMatrixBuffer(context, cellSize, cols, rows)

  // prettier-ignore
  gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, cols + rows)
}

function updateTransform(
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

function bindVertexBuffer({
  gl,
  buffers,
  attributes,
}: Context): void {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertex.buffer)
  // prettier-ignore
  gl.vertexAttribPointer(attributes.vertex, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(attributes.vertex)
}

function bindMatrixBuffer(
  { gl, attributes, buffers }: Context,
  cellSize: number,
  cols: number,
  rows: number,
): void {
  const { matrices } = buffers.matrix
  let mi = 0
  for (let col = 0; col < cols; col++) {
    const matrix = matrices.at(mi++)
    invariant(matrix)

    mat4.identity(matrix)
    mat4Translate(matrix, col * cellSize, 0)
    mat4Scale(matrix, 2, rows * cellSize)
  }
  for (let row = 0; row < rows; row++) {
    const matrix = matrices.at(mi++)
    invariant(matrix)

    mat4.identity(matrix)
    mat4Translate(matrix, 0, row * cellSize)
    mat4Scale(matrix, cols * cellSize, 2)
  }

  invariant(mi === cols + rows)

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.matrix.buffer)
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, buffers.matrix.data)

  for (let i = 0; i < 4; i++) {
    const index = attributes.matrix + i
    gl.enableVertexAttribArray(index)
    const offset = i * 16
    // prettier-ignore
    gl.vertexAttribPointer(index, 4, gl.FLOAT, false, 4 * 16, offset)
    gl.vertexAttribDivisor(index, 1)
  }
}

function bindColorBuffer(context: Context): void {}
