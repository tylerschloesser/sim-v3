import { Attributes, Uniforms } from './types.js'

export interface Context {
  gl: WebGL2RenderingContext
  uniforms: Uniforms
  attributes: Attributes
}
