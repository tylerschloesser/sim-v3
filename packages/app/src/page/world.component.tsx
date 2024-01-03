import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import invariant from 'tiny-invariant'
import {
  AbortReason,
  Context,
  IContext,
  initContext,
} from '../context.js'
import styles from './world.module.scss'

function useWorldId() {
  const params = useParams<{ id: string }>()
  invariant(params.id)
  return params.id
}

export function WorldPage() {
  const worldId = useWorldId()
  const container = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [context, setContext] = useState<IContext | null>(
    null,
  )
  useEffect(() => {
    invariant(container.current)
    invariant(canvas.current)
    const controller = new AbortController()

    // TODO remove this after testing
    controller.signal.addEventListener('abort', () => {
      console.log('abort reason:', controller.signal.reason)
    })

    initContext(
      worldId,
      container.current,
      canvas.current,
      controller,
    ).then(setContext)
    return () => {
      controller.abort(AbortReason.EffectCleanup)
    }
  }, [worldId])
  return (
    <>
      <div className={styles.container} ref={container}>
        <canvas
          className={styles.canvas}
          ref={canvas}
        ></canvas>
      </div>
      {context && (
        <Context.Provider value={context}>
          TODO
        </Context.Provider>
      )}
    </>
  )
}
