import * as z from 'zod'

export const world = z.strictObject({
  id: z.string(),
})
export type World = z.infer<typeof world>

export async function initWorld(
  id: string,
): Promise<World> {
  return { id }
}
