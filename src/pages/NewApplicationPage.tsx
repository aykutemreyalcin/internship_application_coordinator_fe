import styles from './Page.module.css'

export function NewApplicationPage() {
  return (
    <section className={styles.page}>
      <p className={styles.eyebrow}>Intake</p>
      <h2 className={styles.title}>New Application</h2>
      <p className={styles.lead}>
        Upload a student internship application PDF to create a new case for processing.
      </p>
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Upload flow coming soon</h3>
        <p className={styles.cardText}>
          PDF upload and case creation will be wired to the backend API in a follow-up task. This
          page already renders inside the shared AppShell layout.
        </p>
      </div>
    </section>
  )
}
