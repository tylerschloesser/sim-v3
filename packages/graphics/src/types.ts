import { Vec2 } from '@sim-v3/core'

export interface Graphics {
  clear(): void
  drawGrid(center: Vec2, cellSize: number): void
}

export type ShaderType = number
export type ShaderSource = string
export type WebGLAttributeLocation = number

export interface Attributes {
  vertex: WebGLAttributeLocation
  matrix: WebGLAttributeLocation
}

export interface Uniforms {
  transform: WebGLUniformLocation
  color: WebGLUniformLocation
}
