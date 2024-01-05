import { routes } from '@sim-v3/game'
import { createRoot } from 'react-dom/client'
import {
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom'
import invariant from 'tiny-invariant'
import './index.scss'
import { RootPage } from './page/root.component.js'
import { WorldPage } from './page/world.component.js'

const container = document.getElementById('app')
invariant(container)

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

createRoot(container).render(
  <RouterProvider router={router} />,
)
