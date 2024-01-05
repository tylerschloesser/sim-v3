import { useNavigate } from 'react-router-dom'
import styles from './root.module.scss'

export function RootPage() {
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Welcome!</h1>
      <a
        href="world"
        className={styles.link}
        onPointerUp={(e) => {
          e.preventDefault()
          navigate('world/test')
        }}
      >
        World
      </a>
    </div>
  )
}
