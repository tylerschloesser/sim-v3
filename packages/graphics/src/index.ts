import { Vec2 } from '@sim-v3/core'
import curry from 'lodash/fp/curry.js'
import invariant from 'tiny-invariant'
import fragSource from './frag.glsl'
import {
  Attributes,
  Graphics,
  ShaderSource,
  ShaderType,
  Uniforms,
  WebGLAttributeLocation,
} from './types.js'
import vertSource from './vert.glsl'

export { Graphics } from './types.js'

export async function initGraphics(
  canvas: HTMLCanvasElement,
): Promise<Graphics> {
  const gl = canvas.getContext('webgl2')
  invariant(gl)

  const program = initProgram(gl)
  gl.useProgram(program)

  const attributes: Attributes = {
    vertex: getAttribLocation(gl, program, 'aVertex'),
    matrix: getAttribLocation(gl, program, 'aMatrix'),
  }

  // prettier-ignore
  const uniforms: Uniforms = {
    transform: getUniformLocation(gl, program, 'uTransform'),
    color: getUniformLocation(gl, program, 'uColor')
  }

  return {
    clear: () => clear(gl),
    drawGrid: curry(drawGrid)(gl),
  }
}

function initProgram(
  gl: WebGL2RenderingContext,
): WebGLProgram {
  const program = gl.createProgram()
  invariant(program)

  gl.attachShader(
    program,
    initShader(gl, gl.VERTEX_SHADER, vertSource),
  )
  gl.attachShader(
    program,
    initShader(gl, gl.FRAGMENT_SHADER, fragSource),
  )

  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    // prettier-ignore
    invariant(false, `Error linking program: ${gl.getProgramInfoLog(program)}`)
  }

  return program
}

function initShader(
  gl: WebGL2RenderingContext,
  type: ShaderType,
  source: ShaderSource,
): WebGLShader {
  const shader = gl.createShader(type)
  invariant(shader)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    // prettier-ignore
    invariant(false, `Error compiling shader: ${gl.getShaderInfoLog(shader)}`)
  }
  return shader
}

function clear(gl: WebGL2RenderingContext): void {
  gl.clearColor(1, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}

function drawGrid(
  gl: WebGL2RenderingContext,
  center: Vec2,
  cellSize: number,
): void {}

function getUniformLocation(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  name: string,
) {
  const location = gl.getUniformLocation(program, name)
  invariant(location)
  return location
}

function getAttribLocation(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  name: string,
): WebGLAttributeLocation {
  const location = gl.getAttribLocation(program, name)
  invariant(location !== -1)
  return location
}
