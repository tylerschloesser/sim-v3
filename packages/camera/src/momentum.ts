import { Camera, Vec2, Viewport } from '@sim-v3/core'
import invariant from 'tiny-invariant'

export class CameraMomentum {
  i: number = 0
  len: number = 0
  velocity: Vec2 = { x: 0, y: 0 }
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
    this.startTime = null
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

    this.velocity.x = dx / dt
    this.velocity.y = dy / dt
    this.startTime = time

    console.log(
      this.velocity.x,
      this.velocity.y,
      this.startTime,
    )
  }

  update = (time: number) => {
    if (this.signal.aborted) {
      return
    }

    self.requestAnimationFrame(this.update)

    if (this.startTime === null) {
      return
    }
    invariant(
      this.velocity.x !== 0 || this.velocity.y !== 0,
    )

    let dt = Math.min(time - this.startTime, this.duration)
    dt = smooth(dt / this.duration) * this.duration

    const vx = this.velocity.x
    const vy = this.velocity.y

    const ax = -vx / this.duration
    const ay = -vy / this.duration

    this.camera.position.x += vx * dt + 0.5 * ax * dt ** 2
    this.camera.position.y += vy * dt + 0.5 * ay * dt ** 2

    if (time - this.startTime >= this.duration) {
      this.startTime = null
      console.debug('end momentum')
    }
  }

  clear(): void {
    this.i = this.len = 0
  }
}

function smooth(k: number) {
  invariant(k >= 0)
  invariant(k <= 1)
  // scale so that the velocity starts slowing
  // roughly linearly and then tapers off
  return (1 - (1 - k) ** 5) / 5
}
