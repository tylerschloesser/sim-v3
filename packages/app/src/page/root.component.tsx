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
        onClick={(e) => {
          e.preventDefault()
          navigate('world')
        }}
      >
        World
      </a>
    </div>
  )
}
