import { routes } from '@sim-v3/game'
import { useEffect, useState } from 'react'
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
  const [erudaEnabled, setErudaEnabled] =
    useState<boolean>(false)

  useEffect(() => {
    if (!erudaEnabled) return
    import('eruda').then(({ default: eruda }) => {
      eruda.init()
    })
    return () => {
      import('eruda').then(({ default: eruda }) => {
        eruda.destroy()
      })
    }
  }, [erudaEnabled])

  return (
    <div className={styles['dev-toolbar']}>
      <label className={styles.label}>
        <input
          type="checkbox"
          checked={erudaEnabled}
          onChange={(ev) => {
            setErudaEnabled(ev.target.checked)
          }}
        />
        Eruda
      </label>
    </div>
  )
}
