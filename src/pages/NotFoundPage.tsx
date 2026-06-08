import { Link } from 'react-router-dom'
import styles from './Page.module.css'

export function NotFoundPage() {
  return (
    <section className={`${styles.page} ${styles.notFound}`}>
      <p className={styles.notFoundCode}>404</p>
      <h2 className={styles.title}>Page not found</h2>
      <p className={styles.lead}>
        The route you requested does not exist. Check the URL or return to the case list.
      </p>
      <div className={styles.actions}>
        <Link to="/" className={styles.buttonLink}>
          Go to case list
        </Link>
        <Link to="/new" className={styles.buttonLinkSecondary}>
          New application
        </Link>
      </div>
    </section>
  )
}
