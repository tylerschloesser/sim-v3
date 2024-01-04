import { Vec2 } from '@sim-v3/core'
import curry from 'lodash/fp/curry.js'
import invariant from 'tiny-invariant'
import fragSource from './frag.glsl'
import vertSource from './vert.glsl'

export interface Graphics {
  clear(): void
  drawGrid(center: Vec2, cellSize: number): void
}

export async function initGraphics(
  canvas: HTMLCanvasElement,
): Promise<Graphics> {
  const gl = canvas.getContext('webgl2')
  invariant(gl)

  const program = initProgram(gl)
  gl.useProgram(program)

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

type ShaderType = number
type ShaderSource = string

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
