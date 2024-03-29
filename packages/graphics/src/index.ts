import { Camera, InitFn } from '@sim-v3/core'
import { mat4, vec4 } from 'gl-matrix'
import invariant from 'tiny-invariant'
import { Color } from './color.js'
import { LIMIT } from './const.js'
import {
  Attributes,
  BufferType,
  ColorBuffer,
  Context,
  MatrixBuffer,
  Uniforms,
  VertexBuffer,
} from './context.js'
import { drawGrid } from './draw-grid.js'
import { batchRect, drawBatchedRects } from './draw-rect.js'
import fragSource from './frag.glsl'
import {
  ShaderSource,
  ShaderType,
  WebGLAttributeLocation,
} from './types.js'
import vertSource from './vert.glsl'

export * from './color.js'

export interface Graphics {
  clear(): void
  drawGrid(camera: Camera): void
  drawRect(
    x: number,
    y: number,
    w: number,
    h: number,
    color: Color,
  ): void
  flush(camera: Camera): void
}

export const initGraphics: InitFn<Graphics> = async ({
  viewport,
}) => {
  const gl = viewport.canvas.getContext('webgl2')
  invariant(gl)

  viewport.addListener(() => {
    gl.viewport(
      0,
      0,
      viewport.size.x * viewport.pixelRatio,
      viewport.size.y * viewport.pixelRatio,
    )
  })

  const program = initProgram(gl)
  gl.useProgram(program)

  const attributes: Attributes = {
    vertex: getAttribLocation(gl, program, 'aVertex'),
    matrix: getAttribLocation(gl, program, 'aMatrix'),
    color: getAttribLocation(gl, program, 'aColor'),
  }

  // prettier-ignore
  const uniforms: Uniforms = {
    transform: getUniformLocation(gl, program, 'uTransform'),
  }

  const buffers = initBuffers(gl)

  const context: Context = {
    viewport,
    gl,
    uniforms,
    attributes,
    buffers,
  }

  return {
    clear() {
      clear(gl)
    },
    drawGrid(camera: Camera) {
      drawGrid(context, camera)
    },
    drawRect(
      x: number,
      y: number,
      w: number,
      h: number,
      color: Color,
    ) {
      batchRect(x, y, w, h, color)
    },
    flush(camera: Camera) {
      drawBatchedRects(context, camera)

      // TODO test if this actually helps
      gl.invalidateFramebuffer(gl.FRAMEBUFFER, [])
    },
  }
}

function initVertexBuffer(
  gl: WebGL2RenderingContext,
): VertexBuffer {
  // prettier-ignore
  const data = new Float32Array([
    0.0, 0.0,
    0.0, 1.0,
    1.0, 0.0,
    1.0, 1.0,
  ])
  const buffer = gl.createBuffer()
  invariant(buffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
  return { type: BufferType.Vertex, buffer, data }
}

function initMatrixBuffer(
  gl: WebGL2RenderingContext,
): MatrixBuffer {
  const buffer = gl.createBuffer()
  invariant(buffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

  const data = new Float32Array(LIMIT * 16)
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW)

  const matrices = new Array<mat4>(LIMIT)
  for (let i = 0; i < LIMIT; i++) {
    matrices[i] = data.subarray(i * 16, (i + 1) * 16)
  }

  return { type: BufferType.Matrix, data, buffer, matrices }
}

function initColorBuffer(
  gl: WebGL2RenderingContext,
): ColorBuffer {
  const buffer = gl.createBuffer()
  invariant(buffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

  const data = new Float32Array(LIMIT * 4)
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW)

  const colors = new Array<vec4>(LIMIT)
  for (let i = 0; i < LIMIT; i++) {
    colors[i] = data.subarray(i * 4, (i + 1) * 4)
  }

  return { type: BufferType.Color, data, buffer, colors }
}

function initBuffers(gl: WebGL2RenderingContext) {
  return {
    vertex: initVertexBuffer(gl),
    matrix: initMatrixBuffer(gl),
    color: initColorBuffer(gl),
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
  gl.clearColor(0, 0, 0, 1)
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
