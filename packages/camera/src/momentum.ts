import { Camera, Vec2 } from '@sim-v3/core'
import invariant from 'tiny-invariant'

export class CameraMomentum {
  i: number = 0
  len: number = 0
  velocity: Vec2 = { x: 0, y: 0 }
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
    this.velocity.x = 0
    this.velocity.y = 0

    let dx = 0
    let dy = 0

    const now = performance.now()
    let dt = 0

    for (let i = 0; i < this.len; i++) {
      const val = this.queue.at(
        (this.i + i) % this.queue.length,
      )
      invariant(val)

      if (now - val.t0 < window) {
        dx += val.dx
        dy += val.dy
        dt += val.t1 - val.t0
      }
    }

    if (dt === 0 || (dx === 0 && dy === 0)) {
      return
    }

    this.velocity.x = dx / dt
    this.velocity.y = dy / dt

    self.requestAnimationFrame(this.update.bind(this))
  }

  update(time: number) {}

  clear(): void {
    this.i = this.len = 0
  }
}
