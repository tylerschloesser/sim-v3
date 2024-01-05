import { routes } from '@sim-v3/game'
import { useEffect, useRef, useState } from 'react'
import {
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom'
import invariant from 'tiny-invariant'
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
  const erudaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!erudaEnabled) return
    import('eruda').then(({ default: eruda }) => {
      invariant(erudaRef.current)
      eruda.init({ container: erudaRef.current })
      return
    })
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
      {erudaEnabled && (
        <div data-hint="eruda" ref={erudaRef} />
      )}
    </div>
  )
}
