import {
  Camera,
  Viewport,
  zoomToCellSize,
} from '@sim-v3/core'
import { mat4, vec4 } from 'gl-matrix'
import invariant from 'tiny-invariant'
import { Color, rgb } from './color.js'
import { LIMIT } from './const.js'
import { Context } from './context.js'
import { mat4Scale, mat4Translate } from './util.js'

const transform: mat4 = mat4.create()

let count = 0
const batched = new Array(LIMIT).fill(null).map(() => ({
  x: 0,
  y: 0,
  w: 0,
  h: 0,
  color: rgb(0, 0, 0),
}))

export function batchRect(
  x: number,
  y: number,
  w: number,
  h: number,
  color: Color,
): void {
  invariant(count < batched.length)
  const rect = batched[count++]
  invariant(rect)
  rect.x = x
  rect.y = y
  rect.w = w
  rect.h = h
  rect.color.r = color.r
  rect.color.g = color.g
  rect.color.b = color.b
  rect.color.a = color.a
}

export function drawBatchedRects(
  context: Context,
  camera: Camera,
): void {
  if (count === 0) return

  const { gl, viewport } = context

  const cellSize = zoomToCellSize(
    camera.zoom,
    viewport.size.x,
    viewport.size.y,
  )

  updateTransform(context, camera, cellSize, viewport)

  bindVertexBuffer(context)
  bindColorBuffer(context)
  bindMatrixBuffer(context)

  gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, count)

  count = 0
}

function updateTransform(
  { gl, uniforms }: Context,
  camera: Camera,
  cellSize: number,
  viewport: Viewport,
): void {
  mat4.identity(transform)

  // flip the y axis so it matches canvas/domxy
  mat4Scale(transform, 1 * 2, -1 * 2)

  mat4Scale(
    transform,
    (1 / viewport.size.x) * cellSize,
    (1 / viewport.size.y) * cellSize,
  )

  mat4Translate(
    transform,
    -camera.position.x,
    -camera.position.y,
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

function bindColorBuffer({
  gl,
  buffers,
  attributes,
}: Context): void {
  const { colors } = buffers.color
  for (let i = 0; i < count; i++) {
    const v = colors[i]
    invariant(v)
    const rect = batched[i]
    invariant(rect)
    vec4.set(
      v,
      rect.color.r,
      rect.color.g,
      rect.color.b,
      rect.color.a,
    )
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color.buffer)
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, buffers.color.data)

  gl.enableVertexAttribArray(attributes.color)
  // prettier-ignore
  gl.vertexAttribPointer(attributes.color, 4, gl.FLOAT, false, 0, 0)
  gl.vertexAttribDivisor(attributes.color, 1)
}

function bindMatrixBuffer({
  gl,
  attributes,
  buffers,
}: Context): void {
  const { matrices } = buffers.matrix

  for (let i = 0; i < count; i++) {
    const matrix = matrices.at(i)
    invariant(matrix)
    const rect = batched.at(i)
    invariant(rect)

    mat4.identity(matrix)
    mat4Translate(matrix, rect.x, rect.y)
    mat4Scale(matrix, rect.w, rect.h)
  }

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
