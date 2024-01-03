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
    path: '/',
    Component: RootPage,
  },
  {
    path: '/world',
    Component: WorldPage,
  },
])

createRoot(container).render(
  <RouterProvider router={router} />,
)
