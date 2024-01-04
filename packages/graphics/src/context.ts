import { Viewport } from '@sim-v3/core'
import { mat4 } from 'gl-matrix'
import { WebGLAttributeLocation } from './types.js'

export interface Attributes {
  vertex: WebGLAttributeLocation
  matrix: WebGLAttributeLocation
}

export interface Uniforms {
  transform: WebGLUniformLocation
  color: WebGLUniformLocation
}

export enum BufferType {
  Matrix = 'matrix',
  Vertex = 'vertex',
}

export interface BufferBase {
  data: Float32Array
  buffer: WebGLBuffer
}

export interface MatrixBuffer extends BufferBase {
  type: BufferType.Matrix
  matrices: mat4[]
}

export interface VertexBuffer extends BufferBase {
  type: BufferType.Vertex
}

export interface Buffers {
  vertex: VertexBuffer
  matrix: MatrixBuffer
}

export interface Context {
  viewport: Viewport
  gl: WebGL2RenderingContext
  uniforms: Uniforms
  attributes: Attributes
  buffers: Buffers
}
