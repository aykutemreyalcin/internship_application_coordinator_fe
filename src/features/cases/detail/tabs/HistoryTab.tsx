import styles from './tabs.module.css'

export function HistoryTab() {
  return (
    <div className={styles.tabContent}>
      <h3 className={styles.tabHeading}>Case History</h3>
      <p className={styles.placeholder}>
        Audit timeline will load from <code>GET /cases/&#123;id&#125;/audit</code> in a
        follow-up task.
      </p>
    </div>
  )
}
