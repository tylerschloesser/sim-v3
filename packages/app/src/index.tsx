import { createRoot } from 'react-dom/client'
import {
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom'
import invariant from 'tiny-invariant'
import { HomePage } from './page/home.component.js'

const container = document.getElementById('app')
invariant(container)

const router = createBrowserRouter([
  {
    path: '/',
    Component: HomePage,
  },
])

createRoot(container).render(
  <RouterProvider router={router} />,
)
