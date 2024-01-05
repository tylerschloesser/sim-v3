import { routes } from '@sim-v3/game'
import { useState } from 'react'
import {
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom'
import styles from './app.module.scss'
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
  return (
    <div className={styles.app}>
      <DevToolbar />
      <RouterProvider router={router} />
    </div>
  )
}

function DevToolbar() {
  const [eruda, setEruda] = useState<boolean>(false)

  return (
    <div className={styles['dev-toolbar']}>
      <label className={styles.label}>
        <input
          type="checkbox"
          checked={eruda}
          onChange={(ev) => {
            setEruda(ev.target.checked)
          }}
        />
        Eruda
      </label>
    </div>
  )
}
