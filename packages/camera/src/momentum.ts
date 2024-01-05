import { Camera, Vec2 } from '@sim-v3/core'
import invariant from 'tiny-invariant'

const velocity: Vec2 = { x: 0, y: 0 }

export class CameraMomentum {
  i: number = 0
  len: number = 0

  active: boolean = false

  queue: {
    dx: number
    dy: number
    t0: number
    t1: number
  }[]

  constructor(size: number) {
    this.queue = new Array(size)
      .fill(null)
      .map(() => ({ dx: 0, dy: 0, t0: 0, t1: 0 }))
  }

  push(
    dx: number,
    dy: number,
    t0: number,
    t1: number,
  ): void {
    this.i = (this.i + 1) % this.queue.length
    this.len = Math.min(this.len + 1, this.queue.length)

    const val = this.queue.at(this.i)
    invariant(val)

    val.dx = dx
    val.dy = dy
    val.t0 = t0
    val.t1 = t1
  }

  start(
    camera: Camera,
    cellSize: number,
    window: number,
  ): void {
    let vx = 0
    let vy = 0

    const now = performance.now()
    let dt = 0

    for (let i = 0; i < this.len; i++) {
      const val = this.queue.at(
        (this.i + i) % this.queue.length,
      )
      invariant(val)
      const { dx, dy, t0, t1 } = val

      if (now - t0 < window) {
        vx += dx
        vy += dy
        dt += t1 - t0
      }
    }

    if (dt === 0 || (vx === 0 && vy === 0)) {
      return
    }

    vx /= dt
    vy /= dt

    this.active = true

    self.requestAnimationFrame(this.update.bind(this))
  }

  update(time: number) {}

  clear(): void {
    this.i = this.len = 0
  }
}
