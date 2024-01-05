import { RouteObject } from 'react-router-dom'
import { Root } from './route/root.component.js'
import { Tools } from './route/tools.component.js'

export const routes: RouteObject[] = [
  {
    index: true,
    Component: Root,
  },
  {
    path: 'tools',
    Component: Tools,
  },
]
