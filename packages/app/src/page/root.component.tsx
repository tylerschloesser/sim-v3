import styles from './root.module.scss'

export function RootPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Welcome!</h1>
      <button className={styles.button}>Test</button>
    </div>
  )
}
