import { routes } from '@sim-v3/game'
import {
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom'
import './index.scss'
import { RootPage } from './page/root.component.js'
import { WorldPage } from './page/world.component.js'

const router = createBrowserRouter([
  {
    index: true,
    Component: RootPage,
  },
  {
    path: 'world/:id',
    Component: WorldPage,
    children: routes,
  },
])

export function App() {
  return <RouterProvider router={router} />
}
