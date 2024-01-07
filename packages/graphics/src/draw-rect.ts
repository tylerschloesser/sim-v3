import { Camera } from '@sim-v3/core'
import invariant from 'tiny-invariant'
import { Color, rgb } from './color.js'
import { Context } from './context.js'

let i = 0
const batched = new Array(2 ** 10).map(() => ({
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
  invariant(i < batched.length)
  const rect = batched[i++]
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
  i = 0
}
