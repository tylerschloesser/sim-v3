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
