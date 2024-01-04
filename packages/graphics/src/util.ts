import { mat4, vec3 } from 'gl-matrix'

const v3 = vec3.create()

export function mat4Scale(matrix: mat4, xy: number): void
export function mat4Scale(
  matrix: mat4,
  x: number,
  y: number,
): void
export function mat4Scale(
  matrix: mat4,
  x: number,
  y: number,
  z: number,
): void
export function mat4Scale(
  matrix: mat4,
  x: number,
  y?: number,
  z?: number,
): void {
  v3[0] = x
  v3[1] = y ?? x
  v3[2] = z ?? 0
  mat4.scale(matrix, matrix, v3)
}

export function mat4Translate(
  matrix: mat4,
  xy: number,
): void
export function mat4Translate(
  matrix: mat4,
  x: number,
  y: number,
): void
export function mat4Translate(
  matrix: mat4,
  x: number,
  y: number,
  z: number,
): void
export function mat4Translate(
  matrix: mat4,
  x: number,
  y?: number,
  z?: number,
): void {
  v3[0] = x
  v3[1] = y ?? x
  v3[2] = z ?? 1
  mat4.translate(matrix, matrix, v3)
}
