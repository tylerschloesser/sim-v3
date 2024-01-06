import { Camera, Viewport } from '@sim-v3/core'
import invariant from 'tiny-invariant'

export class CameraTaper {
  i: number = 0
  len: number = 0

  // camera start position
  sx: number = 0
  sy: number = 0
  // camera velocity
  vx: number = 0
  vy: number = 0
  // camera acceleration
  ax: number = 0
  ay: number = 0

  startTime: number | null = null
  duration: number = 1000
  queue: {
    dx: number
    dy: number
    t0: number
    t1: number
  }[]
  camera: Camera
  viewport: Viewport
  signal: AbortSignal

  constructor(
    size: number,
    camera: Camera,
    viewport: Viewport,
    signal: AbortSignal,
  ) {
    this.queue = new Array(size)
      .fill(null)
      .map(() => ({ dx: 0, dy: 0, t0: 0, t1: 0 }))
    this.camera = camera
    this.viewport = viewport
    this.signal = signal
    self.requestAnimationFrame(this.update)
  }

  record(
    dx: number,
    dy: number,
    t0: number,
    t1: number,
  ): void {
    invariant(t0 <= t1)

    this.i = (this.i + 1) % this.queue.length
    this.len = Math.min(this.len + 1, this.queue.length)

    const val = this.queue.at(this.i)
    invariant(val)

    val.dx = dx
    val.dy = dy
    val.t0 = t0
    val.t1 = t1
  }

  start(window: number, time: number): void {
    this.startTime = null

    let dx = 0
    let dy = 0

    let dt = 0

    for (let i = 0; i < this.len; i++) {
      const val = this.queue.at(
        (this.i + i) % this.queue.length,
      )
      invariant(val)

      if (time - val.t0 < window) {
        dx += val.dx
        dy += val.dy
        dt += val.t1 - val.t0
      }
    }

    this.clear()

    if (dt === 0 || (dx === 0 && dy === 0)) {
      return
    }

    this.sx = this.camera.position.x
    this.sy = this.camera.position.y
    this.vx = dx / dt
    this.vy = dy / dt
    this.ax = -this.vx / this.duration
    this.ay = -this.vy / this.duration
    this.startTime = time

    console.debug(
      `starting camera taper with ${[
        `sx=${this.sx.toFixed(1)}`,
        `sy=${this.sy.toFixed(1)}`,
        `vx=${(this.vx * 1e3).toFixed(0)}e-3`,
        `vy=${(this.vy * 1e3).toFixed(0)}e-3`,
        `ax=${(this.ax * 1e6).toFixed(0)}e-6`,
        `ay=${(this.ay * 1e6).toFixed(0)}e-6`,
      ].join(', ')}`,
    )
  }

  update = () => {
    if (this.signal.aborted) {
      return
    }
    const now = self.performance.now()

    self.requestAnimationFrame(this.update)

    const { sx, sy, vx, vy, ax, ay } = this
    const { startTime, duration } = this

    if (startTime === null) {
      return
    }

    let dt = Math.min(now - startTime, duration)
    dt = smooth(dt / duration) * duration

    const dx = vx * dt + 0.5 * ax * dt ** 2
    const dy = vy * dt + 0.5 * ay * dt ** 2

    this.camera.position.x = sx + dx
    this.camera.position.y = sy + dy

    if (now - startTime >= duration) {
      this.startTime = null
    }
  }

  clear(): void {
    this.i = this.len = 0
  }

  cancel(): void {
    this.startTime = null
  }
}

function smooth(k: number) {
  invariant(k >= 0)
  invariant(k <= 1)
  // scale so that the velocity starts slowing
  // roughly linearly and then tapers off
  return (1 - (1 - k) ** 5) / 5
}
