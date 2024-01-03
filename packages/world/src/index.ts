import * as z from 'zod'

export const world = z.strictObject({
  id: z.string(),
})
export type World = z.infer<typeof world>

export async function initWorld(
  id: string,
): Promise<World> {
  let world = await loadWorld(id)
  if (!world) {
    world = { id }
  }
  return world
}

function getKey(id: string): string {
  return `world.${id}`
}

async function loadWorld(
  id: string,
): Promise<World | null> {
  const key = getKey(id)
  const json = localStorage.getItem(key)
  if (!json) return null
  return world.parse(json)
}
