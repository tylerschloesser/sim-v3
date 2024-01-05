import { Vec2 } from '@sim-v3/core'
import invariant from 'tiny-invariant'

const velocity: Vec2 = { x: 0, y: 0 }

export class CameraMomentum {
  start: number = 0
  len: number = 0

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
    this.start = (this.start + 1) % this.queue.length
    this.len = Math.min(this.len + 1, this.queue.length)

    const val = this.queue.at(this.start)
    invariant(val)

    val.dx = dx
    val.dy = dy
    val.t0 = t0
    val.t1 = t1
  }

  velocity(window: number): Vec2 | null {
    velocity.x = 0
    velocity.y = 0

    const now = performance.now()
    let dt = 0

    for (let i = 0; i < this.len; i++) {
      const val = this.queue.at(
        (this.start + i) % this.queue.length,
      )
      invariant(val)
      const { dx, dy, t0, t1 } = val

      if (now - t0 < window) {
        velocity.x += dx
        velocity.y += dy
        dt += t1 - t0
      }
    }

    if (
      dt === 0 ||
      (velocity.x === 0 && velocity.y === 0)
    ) {
      return null
    }

    velocity.x /= dt
    velocity.y /= dt

    return velocity
  }

  clear(): void {
    this.start = this.len = 0
  }
}
