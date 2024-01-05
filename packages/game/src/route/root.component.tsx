import { useNavigate, useParams } from 'react-router-dom'
import invariant from 'tiny-invariant'
import styles from './root.module.scss'

export function Root() {
  const worldId = useWorldId()
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      <a
        className={styles.link}
        href={`${worldId}/tools`}
        onPointerUp={(ev) => {
          ev.preventDefault()
          navigate('tools')
        }}
      >
        Tools
      </a>
    </div>
  )
}

function useWorldId() {
  const params = useParams<{ id: string }>()
  invariant(params.id)
  return params.id
}
