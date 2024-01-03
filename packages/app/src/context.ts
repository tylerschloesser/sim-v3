import { createContext } from 'react'

type RenderFn = () => void

export interface IContext {
  render: RenderFn
}

export const Context = createContext<IContext>(null!)