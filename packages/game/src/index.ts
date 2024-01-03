import { Graphics } from '@sim-v3/graphics'

export function initGame(graphics: Graphics) {
  return {
    render() {
      graphics.clear()
    },
  }
}

export type Game = ReturnType<typeof initGame>
