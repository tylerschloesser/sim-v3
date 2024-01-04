import { Vec2, Viewport } from '@sim-v3/core'
import curry from 'lodash/fp/curry.js'
import invariant from 'tiny-invariant'
import { Context } from './context.js'
import { drawGrid } from './draw-grid.js'
import fragSource from './frag.glsl'
import {
  Attributes,
  ShaderSource,
  ShaderType,
  Uniforms,
  WebGLAttributeLocation,
} from './types.js'
import vertSource from './vert.glsl'

export interface Graphics {
  clear(): void
  drawGrid(
    center: Vec2,
    cellSize: number,
    viewport: Viewport,
  ): void
}

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

  gl.uniform4f(uniforms.color, 0, 0, 1, 1)

  const context: Context = {
    gl,
    uniforms,
    attributes,
  }

  return {
    clear: () => clear(gl),
    drawGrid: curry(drawGrid)(context),
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
