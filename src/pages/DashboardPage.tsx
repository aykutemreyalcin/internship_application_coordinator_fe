import styles from './Page.module.css'

export function DashboardPage() {
  return (
    <section className={styles.page}>
      <p className={styles.eyebrow}>Overview</p>
      <h2 className={styles.title}>Dashboard</h2>
      <p className={styles.lead}>
        Review internship applications, track statuses, and open cases for coordinator review.
      </p>
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Case list coming soon</h3>
        <p className={styles.cardText}>
          The application table, filters, and search will be added in the next tasks. This page
          already renders inside the shared AppShell layout.
        </p>
      </div>
    </section>
  )
}
