import { createRoot } from 'react-dom/client'
import {
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom'
import invariant from 'tiny-invariant'
import { RootPage } from './page/root.component.js'

const container = document.getElementById('app')
invariant(container)

const router = createBrowserRouter([
  {
    path: '/',
    Component: RootPage,
  },
])

createRoot(container).render(
  <RouterProvider router={router} />,
)
