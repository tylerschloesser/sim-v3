import { Graphics } from '@sim-v3/graphics'
import { World } from '@sim-v3/world'

export function initGame(world: World, graphics: Graphics) {
  return {
    render() {
      graphics.clear()
    },
  }
}

export type Game = ReturnType<typeof initGame>
