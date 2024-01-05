import { useEffect, useRef, useState } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import invariant from 'tiny-invariant'
import {
  AbortReason,
  Context,
  IContext,
  initContext,
} from '../context.js'
import { initViewport } from '../viewport.js'
import styles from './world.module.scss'

function useWorldId() {
  const params = useParams<{ id: string }>()
  invariant(params.id)
  return params.id
}

export function WorldPage() {
  const worldId = useWorldId()
  const canvas = useRef<HTMLCanvasElement>(null)
  const [context, setContext] = useState<IContext | null>(
    null,
  )
  useEffect(() => {
    invariant(canvas.current)
    const controller = new AbortController()

    // TODO remove this after testing
    controller.signal.addEventListener('abort', () => {
      console.log('abort reason:', controller.signal.reason)
    })

    const viewport = initViewport(
      canvas.current,
      controller.signal,
    )

    initContext({
      worldId,
      viewport,
      signal: controller.signal,
    }).then(setContext)

    return () => {
      controller.abort(AbortReason.EffectCleanup)
    }
  }, [worldId])
  return (
    <>
      <canvas className={styles.canvas} ref={canvas} />
      {context && (
        <Context.Provider value={context}>
          <Outlet />
        </Context.Provider>
      )}
    </>
  )
}
