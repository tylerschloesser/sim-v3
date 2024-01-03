import { createRoot } from 'react-dom/client'
import {
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom'
import invariant from 'tiny-invariant'
import { Context, IContext } from './context.js'
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

const context: IContext = {
  render() {},
}

createRoot(container).render(
  <Context.Provider value={context}>
    <RouterProvider router={router} />,
  </Context.Provider>,
)
