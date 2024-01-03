import { createContext } from 'react'

type RenderFn = () => void

export interface World {
  seed: string
}

export interface IContext {
  render: RenderFn
  signal: AbortSignal
}

export const Context = createContext<IContext>(null!)

export enum AbortReason {
  EffectCleanup = 'effect-cleanup',
}
