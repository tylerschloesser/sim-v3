export interface World {
  id: string
}

export function initWorld(id: string): World {
  return { id }
}
